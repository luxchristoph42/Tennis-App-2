import { supabase } from '../../lib/supabase';
import { generateGroupsAndMatches } from '../../lib/tournament-logic';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send();

  const { data: players } = await supabase.from('players').select('*').eq('checked_in', true);
  const { data: courts } = await supabase.from('courts').select('*');

  if (!players || players.length === 0) {
    return res.status(400).json({ error: 'Keine eingecheckten Spieler gefunden!' });
  }

  await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('groups').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { groups, matches } = generateGroupsAndMatches(players, courts || []);

  for (let groupArray of groups) {
    const ageCat = `U${new Date().getFullYear() - groupArray[0].birth_year}`;
    const { data: groupData } = await supabase
      .from('groups')
      .insert([{ name: 'Gruppe', age_category: ageCat }])
      .select()
      .single();

    for (let player of groupArray) {
      await supabase.from('players').update({ group_id: groupData.id }).eq('id', player.id);
    }
  }

  return res.status(200).json({ success: true });
}
