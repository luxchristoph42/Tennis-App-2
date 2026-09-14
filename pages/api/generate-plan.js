import { supabase } from '../../lib/supabase';
import { generateGroupsAndMatches } from '../../lib/tournament-logic';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  try {
    // Eingecheckte Spieler laden
    const { data: players, error: playerError } = await supabase
      .from('players')
      .select('*')
      .eq('checked_in', true);

    if (playerError) {
      throw playerError;
    }

    if (!players || players.length < 2) {
      return res.status(400).json({
        error: 'Mindestens 2 eingecheckte Spieler erforderlich.'
      });
    }

    // Plätze laden
    const { data: courts, error: courtError } = await supabase
      .from('courts')
      .select('*');

    if (courtError) {
      throw courtError;
    }

    // Alte Matches löschen
    const { error: deleteMatchesError } = await supabase
      .from('matches')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteMatchesError) {
      throw deleteMatchesError;
    }

    // Alte Gruppen löschen
    const { error: deleteGroupsError } = await supabase
      .from('groups')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteGroupsError) {
      throw deleteGroupsError;
    }

    // Bestehende Gruppenzuordnungen zurücksetzen
    await supabase
      .from('players')
      .update({ group_id: null })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    const { groups, matches } = generateGroupsAndMatches(
      players,
      courts || []
    );

    // Zuordnung Gruppe -> Datenbank-ID
    const groupIdMap = new Map();

    // Gruppen speichern
    for (let index = 0; index < groups.length; index++) {
      const groupArray = groups[index];

      if (!groupArray.length) continue;

      const youngestBirthYear = Math.max(
        ...groupArray.map((p) => p.birth_year)
      );

      const ageCategory = `U${
        new Date().getFullYear() - youngestBirthYear
      }`;

      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert([
          {
            name: `Gruppe ${index + 1}`,
            age_category: ageCategory,
          },
        ])
        .select()
        .single();

      if (groupError || !groupData) {
        throw groupError || new Error('Gruppe konnte nicht erstellt werden');
      }

      groupIdMap.set(`Gruppe ${index + 1}`, groupData.id);

      // Spieler der Gruppe zuordnen
      for (const player of groupArray) {
        const { error: updateError } = await supabase
          .from('players')
          .update({ group_id: groupData.id })
          .eq('id', player.id);

        if (updateError) {
          throw updateError;
        }
      }
    }

    // Matches speichern
    for (const match of matches) {
      const groupId = groupIdMap.get(match.groupName);

      const { error: matchError } = await supabase
        .from('matches')
        .insert([
          {
            group_id: groupId,
            player1_id: match.player1.id,
            player2_id: match.player2.id,
            court_id: match.courtId,
            status: match.status,
          },
        ]);

      if (matchError) {
        throw matchError;
      }
    }

    return res.status(200).json({
      success: true,
      groupsCreated: groups.length,
      matchesCreated: matches.length,
      checkedInPlayers: players.length,
    });
  } catch (error) {
    console.error('Fehler bei Turniergenerierung:', error);

    return res.status(500).json({
      error: error.message || 'Unbekannter Fehler'
    });
  }
}
