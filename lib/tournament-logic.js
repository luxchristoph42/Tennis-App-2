export function generateGroupsAndMatches(players, courts) {
  const sortedPlayers = [...players].sort((a, b) => b.birth_year - a.birth_year);

  const groups = [];
  let currentGroup = [];

  sortedPlayers.forEach((player) => {
    currentGroup.push(player);
    if (currentGroup.length === 4) {
      groups.push([...currentGroup]);
      currentGroup = [];
    }
  });

  if (currentGroup.length > 0) {
    if (groups.length > 0 && currentGroup.length < 3) {
      groups[groups.length - 1].push(...currentGroup);
    } else {
      groups.push(currentGroup);
    }
  }

  const matches = [];
  let courtIndex = 0;

  groups.forEach((group, gIndex) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const assignedCourt = courts.length > 0 ? courts[courtIndex % courts.length] : null;
        matches.push({
          groupName: `Gruppe ${gIndex + 1}`,
          player1: group[i],
          player2: group[j],
          courtId: assignedCourt ? assignedCourt.id : null,
          status: 'scheduled'
        });
        courtIndex++;
      }
    }
  });

  return { groups, matches };
}
