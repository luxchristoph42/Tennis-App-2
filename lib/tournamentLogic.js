// Hilfsfunktion zum Berechnen der Uhrzeit
export const addMins = (t, m) => {
  const [h, mn] = t.split(':').map(Number);
  const tot = h * 60 + mn + m;
  return `${String(Math.floor(tot / 60) % 24).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
};

// Hauptfunktion zur Generierung des gesamten Spielplans (Fließband-Prinzip)
export const buildTournamentSchedule = (players, courts, startT, dur, separateGender) => {
  const act = players.filter(p => p.checked_in);
  if (act.length < 2) return { error: 'Mindestens 2 eingecheckte Spieler!' };

  const cats = {};

  // 1. Spieler in Kategorien einsortieren
  act.forEach(p => {
    if (p.assigned_category) {
      const catKey = p.assigned_category;
      if (!cats[catKey]) cats[catKey] = [];
      cats[catKey].push(p);
      return;
    }

    const age = 2026 - p.birth_year;
    let ageCat = 'Open';
    if (age <= 12) ageCat = 'U12';
    else if (age <= 15) ageCat = 'U15';
    else if (age <= 18) ageCat = 'U18';

    let gen = (p.gender || 'm').toLowerCase().charAt(0);
    if (gen === 'd') gen = 'w';
    
    const catKey = separateGender ? `${ageCat} ${gen.toUpperCase()}` : ageCat;

    if (!cats[catKey]) cats[catKey] = [];
    cats[catKey].push(p);
  });

  const getDist = (cnt) => {
    if (cnt < 3) return { g3: 0, g4: 0, g5: 0, g2: cnt === 2 ? 1 : 0 };
    if (cnt === 4) return { g3: 0, g4: 1, g5: 0, g2: 0 };
    if (cnt === 5) return { g3: 0, g4: 0, g5: 1, g2: 0 };
    const r = cnt % 3;
    if (r === 0) return { g3: cnt / 3, g4: 0, g5: 0, g2: 0 };
    if (r === 1) return { g3: Math.floor((cnt - 4) / 3), g4: 1, g5: 0, g2: 0 };
    return { g3: Math.floor((cnt - 8) / 3), g4: 2, g5: 0, g2: 0 };
  };

  // Zentraler Sammeltopf für ALLE Spiele des Turniers
  const allGeneratedMatches = [];

  // 2. Spiele für alle Kategorien berechnen und im Topf sammeln
  Object.keys(cats).forEach(c => {
    const arr = cats[c];
    if (arr.length < 2) return;
    
    const d = getDist(arr.length);
    let idx = 0;
    let currentGroupLetter = 0;

    const addPool = (sz) => {
      if (sz <= 0) return;
      const pPlayers = arr.slice(idx, idx + sz);
      if (pPlayers.length < 2) return;

      const groupName = String.fromCharCode(65 + currentGroupLetter);

      for (let i = 0; i < pPlayers.length; i++) {
        for (let j = i + 1; j < pPlayers.length; j++) {
          allGeneratedMatches.push({
            category: `${c} - Gr. ${groupName}`,
            player1_name: pPlayers[i].name,
            player2_name: pPlayers[j].name,
            status: 'Ausstehend'
          });
        }
      }
      idx += sz;
      currentGroupLetter++;
    };

    for (let i = 0; i < d.g5; i++) addPool(5);
    for (let i = 0; i < d.g4; i++) addPool(4);
    for (let i = 0; i < d.g3; i++) addPool(3);
    for (let i = 0; i < d.g2; i++) addPool(2);

    // K.-o.-Spiele direkt mit in den Topf werfen, falls es >= 2 Gruppen gibt
    if (currentGroupLetter >= 2) {
      allGeneratedMatches.push({
        category: `${c} - Halbfinale 1`,
        player1_name: `Sieger Gruppe A`,
        player2_name: `Zweiter Gruppe B`,
        status: 'Ausstehend'
      });
      allGeneratedMatches.push({
        category: `${c} - Halbfinale 2`,
        player1_name: `Sieger Gruppe B`,
        player2_name: currentGroupLetter === 2 ? `Zweiter Gruppe A` : `Sieger Gruppe C`,
        status: 'Ausstehend'
      });
      allGeneratedMatches.push({
        category: `${c} - FINALE 🏆`,
        player1_name: `Sieger Halbfinale 1`,
        player2_name: `Sieger Halbfinale 2`,
        status: 'Ausstehend'
      });
    }
  });

  // 3. FLIESSBAND-RECHNER: Verrechne die gesammelten Spiele gleichmäßig auf die Plätze
  const finalM = [];
  const courtNextFreeTime = {};
  
  // Startzeiten für jeden Platz initialisieren
  for (let i = 1; i <= courts; i++) {
    courtNextFreeTime[i] = startT;
  }

  // Jedes Spiel nacheinander dem Platz zuweisen, der als nächstes frei wird
  allGeneratedMatches.forEach((match, index) => {
    // Ermittle den Platz (1 bis Anzahl Courts) im Rotationsprinzip
    const assignedCourtNumber = (index % courts) + 1;
    const currentFreeTime = courtNextFreeTime[assignedCourtNumber];

    finalM.push({
      ...match,
      court: `Platz ${assignedCourtNumber} (${currentFreeTime} Uhr)`
    });

    // Erhöhe die Zeit für diesen spezifischen Platz um die Spieldauer
    courtNextFreeTime[assignedCourtNumber] = addMins(currentFreeTime, parseInt(dur));
  });

  return { finalM };
};

// Berechnet die Platzierungen einer Gruppe und aktualisiert Platzhalter im Halbfinale
export const checkAndAdvanceGroup = async (supabase, categoryName, groupLetter, mode = 'time') => {
  const fullGroupLabel = `${categoryName} - Gr. ${groupLetter}`;
  
  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .eq('category', fullGroupLabel);
    
  if (error || !matches || matches.length === 0) return;

  const allFinished = matches.every(m => m.status === 'Beendet');
  if (!allFinished) return;

  const stats = {};
  matches.forEach(m => {
    if (!stats[m.player1_name]) stats[m.player1_name] = { name: m.player1_name, wins: 0 };
    if (!stats[m.player2_name]) stats[m.player2_name] = { name: m.player2_name, wins: 0 };
    
    if (m.winner === m.player1_name) stats[m.player1_name].wins += 1;
    if (m.winner === m.player2_name) stats[m.player2_name].wins += 1;
  });

  const ranking = Object.values(stats).sort((a, b) => b.wins - a.wins);
  if (ranking.length < 2) return;

  // FIX: Array-Zugriff korrigiert von ranking.name zu ranking[0].name
  const firstPlace = ranking[0].name;
  const secondPlace = ranking[1].name;

  // Halbfinale 1 aktualisieren
  await supabase
    .from('matches')
    .update({ player1_name: firstPlace })
    .eq('category', `${categoryName} - Halbfinale 1`)
    .eq('player1_name', `Sieger Gruppe ${groupLetter}`);

  await supabase
    .from('matches')
    .update({ player2_name: secondPlace })
    .eq('category', `${categoryName} - Halbfinale 1`)
    .eq('player2_name', `Zweiter Gruppe ${groupLetter}`);

  // Halbfinale 2 aktualisieren
  await supabase
    .from('matches')
    .update({ player1_name: firstPlace })
    .eq('category', `${categoryName} - Halbfinale 2`)
    .eq('player1_name', `Sieger Gruppe ${groupLetter}`);

  await supabase
    .from('matches')
    .update({ player2_name: secondPlace })
    .eq('category', `${categoryName} - Halbfinale 2`)
    .eq('player2_name', `Zweiter Gruppe ${groupLetter}`);
};

// Berechnet die Halbfinals und schiebt Gewinner ins große Finale vor
export const checkAndAdvanceKO = async (supabase, categoryName, matchCategory) => {
  if (!matchCategory.includes('Halbfinale')) return;

  const hfNumber = matchCategory.includes('Halbfinale 1') ? 1 : 2;

  const { data: hfMatch, error } = await supabase
    .from('matches')
    .select('*')
    .eq('category', `${categoryName} - Halbfinale ${hfNumber}`)
    .single();

  if (error || !hfMatch || hfMatch.status !== 'Beendet' || !hfMatch.winner) return;

  const winnerName = hfMatch.winner;

  if (hfNumber === 1) {
    await supabase
      .from('matches')
      .update({ player1_name: winnerName })
      .eq('category', `${categoryName} - FINALE 🏆`)
      .eq('player1_name', 'Sieger Halbfinale 1');
  } else {
    await supabase
      .from('matches')
      .update({ player2_name: winnerName })
      .eq('category', `${categoryName} - FINALE 🏆`)
      .eq('player2_name', 'Sieger Halbfinale 2');
  }
};

// Berechnet die echten Ranglisten-Stände basierend auf dem gewählten Modus (Zeit vs Sätze)
export const calculateStandings = (groupMatches, mode = 'time') => {
  const stats = {};

  groupMatches.forEach(m => {
    const p1 = m.player1_name;
    const p2 = m.player2_name;

    if (!stats[p1]) stats[p1] = { name: p1, matchesPlayed: 0, wins: 0, losses: 0, gamesWon: 0, gamesLost: 0, diff: 0 };
    if (!stats[p2]) stats[p2] = { name: p2, matchesPlayed: 0, wins: 0, losses: 0, gamesWon: 0, gamesLost: 0, diff: 0 };

    if (m.status === 'Beendet' && m.result) {
      stats[p1].matchesPlayed += 1;
      stats[p2].matchesPlayed += 1;

      let p1Games = 0;
      let p2Games = 0;

      const parts = m.result.split(':').map(Number);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        p1Games = parts[0];
        p2Games = parts[1];
      }

      stats[p1].gamesWon += p1Games;
      stats[p1].gamesLost += p2Games;
      stats[p2].gamesWon += p2Games;
      stats[p2].gamesLost += p1Games;

      if (m.winner === p1) {
        stats[p1].wins += 1;
        stats[p2].losses += 1;
      } else {
        stats[p2].wins += 1;
        stats[p1].losses += 1;
      }
    }
  });

  return Object.values(stats).sort((a, b) => {
    if (mode === 'time') {
      if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon;
      return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
    } else {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
    }
  });
};
