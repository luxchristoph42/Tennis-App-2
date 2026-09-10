import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data } = await supabase.from('players').select('*').order('name');
    return res.status(200).json(data || []);
  }

  if (req.method === 'POST') {
    const { id, checked_in } = req.body;
    const { error } = await supabase
      .from('players')
      .update({ checked_in })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }
}
