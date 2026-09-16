// Berechnet das KO-Runden-Format flexibel basierend auf der verbleibenden Zeit und der Gruppenanzahl
export const determineKoRounds = (poolCount, availableMinutes, dur, categoryName) => {
  const semiMatches = [];
  const finalMatches = [];

  // Wenn es nur eine einzige Gruppe gibt, macht eine KO-Runde keinen Sinn
  if (poolCount <= 1) {
    return { semiMatches, finalMatches };
  }

  // Genug Zeit für 3 KO-Runden? (Viertelfinale + Halbfinale + Finale = mind. 3 * Spieldauer)
  // Das macht Sinn, wenn wir viele Gruppen haben (z.B. 4 oder 5 Gruppen bei 16 Trainern)
  if (poolCount >= 4 && availableMinutes >= dur * 3) {
    semiMatches.push({ category: `${categoryName} - Viertelfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: 'Zweiter Gruppe B', status: 'Ausstehend' });
    semiMatches.push({ category: `${categoryName} - Viertelfinale 2`, player1_name: 'Sieger Gruppe B', player2_name: 'Zweiter Gruppe A', status: 'Ausstehend' });
    semiMatches.push({ category: `${categoryName} - Viertelfinale 3`, player1_name: 'Sieger Gruppe C', player2_name: 'Zweiter Gruppe D', status: 'Ausstehend' });
    // Falls eine 5. Gruppe existiert, spielt der Sieger E gegen den besten verbleibenden Zweiten, ansonsten gegen den Zweiten aus C
    semiMatches.push({ category: `${categoryName} - Viertelfinale 4`, player1_name: poolCount >= 5 ? 'Sieger Gruppe E' : 'Sieger Gruppe D', player2_name: 'Zweiter Gruppe C', status: 'Ausstehend' });
    
    finalMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Viertelfinale 1', player2_name: 'Sieger Viertelfinale 3', status: 'Ausstehend' });
    finalMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Viertelfinale 2', player2_name: 'Sieger Viertelfinale 4', status: 'Ausstehend' });
    finalMatches.push({ category: `${categoryName} - FINALE 🏆`, player1_name: 'Sieger Halbfinale 1', player2_name: 'Sieger Halbfinale 2', status: 'Ausstehend' });
  } 
  
  // Zeit reicht nur noch für 2 KO-Runden (Direkt Halbfinale + Finale = mind. 2 * Spieldauer)
  else if (availableMinutes >= dur * 2) {
    semiMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: poolCount >= 3 ? 'Sieger Gruppe C' : 'Zweiter Gruppe B', status: 'Ausstehend' });
    semiMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Gruppe B', player2_name: poolCount >= 4 ? 'Sieger Gruppe D' : 'Zweiter Gruppe A', status: 'Ausstehend' });
    finalMatches.push({ category: `${categoryName} - FINALE 🏆`, player1_name: 'Sieger Halbfinale 1', player2_name: 'Sieger Halbfinale 2', status: 'Ausstehend' });
  }

  return { semiMatches, finalMatches };
};
