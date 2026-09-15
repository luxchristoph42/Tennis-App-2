import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCheckin() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Diese Funktion lädt alle Spieler live aus deiner Supabase-Datenbank
  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('players') // Falls deine Tabelle in Supabase anders heißt (z.B. 'spieler'), hier anpassen
        .select('*')
        .order('created_at', { ascending: false }); // Die neuesten Anmeldungen zuerst

      if (error) throw error;
      setPlayers(data || []);
    } catch (err) {
      console.error('Fehler beim Laden der Spieler:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sobald die Seite öffnet, laden wir die Spielerliste
  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', mx: 'auto' }}>
      
      {/* Header-Navigation zurück zur Startseite */}
      <div style={{ marginBottom: '20px' }}>
        <Link href="/">← Zurück zur Startseite</Link>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        Admin-Bereich: Angemeldete Spieler
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Hier siehst du alle Test-Spieler, die sich über das Formular registriert haben.
      </p>

      {/* Button zum manuellen Aktualisieren der Liste */}
      <button 
        onClick={fetchPlayers}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Liste aktualisieren 🔄
      </button>

      {/* Zustand: Laden */}
      {loading && <p>Lade Spieler aus der Datenbank...</p>}

      {/* Zustand: Fehler */}
      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Fehler beim Datenbank-Verbindung:</strong> {error}
        </div>
      )}

      {/* Spieler-Tabelle */}
      {!loading && !error && (
        <>
          {players.length === 0 ? (
            <p style={{ italic: 'true', color: '#888' }}>Noch keine Spieler angemeldet. Melde einen Test-Spieler auf der Registrierungsseite an!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left', backgroundColor: '#f4f4f5' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Name des Kindes</th>
                  <th style={{ padding: '10px' }}>Geburtsjahr</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={player.id || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', color: '#888' }}>{index + 1}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{player.name}</td>
                    <td style={{ padding: '10px' }}>{player.birth_year}</td>
                    <td style={{ padding: '10px' }}>
                      {player.checked_in ? (
                        <span style={{ color: 'green', fontWeight: 'bold' }}>🟢 Eingecheckt</span>
                      ) : (
                        <span style={{ color: '#d97706' }}>🟡 Angemeldet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
