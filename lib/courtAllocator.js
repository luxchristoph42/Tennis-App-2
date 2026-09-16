import { addMins } from './tournamentLogic';

// Hilfsfunktion, um die späteste Endzeit aller Plätze zu finden
const getLatestTime = (courtTimes) => {
  let maxMin = 0;
  let maxStr = "10:00";
  Object.values(courtTimes).forEach(t => {
    const [h, m] = t.split(':').map(Number);
    const tot = h * 60 + m;
    if (tot > maxMin) {
      maxMin = tot;
      maxStr = t;
    }
  });
  return maxStr;
};

// Berechnet die exakten Uhrzeiten und teilt die Phasen nacheinander ein
export const allocateMatchesToCourts = (groupPool, semiPool, finalPool, courts, startT, dur) => {
  const finalM = [];
  const courtNextFreeTime = {};
  
  // Startzeiten für alle Tennisplätze auf den gewünschten Turnierstart setzen
  for (let i = 1; i <= courts; i++) {
    courtNextFreeTime[i] = startT;
  }

  // PHASE 1: Gruppenspiele auf die Plätze verteilen
  groupPool.forEach((match, index) => {
    const courtNum = (index % courts) + 1;
    const currentTime = courtNextFreeTime[courtNum];

    finalM.push({ ...match, court: `Platz ${courtNum} (${currentTime} Uhr)` });
    courtNextFreeTime[courtNum] = addMins(currentTime, parseInt(dur));
  });

  // Zeit-Synchronisation: Wann ist das allerletzte Vorrundenspiel vorbei?
  const endOfGroupsTime = getLatestTime(courtNextFreeTime);
  for (let i = 1; i <= courts; i++) {
    courtNextFreeTime[i] = endOfGroupsTime;
  }

  // PHASE 2: Halbfinals erst NACH der Vorrunde ansetzen
  semiPool.forEach((match, index) => {
    const courtNum = (index % courts) + 1;
    const currentTime = courtNextFreeTime[courtNum];

    finalM.push({ ...match, court: `Platz ${courtNum} (${currentTime} Uhr)` });
    courtNextFreeTime[courtNum] = addMins(currentTime, parseInt(dur));
  });

  // Zeit-Synchronisation: Wann ist das letzte Halbfinale fertig?
  const endOfSemisTime = getLatestTime(courtNextFreeTime);
  for (let i = 1; i <= courts; i++) {
    courtNextFreeTime[i] = endOfSemisTime;
  }

  // PHASE 3: Finals exakt hinter die Halbfinals legen
  finalPool.forEach((match, index) => {
    const courtNum = (index % courts) + 1;
    const currentTime = courtNextFreeTime[courtNum];

    finalM.push({ ...match, court: `Platz ${courtNum} (${currentTime} Uhr)` });
    courtNextFreeTime[courtNum] = addMins(currentTime, parseInt(dur));
  });

  return finalM;
};
