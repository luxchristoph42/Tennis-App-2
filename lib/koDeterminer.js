// Berechnet das KO-Runden-Format basierend auf der verbleibenden Zeit
export const determineKoRounds = (poolCount, availableMinutes, dur, categoryName) => {
  const semiMatches = [];
  const finalMatches = [];

  // FALL 1: Genau 2 Gruppen (Klassischer Fall)
  if (poolCount === 2) {
    if (availableMinutes >= dur * 2) { // Genug Zeit für HF + Finale
      semiMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: 'Zweiter Gruppe B', status: 'Ausstehend' });
      semiMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Gruppe B', player2_name: 'Zweiter Gruppe A', status: 'Ausstehend' });
      finalMatches.push({ category: `${categoryName} - FINALE 🏆`, player1_name: 'Sieger Halbfinale 1', player2_name: 'Sieger Halbfinale 2', status: 'Ausstehend' });
    }
  } 
  
  // FALL 2: 4 Gruppen (Perfekt für dein 16-Trainer-Testturnier!)
  else if (poolCount === 4) {
    // Haben wir genug Zeit für Viertelfinale + Halbfinale + Finale? (Mindestens 3 Spielrunden übrig)
    if (availableMinutes >= dur * 3) {
      // Viertelfinals werden als Vorstufe in den Gruppenpool oder Semipool gelegt
      semiMatches.push({ category: `${categoryName} - Viertelfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: 'Zweiter Gruppe B', status: 'Ausstehend' });
      semiMatches.push({ category: `${categoryName} - Viertelfinale 2`, player1_name: 'Sieger Gruppe B', player2_name: 'Zweiter Gruppe A', status: 'Ausstehend' });
      semiMatches.push({ category: `${categoryName} - Viertelfinale 3`, player1_name: 'Sieger Gruppe C', player2_name: 'Zweiter Gruppe D', status: 'Ausstehend' });
      semiMatches.push({ category: `${categoryName} - Viertelfinale 4`, player1_name: 'Sieger Gruppe D', player2_name: 'Zweiter Gruppe C', status: 'Ausstehend' });
      
      // Platzhalter für die darauffolgenden Runden
      finalMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Viertelfinale 1', player2_name: 'Sieger Viertelfinale 3', status: 'Ausstehend' });
      finalMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Viertelfinale 2', player2_name: 'Sieger Viertelfinale 4', status: 'Ausstehend' });
      finalMatches.push({ category: `${categoryName} - FINALE 🏆`, player1_name: 'Sieger Halbfinale 1', player2_name: 'Sieger Halbfinale 2', status: 'Ausstehend' });
    } 
    // Zeit reicht nur noch für 2 Runden (Direkt Halbfinale mit den 4 Gruppensiegern)
    else if (availableMinutes >= dur * 2) {
      semiMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: 'Sieger Gruppe B', status: 'Ausstehend' });
      semiMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Gruppe C', player2_name: 'Sieger Gruppe D', status: 'Ausstehend' });
      finalMatches.push({ category: `${categoryName} - FINALE 🏆`, player1_name: 'Sieger Halbfinale 1', player2_name: 'Sieger Halbfinale 2', status: 'Ausstehend' });
    }
  }

  return { semiMatches, finalMatches };
};
