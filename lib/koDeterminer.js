// Berechnet das KO-Runden-Format flexibel basierend auf der verbleibenden Zeit und der Gruppenanzahl
export const determineKoRounds = (poolCount, availableMinutes, dur, categoryName) => {
  const semiMatches = [];
  const finalMatches = [];

  // Wenn es nur 1 Gruppe gibt, gibt es keine KO-Phase
  if (poolCount <= 1) {
    return { semiMatches, finalMatches };
  }

  // GENUG ZEIT FÜR VIERTELFINALE (Mindestens 3 Runden Zeit übrig = dur * 3)
  // Macht Sinn bei 4 oder 5 Gruppen (z.B. euer 16-Trainer-Turnier)
  if (poolCount >= 4 && availableMinutes >= dur * 3) {
    
    // Viertelfinale 1: Sieger A vs Zweiter B
    semiMatches.push({ category: `${categoryName} - Viertelfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: 'Zweiter Gruppe B', status: 'Ausstehend' });
    // Viertelfinale 2: Sieger B vs Zweiter A
    semiMatches.push({ category: `${categoryName} - Viertelfinale 2`, player1_name: 'Sieger Gruppe B', player2_name: 'Zweiter Gruppe A', status: 'Ausstehend' });
    // Viertelfinale 3: Sieger C vs Zweiter D
    semiMatches.push({ category: `${categoryName} - Viertelfinale 3`, player1_name: 'Sieger Gruppe C', player2_name: 'Zweiter Gruppe D', status: 'Ausstehend' });
    
    // Viertelfinale 4: Flexibel je nachdem, ob 4 oder 5 Gruppen existieren
    if (poolCount >= 5) {
      // Bei 5 Gruppen spielt Sieger E gegen den Zweiten aus C
      semiMatches.push({ category: `${categoryName} - Viertelfinale 4`, player1_name: 'Sieger Gruppe E', player2_name: 'Zweiter Gruppe C', status: 'Ausstehend' });
    } else {
      // Bei exakt 4 Gruppen spielt Sieger D gegen den Zweiten aus C
      semiMatches.push({ category: `${categoryName} - Viertelfinale 4`, player1_name: 'Sieger Gruppe D', player2_name: 'Zweiter Gruppe C', status: 'Ausstehend' });
    }
    
    // Die darauf aufbauenden Halbfinals und das große Finale
    finalMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Viertelfinale 1', player2_name: 'Sieger Viertelfinale 3', status: 'Ausstehend' });
    finalMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Viertelfinale 2', player2_name: 'Sieger Viertelfinale 4', status: 'Ausstehend' });
    finalMatches.push({ category: `${categoryName} - FINALE 🏆`, player1_name: 'Sieger Halbfinale 1', player2_name: 'Sieger Halbfinale 2', status: 'Ausstehend' });
  } 
  
  // WENIG ZEIT ÜBRIG: Direkt Halbfinale (Mindestens 2 Runden Zeit übrig = dur * 2)
  else if (availableMinutes >= dur * 2) {
    if (poolCount === 2) {
      semiMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: 'Zweiter Gruppe B', status: 'Ausstehend' });
      semiMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Gruppe B', player2_name: 'Zweiter Gruppe A', status: 'Ausstehend' });
    } else {
      // Bei 3, 4 oder 5 Gruppen kommen nur die Gruppensieger ins Halbfinale (Sieger A, B, C, D)
      semiMatches.push({ category: `${categoryName} - Halbfinale 1`, player1_name: 'Sieger Gruppe A', player2_name: 'Sieger Gruppe C', status: 'Ausstehend' });
      semiMatches.push({ category: `${categoryName} - Halbfinale 2`, player1_name: 'Sieger Gruppe B', player2_name: poolCount >= 4 ? 'Sieger Gruppe D' : 'Bester Gruppenzweiter', status: 'Ausstehend' });
    }
    
    finalMatches.push({ category: `${categoryName} - FINALE 🏆`, player1_name: 'Sieger Halbfinale 1', player2_name: 'Sieger Halbfinale 2', status: 'Ausstehend' });
  }

  return { semiMatches, finalMatches };
};
