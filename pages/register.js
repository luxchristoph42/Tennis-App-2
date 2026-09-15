// pages/api/register.js
import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  // Wir erlauben nur POST-Anfragen
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt' });
  }

  try {
    const { name, birth_year } = req.body;

    // Sicherheitsprüfung: Sind Daten angekommen?
    if (!name || !birth_year) {
      return res.status(400).json({ error: 'Bitte Name und Geburtsjahr angeben.' });
    }

    // Daten in die funktionierende Supabase-Tabelle eintragen
    const { data, error } = await supabase
      .from('players')
      .insert([
        { 
          name: name, 
          birth_year: parseInt(birth_year), // Hier lag der Variablenfehler
          checked_in: false 
        }
      ])
      .select();

    if (error) {
      console.error('Supabase Fehler:', error.message);
      return res.status(400).json({ error: `Datenbank-Fehler: ${error.message}` });
    }

    // Erfolgreich gespeichert!
    return res.status(200).json({ success: true, player: data });

  } catch (error) {
    console.error('Server Fehler:', error.message);
    return res.status(500).json({ error: `Interner Server-Fehler: ${error.message}` });
  }
}
