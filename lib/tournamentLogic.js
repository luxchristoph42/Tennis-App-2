export const addMins = (t, m) => {
  const [h, mn] = t.split(':').map(Number);
  const tot = h * 60 + mn + m;
  return `${String(Math.floor(tot / 60) % 24).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
};

export const buildTournamentSchedule = (players, courts, startT, dur, separateGender) => {
  const act = players.filter(p => p.checked_in);
  if (act.length < 2) return { error: 'Mindestens 2 eingecheckte Spieler!' };

  const cats = {};

  // 1. Kategorien zuweisen
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

  const courtSchedules = {};
  for (let i = 1; i <= courts; i++) {
    courtSchedules[i] = { time: startT, matches: [] };
  }

  let matchCnt = 0;

  // 2. Spiele pro Kategorie generieren
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

      const cCourt = (matchCnt % courts) + 1;
      const sched = courtSchedules[cCourt];
      const groupName = String.fromCharCode(65 + currentGroupLetter);

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
      currentGroupLetter++;
      matchCnt++;
    };

    // Gruppen-Größen abarbeiten
    for (let i = 0; i < d.g5; i++) addPool(5);
    for (let i = 0; i < d.g4; i++) addPool(4);
    for (let i = 0; i < d.g3; i++) addPool(3);
    for (let i = 0; i < d.g2; i++) addPool(2);

    // 3. K.-o.-Runde erzwingen, wenn mehr als eine Gruppe entstanden ist
    if (currentGroupLetter >= 2) {
      // Halbfinale 1
      const courtHF1 = (matchCnt % courts) + 1;
      const schedHF1 = courtSchedules[courtHF1];
      schedHF1.matches.push({
        category: `${c} - Halbfinale 1`,
        player1_name: `Sieger Gruppe A`,
        player2_name: `Zweiter Gruppe B`,
        court: `Platz ${courtHF1} (${schedHF1.time} Uhr)`,
        status: 'Ausstehend'
      });
      schedHF1.time = addMins(schedHF1.time, parseInt(dur));
      matchCnt++;

      // Halbfinale 2
      const courtHF2 = (matchCnt % courts) + 1;
      const schedHF2 = courtSchedules[courtHF2];
      schedHF2.matches.push({
        category: `${c} - Halbfinale 2`,
        player1_name: `Sieger Gruppe B`,
        player2_name: currentGroupLetter === 2 ? `Zweiter Gruppe A` : `Sieger Gruppe C`,
        court: `Platz ${courtHF2} (${schedHF2.time} Uhr)`,
        status: 'Ausstehend'
      });
      schedHF2.time = addMins(schedHF2.time, parseInt(dur));
      matchCnt++;

      // Finale
      const courtF = (matchCnt % courts) + 1;
      const schedF = courtSchedules[courtF];
      schedF.matches.push({
        category: `${c} - FINALE 🏆`,
        player1_name: `Sieger Halbfinale 1`,
        player2_name: `Sieger Halbfinale 2`,
        court: `Platz ${courtF} (${schedF.time} Uhr)`,
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
