/**
 * Optimale Gruppeneinteilung mit bevorzugten 3er- und 4er-Gruppen.
 * Beibehaltung der bisherigen API:
 *
 * const { groups, matches } =
 *   generateGroupsAndMatches(players, courts);
 */

function calculateBestGroupSizes(playerCount) {
  let bestSolution = null;

  for (let groupsOf4 = Math.floor(playerCount / 4); groupsOf4 >= 0; groupsOf4--) {
    const remaining = playerCount - groupsOf4 * 4;

    if (remaining % 3 === 0) {
      const groupsOf3 = remaining / 3;

      const sizes = [
        ...Array(groupsOf4).fill(4),
        ...Array(groupsOf3).fill(3),
      ];

      if (
        !bestSolution ||
        Math.abs(groupsOf4 - groupsOf3) <
          Math.abs(
            bestSolution.filter((s) => s === 4).length -
              bestSolution.filter((s) => s === 3).length
          )
      ) {
        bestSolution = sizes;
      }
    }
  }

  return bestSolution;
}

function createGroups(players) {
  const sortedPlayers = [...players].sort(
    (a, b) => b.birth_year - a.birth_year
  );

  const playerCount = sortedPlayers.length;

  // Spezialfälle
  if (playerCount <= 4) {
    return [sortedPlayers];
  }

  let groupSizes = calculateBestGroupSizes(playerCount);

  // Fallback falls keine saubere 3/4-Kombination existiert
  if (!groupSizes) {
    groupSizes = [];

    let remaining = playerCount;

    while (remaining > 0) {
      if (remaining === 5) {
        groupSizes.push(3, 2);
        break;
      }

      if (remaining >= 4) {
        groupSizes.push(4);
        remaining -= 4;
      } else {
        groupSizes.push(remaining);
        break;
      }
    }
  }

  const groups = [];
  let start = 0;

  for (const size of groupSizes) {
    groups.push(sortedPlayers.slice(start, start + size));
    start += size;
  }

  return groups;
}

function generateRoundRobinMatches(groups, courts) {
  const matches = [];
  let courtIndex = 0;

  groups.forEach((group, groupIndex) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const assignedCourt =
          courts && courts.length > 0
            ? courts[courtIndex % courts.length]
            : null;

        matches.push({
          groupName: `Gruppe ${groupIndex + 1}`,
          player1: group[i],
          player2: group[j],
          courtId: assignedCourt?.id ?? null,
          status: "scheduled",
        });

        courtIndex++;
      }
    }
  });

  return matches;
}

export function generateGroupsAndMatches(players, courts = []) {
  if (!Array.isArray(players)) {
    throw new Error("players muss ein Array sein");
  }

  const groups = createGroups(players);
  const matches = generateRoundRobinMatches(groups, courts);

  return {
    groups,
    matches,
  };
}
