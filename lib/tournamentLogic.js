import { allocateMatchesToCourts } from './courtAllocator';
import { determineKoRounds } from './koDeterminer';

export const addMins = (t, m) => {
  const [h, mn] = t.split(':').map(Number);
  const tot = h * 60 + mn + m;
  return `${String(Math.floor(tot / 60) % 24).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
};

export const buildTournamentSchedule = (players, courts, startT, endT, dur, separateGender) => {
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

  // Dynamische Umrechnung des eingetragenen Turnierenden in Minuten
  const [endH, endM] = (endT || "16:00").split(':').map(Number);
  const maxEndMinutes = endH * 60 + endM; 
  
  const [startH, startM] = startT.split(':').map(Number);
  const totalAvailableMinutes = maxEndMinutes - (startH * 60 + startM);

  const groupPool = [];
  let semiPool = [];
  let finalPool = [];

  Object.keys(cats).forEach(c => {
    const arr = cats[c];
    if (arr.length < 2) return;
    
    let currentGroupLetter = 0;
    const itemsPerGroup = Math.ceil(arr.length / 4);

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

    const estimatedGroupRounds = Math.ceil(groupPool.length / courts);
    const spentMinutes = estimatedGroupRounds * dur;
    const remainingMinutes = totalAvailableMinutes - spentMinutes;

    const { semiMatches, finalMatches } = determineKoRounds(currentGroupLetter, remainingMinutes, dur, c);
    semiPool = [...semiPool, ...semiMatches];
    finalPool = [...finalPool, ...finalMatches];
  });

  const { finalM } = allocateMatchesToCourts(groupPool, semiPool, finalPool, courts, startT, dur);
  return { finalM };
};

export const checkAndAdvanceGroup = async (supabase, categoryName, groupLetter, mode = 'time') => {
  const fullGroupLabel = `${categoryName} - Gr. ${groupLetter}`;
  const { data: matches } = await supabase.from('matches').select('*').eq('category', fullGroupLabel);
  if (!matches || !matches.every(m => m.status === 'Beendet')) return;

  const ranking = calculateStandings(matches, mode);
  if (ranking.length < 2) return;

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

export const calculateStandings = (groupMatches, mode = 'time') => {
  const stats = {};
  groupMatches.forEach(m => {
    const p1 = m.player1_name; const p2 = m.player2_name;
    if (!stats[p1]) stats[p1] = { name: p1, matchesPlayed: 0, wins: 0, losses: 0, gamesWon: 0, gamesLost: 0, diff: 0 };
    if (!stats[p2]) stats[p2] = { name: p2, matchesPlayed: 0, wins: 0, losses: 0, gamesWon: 0, gamesLost: 0, diff: 0 };

    if (m.status === 'Beendet' && m.result) {
      stats[p1].matchesPlayed += 1; stats[p2].matchesPlayed += 1;
      let p1G = 0, p2G = 0;
      const parts = m.result.split(':').map(Number);
      if (parts.length === 2 && !isNaN(parts) && !isNaN(parts)) { p1G = parts[0]; p2G = parts[1]; }
      stats[p1].gamesWon += p1G; stats[p1].gamesLost += p2G;
      stats[p2].gamesWon += p2G; stats[p2].gamesLost += p1G;
      if (m.winner === p1) { stats[p1].wins += 1; stats[p2].losses += 1; }
      else { stats[p2].wins += 1; stats[p1].losses += 1; }
    }
  });

  return Object.values(stats).sort((a, b) => {
    if (mode === 'time') {
      if (b.gamesWon !== a.gamesWon) return b.gamesWon - a.gamesWon;
      return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
    }
    if (b.wins !== a.wins) return b.wins - a.wins;
    return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
  });
};
