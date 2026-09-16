import { addMins } from './tournamentLogic';

const getLatestTime = (courtTimes) => {
  let maxMin = 0; let maxStr = "10:00";
  Object.values(courtTimes).forEach(t => {
    const [h, m] = t.split(':').map(Number);
    const tot = h * 60 + m;
    if (tot > maxMin) { maxMin = tot; maxStr = t; }
  });
  return maxStr;
};

export const allocateMatchesToCourts = (groupPool, semiPool, finalPool, courts, startT, dur) => {
  const finalM = [];
  const courtNextFreeTime = {};
  for (let i = 1; i <= courts; i++) courtNextFreeTime[i] = startT;

  // Phase 1: Vorrunde
  groupPool.forEach((match, index) => {
    const courtNum = (index % courts) + 1;
    const currentTime = courtNextFreeTime[courtNum];
    finalM.push({ ...match, court: `Platz ${courtNum} (${currentTime} Uhr)` });
    courtNextFreeTime[courtNum] = addMins(currentTime, parseInt(dur));
  });

  // Phase 2: Endrunden-Auftakt
  const endOfGroupsTime = getLatestTime(courtNextFreeTime);
  for (let i = 1; i <= courts; i++) courtNextFreeTime[i] = endOfGroupsTime;

  semiPool.forEach((match, index) => {
    const courtNum = (index % courts) + 1;
    const currentTime = courtNextFreeTime[courtNum];
    finalM.push({ ...match, court: `Platz ${courtNum} (${currentTime} Uhr)` });
    courtNextFreeTime[courtNum] = addMins(currentTime, parseInt(dur));
  });

  // Phase 3: Finals
  const endOfSemisTime = getLatestTime(courtNextFreeTime);
  for (let i = 1; i <= courts; i++) courtNextFreeTime[i] = endOfSemisTime;

  finalPool.forEach((match, index) => {
    const courtNum = (index % courts) + 1;
    const currentTime = courtNextFreeTime[courtNum];
    finalM.push({ ...match, court: `Platz ${courtNum} (${currentTime} Uhr)` });
    courtNextFreeTime[courtNum] = addMins(currentTime, parseInt(dur));
  });

  return { finalM, totalEndTime: getLatestTime(courtNextFreeTime) };
};
