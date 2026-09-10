import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, birth_year } = req.body;
  const { data, error } = await supabase
    .from('players')
    .insert([{ name, birth_year }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true, data });
}
