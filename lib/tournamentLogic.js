// Hilfsfunktion zum Berechnen der Uhrzeit
export const addMins = (t, m) => {
  const [h, mn] = t.split(':').map(Number);
  const tot = h * 60 + mn + m;
  return `${String(Math.floor(tot / 60) % 24).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
};

// Hauptfunktion zur Generierung des gesamten Spielplans
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
    if (cnt < 3) return { g3: 0, g4: 0, g5: 0 };
    if (cnt === 4) return { g3: 0, g4: 1, g5: 0 };
    if (cnt === 5) return { g3: 0, g4: 0, g5: 1 };
    const r = cnt % 3;
    if (r === 0) return { g3: cnt / 3, g4: 0, g5: 0 };
    if (r === 1) return { g3: Math.floor((cnt - 4) / 3), g4: 1, g5: 0 };
    return { g3: Math.floor((cnt - 8) / 3), g4: 2, g5: 0 };
  };

  const courtSchedules = {};
  for (let i = 1; i <= courts; i++) {
    courtSchedules[i] = { time: startT, matches: [] };
  }

  let matchCnt = 0;

  // 2. Gruppen und KO-Runden pro Kategorie generieren
  Object.keys(cats).forEach(c => {
    const arr = cats[c];
    if (arr.length < 2) return;
    const d = getDist(arr.length);
    let idx = 0, gLet = 0;
    let poolCount = 0;

    const addPool = (sz) => {
      const pPlayers = arr.slice(idx, idx + sz);
      const cCourt = (matchCnt % courts) + 1;
      const sched = courtSchedules[cCourt];
      const groupName = String.fromCharCode(65 + gLet);

      for (let i = 0; i < pPlayers.length; i++) {
        for (let j = i + 1; j < pPlayers.length; j++) {
          sched.matches.push({
            category: `${c} - Gr. ${groupName}`,
            player1_name: pPlayers[i].name,
            player2_name: pPlayers[j].name,
            court: `Platz ${cCourt} (${sched.time} Uhr)`,
            status: 'Ausstehend'
          });
          sched.time = addMins(sched.time, parseInt(dur));
        }
      }
      idx += sz;
      gLet++;
      matchCnt++;
      poolCount++;
    };

    for (let i = 0; i < d.g5; i++) addPool(5);
    for (let i = 0; i < d.g4; i++) addPool(4);
    for (let i = 0; i < d.g3; i++) addPool(3);
    if (arr.length === 2) addPool(2);

    // 3. K.-o.-Runde anhängen, wenn es mindestens 2 Gruppen gibt
    if (poolCount >= 2) {
      const cCourtHF1 = (matchCnt % courts) + 1;
      const schedHF1 = courtSchedules[cCourtHF1];
      schedHF1.matches.push({
        category: `${c} - Halbfinale 1`,
        player1_name: `Sieger Gruppe A`,
        player2_name: `Zweiter Gruppe B`,
        court: `Platz ${cCourtHF1} (${schedHF1.time} Uhr)`,
        status: 'Ausstehend'
      });
      schedHF1.time = addMins(schedHF1.time, parseInt(dur));
      matchCnt++;

      const cCourtHF2 = (matchCnt % courts) + 1;
      const schedHF2 = courtSchedules[cCourtHF2];
      schedHF2.matches.push({
        category: `${c} - Halbfinale 2`,
        player1_name: `Sieger Gruppe B`,
        player2_name: poolCount === 2 ? `Zweiter Gruppe A` : `Sieger Gruppe C`,
        court: `Platz ${cCourtHF2} (${schedHF2.time} Uhr)`,
        status: 'Ausstehend'
      });
      schedHF2.time = addMins(schedHF2.time, parseInt(dur));
      matchCnt++;

      const cCourtF = (matchCnt % courts) + 1;
      const schedF = courtSchedules[cCourtF];
      schedF.matches.push({
        category: `${c} - FINALE 🏆`,
        player1_name: `Sieger Halbfinale 1`,
        player2_name: `Sieger Halbfinale 2`,
        court: `Platz ${cCourtF} (${schedF.time} Uhr)`,
        status: 'Ausstehend'
      });
      schedF.time = addMins(schedF.time, parseInt(dur));
      matchCnt++;
    }
  });

  const finalM = [];
  Object.keys(courtSchedules).forEach(c => finalM.push(...courtSchedules[c].matches));
  return { finalM };
};
