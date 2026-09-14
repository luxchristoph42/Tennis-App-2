function calculateOptimalGroupSizes(playerCount) {
  // Spezialfälle für kleine Turniere
  if (playerCount <= 5) {
    return [playerCount];
  }

  let bestSolution = null;

  function search(remaining, current) {
    if (remaining === 0) {
      const largest = Math.max(...current);
      const smallest = Math.min(...current);

      const score = largest - smallest;

      if (
        !bestSolution ||
        score <
          Math.max(...bestSolution) - Math.min(...bestSolution)
      ) {
        bestSolution = [...current];
      }

      return;
    }

    if (remaining >= 3) {
      search(remaining - 3, [...current, 3]);
    }

    if (remaining >= 4) {
      search(remaining - 4, [...current, 4]);
    }

    if (remaining >= 5) {
      search(remaining - 5, [...current, 5]);
    }
  }

  search(playerCount, []);

  if (!bestSolution) {
    return [playerCount];
  }

  return bestSolution.sort((a, b) => b - a);
}

function createGroups(players) {
  const sortedPlayers = [...players].sort(
    (a, b) => b.birth_year - a.birth_year
  );

  const groupSizes = calculateOptimalGroupSizes(
    sortedPlayers.length
  );

  const groups = [];
  let index = 0;

  for (const size of groupSizes) {
    groups.push(
      sortedPlayers.slice(index, index + size)
    );

    index += size;
  }

  return groups;
}

function generateMatches(groups, courts = []) {
  const matches = [];
  let courtIndex = 0;

  groups.forEach((group, groupIndex) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const court =
          courts.length > 0
            ? courts[courtIndex % courts.length]
            : null;

        matches.push({
          groupName: `Gruppe ${groupIndex + 1}`,
          player1: group[i],
          player2: group[j],
          courtId: court?.id || null,
          status: 'scheduled',
        });

        courtIndex++;
      }
    }
  });

  return matches;
}

export function generateGroupsAndMatches(
  players,
  courts = []
) {
  if (!Array.isArray(players)) {
    throw new Error('players muss ein Array sein');
  }

  if (players.length < 2) {
    return {
      groups: [],
      matches: [],
    };
  }

  const groups = createGroups(players);

  const matches = generateMatches(
    groups,
    courts
  );

  return {
    groups,
    matches,
  };
}
