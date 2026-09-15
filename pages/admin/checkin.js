import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCheckin() {
  const [players, setPlayers] = useState([]);
  const [courts, setCourts] = useState(2); // Standard: 2 Plätze
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    // Gespeicherte Platzanzahl laden, falls vorhanden
    const savedCourts = localStorage.getItem('tennis_courts');
    if (savedCourts) setCourts(parseInt(savedCourts));
  }, []);

  const handleCourtChange = (e) => {
    const val = parseInt(e.target.value);
    setCourts(val);
    localStorage.setItem('tennis_courts', val);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/">← Zurück zur Startseite</Link>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Admin-Bereich</h1>
      
      {/* NEU: Einstellungen für verfügbare Plätze */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>Anlagen-Konfiguration</h3>
        <label style={{ fontSize: '14px', color: '#52525b', display: 'block', marginBottom: '8px' }}>
          Verfügbare Tennisplätze für dieses Turnier:
        </label>
        <select 
          value={courts} 
          onChange={handleCourtChange}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', width: '120px' }}
        >
          <option value="1">1 Platz</option>
          <option value="2">2 Plätze</option>
          <option value="3">3 Plätze</option>
          <option value="4">4 Plätze</option>
          <option value="5">5 Plätze</option>
        </select>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Angemeldete Spieler ({players.length})</h2>
      
      <button onClick={fetchPlayers} style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
        Liste aktualisieren 🔄
      </button>

      {loading && <p>Lade Spieler...</p>}
      {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>{error}</div>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left', backgroundColor: '#f4f4f5' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Geburtsjahr</th>
              <th style={{ padding: '10px' }}>Altersklasse (berechnet)</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              // Altersberechnung basierend auf dem aktuellen Jahr 2026
              const age = 2026 - player.birth_year;
              let category = 'Erwachsene / Open';
              if (age <= 12) category = 'U12';
              else if (age <= 15) category = 'U15';
              else if (age <= 18) category = 'U18';

              return (
                <tr key={player.id || idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{player.name}</td>
                  <td style={{ padding: '10px' }}>{player.birth_year}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                      {category}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
