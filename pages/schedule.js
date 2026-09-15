import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Schedule() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courtCount, setCourtCount] = useState(2);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const { data: playersData, error: pError } = await supabase
        .from('players')
        .select('*');

      if (pError) throw pError;
      setPlayers(playersData || []);

      // Platzanzahl aus dem Adminbereich auslesen
      const savedCourts = localStorage.getItem('tennis_courts');
      if (savedCourts) setCourtCount(parseInt(savedCourts));
    } catch (err) {
      setError('Daten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const generateTournamentSchedule = () => {
    setError('');
    if (players.length < 3) {
      setError(`Zu wenige Spieler insgesamt! Du brauchst mindestens 3 Spieler im System.`);
      return;
    }

    try {
      setLoading(true);

      // 1. Spieler nach Altersklassen (bezogen auf das aktuelle Jahr 2026) vorsortieren
      const categories = { U12: [], U15: [], U18: [], Open: [] };
      
      players.forEach(player => {
        const age = 2026 - player.birth_year;
        if (age <= 12) categories.U12.push(player);
        else if (age <= 15) categories.U15.push(player);
        else if (age <= 18) categories.U18.push(player);
        else categories.Open.push(player);
      });

      const generatedMatches = [];
      let matchCounter = 0;

      // 2. Spiele getrennt für JEDE Altersklasse generieren (Jeder gegen jeden innerhalb der Klasse)
      Object.keys(categories).forEach(catName => {
        const catPlayers = categories[catName];
        
        // Eine Gruppe benötigt mindestens 2 Spieler, um gegeneinander zu spielen
        if (catPlayers.length >= 2) {
          for (let i = 0; i < catPlayers.length; i++) {
            for (let j = i + 1; j < catPlayers.length; j++) {
              // Platznummer dynamisch anhand der Admin-Einstellung zuteilen
              const courtNumber = (matchCounter % courtCount) + 1;

              generatedMatches.push({
                id: `m-${catName}-${i}-${j}`,
                category: catName,
                player1_name: catPlayers[i].name,
                player2_name: catPlayers[j].name,
                court: `Platz ${courtNumber}`,
                status: 'Ausstehend'
              });
              matchCounter++;
            }
          }
        }
      });

      if (generatedMatches.length === 0) {
        setError("In keiner Altersklasse sind genügend Spieler (mindestens 2), um ein Match zu erzeugen!");
        setMatches([]);
      } else {
        setMatches(generatedMatches);
      }

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
        <p style={{ color: '#71717a', marginBottom: '24px' }}>
          Spieler im System: <strong>{players.length}</strong> | Eingestellte Plätze: <strong>{courtCount}</strong>
        </p>

        {error && (
          <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={generateTournamentSchedule}
          disabled={loading}
          style={{ backgroundColor: '#0070f3', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '40px' }}
        >
          Spielplan nach Altersklassen berechnen 🚀
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Geplante Begegnungen</h2>
        
        {matches.length === 0 ? (
          <div style={{ padding: '32px', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', textAlign: 'center', color: '#a1a1aa', fontStyle: 'italic' }}>
            Noch keine Spiele generiert. Klicke auf den Button oben.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((match) => (
              <div key={match.id} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginRight: '10px' }}>
                    {match.category}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>{match.player1_name}</span>
                  <span style={{ color: '#a1a1aa', margin: '0 8px', fontSize: '12px' }}>VS</span>
                  <span style={{ fontWeight: 'bold' }}>{match.player2_name}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ backgroundColor: '#f4f4f5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#71717a' }}>{match.court}</span>
                  <span style={{ color: '#d97706', fontSize: '13px' }}>● {match.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
