import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Schedule() {
  const [allPlayers, setAllPlayers] = useState([]);
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
      setAllPlayers(playersData || []);

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

  // Filtert alle Spieler heraus, die im Admin-Bereich eingecheckt wurden
  const checkedInPlayers = allPlayers.filter(player => player.checked_in);

  const generateTournamentSchedule = () => {
    setError('');
    
    // Wichtig: Wir prüfen jetzt die Anzahl der EINGECHECKTEN Spieler
    if (checkedInPlayers.length < 2) {
      setError(`Zu wenige spielbereite Spieler! Es müssen mindestens 2 Spieler im Admin-Bereich eingecheckt sein. Aktuell eingecheckt: ${checkedInPlayers.length}`);
      return;
    }

    try {
      setLoading(true);
      const categories = { U12: [], U15: [], U18: [], Open: [] };
      
      // Nur eingecheckte Spieler einteilen
      checkedInPlayers.forEach(player => {
        const age = 2026 - player.birth_year;
        if (age <= 12) categories.U12.push(player);
        else if (age <= 15) categories.U15.push(player);
        else if (age <= 18) categories.U18.push(player);
        else categories.Open.push(player);
      });

      const generatedMatches = [];
      let matchCounter = 0;

      Object.keys(categories).forEach(catName => {
        const catPlayers = categories[catName];
        
        if (catPlayers.length >= 2) {
          for (let i = 0; i < catPlayers.length; i++) {
            for (let j = i + 1; j < catPlayers.length; j++) {
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
        setError("In den besetzten Altersklassen sind nicht genügend Spieler aktiv eingecheckt (mindestens 2 benötigt)!");
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
          Registrierte Spieler gesamt: <strong>{allPlayers.length}</strong> | Davon spielbereit eingecheckt: <strong style={{ color: 'green' }}>{checkedInPlayers.length}</strong>
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
          Spielplan für eingecheckte Spieler berechnen 🚀
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Geplante Begegnungen</h2>
        
        {matches.length === 0 ? (
          <div style={{ padding: '32px', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', textAlign: 'center', color: '#a1a1aa', fontStyle: 'italic' }}>
            Noch keine Spiele generiert. Vergewissere dich, dass Spieler im Admin-Bereich eingecheckt sind.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.map((match) => (
              <div key={match.id} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', display: 'flex', justifycontent: 'space-between', alignItems: 'center', justifyContent: 'space-between' }}>
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
