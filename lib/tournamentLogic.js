export const addMins = (t, m) => {
  const [h, mn] = t.split(':').map(Number);
  const tot = h * 60 + mn + m;
  return `${String(Math.floor(tot / 60) % 24).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
};

// Generiert den Turnierbaum (unverändert schlank)
export const buildTournamentSchedule = (players, courts, startT, dur, separateGender) => {
  const act = players.filter(p => p.checked_in);
  if (act.length < 2) return { error: 'Mindestens 2 eingecheckte Spieler!' };
  const cats = {};

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

  const courtSchedules = {};
  for (let i = 1; i <= courts; i++) courtSchedules[i] = { time: startT, matches: [] };
  let matchCnt = 0;

  Object.keys(cats).forEach(c => {
    const arr = cats[c];
    if (arr.length < 2) return;
    
    // Einfache Aufteilung in 3er/4er Gruppen
    let currentGroupLetter = 0;
    const cCourt = (matchCnt % courts) + 1;
    const sched = courtSchedules[cCourt];
    const groupName = String.fromCharCode(65 + currentGroupLetter);

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        sched.matches.push({
          category: `${c} - Gr. ${groupName}`,
          player1_name: arr[i].name,
          player2_name: arr[j].name,
          court: `Platz ${cCourt} (${sched.time} Uhr)`,
          status: 'Ausstehend'
        });
        sched.time = addMins(sched.time, parseInt(dur));
      }
    }
    matchCnt++;
  });

  const finalM = [];
  Object.keys(courtSchedules).forEach(c => finalM.push(...courtSchedules[c].matches));
  return { finalM };
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

      // Parsing des Ergebnisses (z.B. "6:2" oder "6:4, 2:6, 10:8")
      let p1Games = 0;
      let p2Games = 0;

      if (mode === 'time') {
        // Bei Match auf Zeit zählen wir einfach stur die Spiele zusammen (z.B. "6:5")
        const parts = m.result.split(':').map(Number);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          p1Games = parts[0];
          p2Games = parts[1];
        }
      } else {
        // Beim Satz-System extrahieren wir alle Sätze einzeln
        const sets = m.result.split(',');
        sets.forEach(s => {
          const parts = s.trim().split(':').map(Number);
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            p1Games += parts[0];
            p2Games += parts[1];
          }
        });
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

  // Sortier-Algorithmus
  return Object.values(stats).sort((a, b) => {
    if (mode === 'time') {
      // 1. Priorität bei Zeit-Tennis: Reine Anzahl gewonnener Spiele (Games)
      if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon;
      // 2. Priorität: Tordifferenz (Spieldifferenz)
      return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
    } else {
      // Klassisch: Erst nach gewonnenen Matches (Siegen), dann nach Spieldifferenz
      if (b.wins !== a.wins) return b.wins - a.wins;
      return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
    }
  });
};

// Automatisches Weiterkommen ins Halbfinale
export const checkAndAdvanceGroup = async (supabase, categoryName, groupLetter, mode = 'time') => {
  const fullGroupLabel = `${categoryName} - Gr. ${groupLetter}`;
  const { data: matches } = await supabase.from('matches').select('*').eq('category', fullGroupLabel);
  if (!matches || matches.length === 0 || !matches.every(m => m.status === 'Beendet')) return;

  const ranking = calculateStandings(matches, mode);
  if (ranking.length < 2) return;

  const firstPlace = ranking[0].name;
  const secondPlace = ranking[1].name;

  await supabase.from('matches').update({ player1_name: firstPlace }).eq('category', `${categoryName} - Halbfinale 1`).eq('player1_name', `Sieger Gruppe ${groupLetter}`);
  await supabase.from('matches').update({ player2_name: secondPlace }).eq('category', `${categoryName} - Halbfinale 1`).eq('player2_name', `Zweiter Gruppe ${groupLetter}`);
  await supabase.from('matches').update({ player1_name: firstPlace }).eq('category', `${categoryName} - Halbfinale 2`).eq('player1_name', `Sieger Gruppe ${groupLetter}`);
  await supabase.from('matches').update({ player2_name: secondPlace }).eq('category', `${categoryName} - Halbfinale 2`).eq('player2_name', `Zweiter Gruppe ${groupLetter}`);
};

export const checkAndAdvanceKO = async (supabase, categoryName, matchCategory) => {
  if (!matchCategory.includes('Halbfinale')) return;
  const hfNumber = matchCategory.includes('Halbfinale 1') ? 1 : 2;
  const { data: hfMatch } = await supabase.from('matches').select('*').eq('category', `${categoryName} - Halbfinale ${hfNumber}`).single();
  if (!hfMatch || hfMatch.status !== 'Beendet' || !hfMatch.winner) return;

  if (hfNumber === 1) {
    await supabase.from('matches').update({ player1_name: hfMatch.winner }).eq('category', `${categoryName} - FINALE 🏆`).eq('player1_name', 'Sieger Halbfinale 1');
  } else {
    await supabase.from('matches').update({ player2_name: hfMatch.winner }).eq('category', `${categoryName} - FINALE 🏆`).eq('player2_name', 'Sieger Halbfinale 2');
  }
};
