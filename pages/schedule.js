import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Schedule() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Spieler aus der Datenbank laden
  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Hier laden wir alle Spieler (oder optional nur die, die eingecheckt sind)
      const { data: playersData, error: pError } = await supabase
        .from('players')
        .select('*');

      if (pError) throw pError;
      setPlayers(playersData || []);

      // Falls bereits ein Spielplan in einer Tabelle existiert, laden wir diesen auch
      const { data: matchesData, error: mError } = await supabase
        .from('matches') // Falls du eine Matches-Tabelle hast
        .select('*');
        
      if (!mError && matchesData) {
        setMatches(matchesData);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err.message);
      setError('Daten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // 2. Den Turnierplan generieren
  const generateTournamentSchedule = async () => {
    setError('');
    
    // Prüfen der Mindestspieleranzahl
    if (players.length < 3) {
      setError(`Zu wenige Spieler! Du hast aktuell ${players.length} Spieler angemeldet. Du brauchst mindestens 3 Spieler für einen Turnierplan.`);
      return;
    }

    try {
      setLoading(true);
      
      // Einfache, fehlerfreie Generierungs-Logik direkt im Client,
      // um Fehler mit Imports zu vermeiden: Jeder spielt gegen jeden!
      const generatedMatches = [];
      for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
          generatedMatches.push({
            id: `m-${i}-${j}`,
            player1_name: players[i].name,
            player2_name: players[j].name,
            court: `Platz ${(generatedMatches.length % 3) + 1}`,
            status: 'Ausstehend'
          });
        }
      }

      setMatches(generatedMatches);

      // OPTIONAL: Wenn du eine Tabelle 'matches' in Supabase hast, 
      // könntest du die Spiele hier mit await supabase.from('matches').insert(...) speichern.

    } catch (err) {
      setError('Fehler bei der Generierung des Spielplans.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'sans-serif', color: '#18181b', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <Link href="/">← Zurück zur Startseite</Link>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Turnier-Spielplan</h1>
        <p style={{ color: '#71717a', marginBottom: '32px' }}>
          Aktuell registrierte Spieler im System: <strong style={{ color: '#09090b' }}>{players.length}</strong>
        </p>

        {error && (
          <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px', fontWeight: '500' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Steuerungs-Button */}
        <button
          onClick={generateTournamentSchedule}
          disabled={loading}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '14px 28px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '40px'
          }}
        >
          {loading ? 'Verarbeite...' : 'Turnierplan jetzt generieren 🚀'}
        </button>

        {/* Anzeige der Spiele */}
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Geplante Begegnungen</h2>
        
        {matches.length === 0 ? (
          <div style={{ padding: '32px', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', textAlign: 'center', color: '#a1a1aa', fontStyle: 'italic' }}>
            Noch keine Spiele generiert. Klicke auf den Button oben, um das Turnier zu starten.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((match) => (
              <div key={match.id} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center shadow-sm' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: '6xl', fontSize: '15px' }}>{match.player1_name}</span>
                  <span style={{ color: '#a1a1aa', fontSize: '12px', fontWeight: 'bold' }}>VS</span>
                  <span style={{ fontWeight: '6xl', fontSize: '15px' }}>{match.player2_name}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#f4f4f5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#71717a' }}>{match.court}</span>
                  <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '500' }}>● {match.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
