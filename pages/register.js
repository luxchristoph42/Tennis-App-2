// pages/api/register.js
import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  // Wir erlauben nur POST-Anfragen (Daten senden)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Methode nicht erlaubt' });
  }

  try {
    const { name, birth_year } = req.body;

    // Validierung: Prüfen, ob die Daten vom Formular abgeschickt wurden
    if (!name || !birth_year) {
      return res.status(400).json({ error: 'Name und Geburtsjahr sind erforderlich.' });
    }

    // Daten direkt in deine funktionierende Supabase-Tabelle eintragen
    const { data, error } = await supabase
      .from('players')
      .insert([
        { 
          name: name, 
          birth_year: birth_year,
          checked_in: false // Standardmäßig ist der Spieler noch nicht eingecheckt
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    // Erfolgreiche Rückmeldung an das Frontend senden
    return res.status(200).json({ success: true, player: data });

  } catch (error) {
    console.error('Fehler bei der Registrierung in der API:', error.message);
    return res.status(500).json({ error: 'Datenbank-Speicherfehler', details: error.message });
  }
}
