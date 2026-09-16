import { allocateMatchesToCourts } from './courtAllocator';
import { determineKoRounds } from './koDeterminer';

export const addMins = (t, m) => {
  const [h, mn] = t.split(':').map(Number);
  const tot = h * 60 + mn + m;
  return `${String(Math.floor(tot / 60) % 24).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
};

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

  // Festgelegtes Turnierende (16:00 Uhr) in Minuten umrechnen
  const maxEndMinutes = 16 * 60; 
  const [startH, startM] = startT.split(':').map(Number);
  const totalAvailableMinutes = maxEndMinutes - (startH * 60 + startM);

  const groupPool = [];
  let semiPool = [];
  let finalPool = [];

  Object.keys(cats).forEach(c => {
    const arr = cats[c];
    if (arr.length < 2) return;
    
    // Einfache Gruppeneinteilung (z.B. 4 Gruppen bei 16 Trainern)
    let currentGroupLetter = 0;
    const itemsPerGroup = Math.ceil(arr.length / 4); // Erzwingt bis zu 4 Gruppen

    for (let i = 0; i < arr.length; i += itemsPerGroup) {
      const pPlayers = arr.slice(i, i + itemsPerGroup);
      if (pPlayers.length < 2) continue;
      const groupName = String.fromCharCode(65 + currentGroupLetter);

      for (let g1 = 0; g1 < pPlayers.length; g1++) {
        for (let g2 = g1 + 1; g2 < pPlayers.length; g2++) {
          groupPool.push({ category: `${c} - Gr. ${groupName}`, player1_name: pPlayers[g1].name, player2_name: pPlayers[g2].name, status: 'Ausstehend' });
        }
      }
      currentGroupLetter++;
    }

    // Zeit-Budget-Abgleich für K.-o.-Phasen
    const estimatedGroupRounds = Math.ceil(groupPool.length / courts);
    const spentMinutes = estimatedGroupRounds * dur;
    const remainingMinutes = totalAvailableMinutes - spentMinutes;

    // Ruft den koDeterminer auf, der je nach verbleibenden Minuten entscheidet!
    const { semiMatches, finalMatches } = determineKoRounds(currentGroupLetter, remainingMinutes, dur, c);
    semiPool = [...semiPool, ...semiMatches];
    finalPool = [...finalPool, ...finalMatches];
  });

  const { finalM } = allocateMatchesToCourts(groupPool, semiPool, finalPool, courts, startT, dur);
  return { finalM };
};

// VORRÜCK-LOGIK (Unverändert stabil)
export const checkAndAdvanceGroup = async (supabase, categoryName, groupLetter) => {
  const fullGroupLabel = `${categoryName} - Gr. ${groupLetter}`;
  const { data: matches } = await supabase.from('matches').select('*').eq('category', fullGroupLabel);
  if (!matches || !matches.every(m => m.status === 'Beendet')) return;

  // Erste Sortierung nach Siegen
  const stats = {};
  matches.forEach(m => {
    if (!stats[m.player1_name]) stats[m.player1_name] = { name: m.player1_name, wins: 0 };
    if (!stats[m.player2_name]) stats[m.player2_name] = { name: m.player2_name, wins: 0 };
    if (m.winner === m.player1_name) stats[m.player1_name].wins += 1;
    if (m.winner === m.player2_name) stats[m.player2_name].wins += 1;
  });
  const ranking = Object.values(stats).sort((a, b) => b.wins - a.wins);
  if (ranking.length < 2) return;

  // Aktualisiert flexibel Halbfinals oder Viertelfinals in der DB
  await supabase.from('matches').update({ player1_name: ranking[0].name }).eq('category', `${categoryName} - Halbfinale 1`).eq('player1_name', `Sieger Gruppe ${groupLetter}`);
  await supabase.from('matches').update({ player2_name: ranking[1].name }).eq('category', `${categoryName} - Halbfinale 1`).eq('player2_name', `Zweiter Gruppe ${groupLetter}`);
  await supabase.from('matches').update({ player1_name: ranking[0].name }).eq('category', `${categoryName} - Viertelfinale 1`).eq('player1_name', `Sieger Gruppe ${groupLetter}`);
};

export const checkAndAdvanceKO = async (supabase, categoryName, matchCategory) => {
  const { data: current } = await supabase.from('matches').select('*').eq('category', matchCategory).single();
  if (!current || current.status !== 'Beendet' || !current.winner) return;

  if (matchCategory.includes('Halbfinale 1')) {
    await supabase.from('matches').update({ player1_name: current.winner }).eq('category', `${categoryName} - FINALE 🏆`).eq('player1_name', 'Sieger Halbfinale 1');
  } else if (matchCategory.includes('Halbfinale 2')) {
    await supabase.from('matches').update({ player2_name: current.winner }).eq('category', `${categoryName} - FINALE 🏆`).eq('player2_name', 'Sieger Halbfinale 2');
  }
};
