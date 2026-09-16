import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Hier wird das Geschlecht (gender) jetzt aus der Anfrage herausgelesen
  const { name, birth_year, gender } = req.body;

  const { data, error } = await supabase
    .from('players')
    .insert([{ 
      name, 
      birth_year: parseInt(birth_year), 
      gender: gender || 'm' // Falls kein Geschlecht übergeben wurde, wird 'm' als Standard genutzt
    }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, data });
}
