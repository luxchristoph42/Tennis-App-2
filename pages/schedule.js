import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Schedule() {
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' oder 'table'
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('matches').select('*').order('id');
      if (!error && data) setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
    // Echtzeit-Aktualisierung alle 10 Sekunden für die Zuschauer auf der Anlage
    const interval = setInterval(loadMatches, 10000);
    return () => clearInterval(interval);
  }, []);

  // DIKTATORISCHE LIVE-RANGLISTEN BERECHNUNG
  const calculateStandings = () => {
    const standings = {}; // Struktur: { 'Klasse': { 'Spielername': { wins: 0, matches: 0 } } }

    matches.forEach(m => {
      const cat = m.category;
      if (!standings[cat]) standings[cat] = {};
      
      if (!standings[cat][m.player1_name]) standings[cat][m.player1_name] = { name: m.player1_name, wins: 0, played: 0, points: 0 };
      if (!standings[cat][m.player2_name]) standings[cat][m.player2_name] = { name: m.player2_name, wins: 0, played: 0, points: 0 };

      if (m.status === 'Beendet') {
        standings[cat][m.player1_name].played += 1;
        standings[cat][m.player2_name].played += 1;
        
        if (m.winner === m.player1_name) {
          standings[cat][m.player1_name].wins += 1;
          standings[cat][m.player1_name].points += 2; // 2 Punkte für Sieg
        } else if (m.winner === m.player2_name) {
          standings[cat][m.player2_name].wins += 1;
          standings[cat][m.player2_name].points += 2;
        }
      }
    });

    // In Arrays umwandeln und nach Punkten sortieren
    const sortedCategories = {};
    Object.keys(standings).forEach(cat => {
      sortedCategories[cat] = Object.values(standings[cat]).sort((a, b) => b.points - a.points);
    });

    return sortedCategories;
  };

  const standingsData = calculateStandings();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'sans-serif', color: '#18181b', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '20px' }}>
          <Link href="/">← Zurück zur Startseite</Link>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Turnier-Zentrale 🎾</h1>

        {/* REITER / TABS UMSCHALTUNG */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e4e4e7', marginBottom: '24px', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('matches')}
            style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'matches' ? '3px solid #0070f3' : 'none', color: activeTab === 'matches' ? '#0070f3' : '#71717a' }}
          >
            Spiele & Courts 📅
          </button>
          <button 
            onClick={() => setActiveTab('table')}
            style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'table' ? '3px solid #0070f3' : 'none', color: activeTab === 'table' ? '#0070f3' : '#71717a' }}
          >
            Live-Rangliste 🏆
          </button>
        </div>

        {loading && <p style={{ color: '#71717a' }}>Aktualisiere Live-Daten...</p>}

        {/* ANSICHT 1: SPIELE */}
        {activeTab === 'matches' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {matches.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#a1a1aa' }}>Derzeit sind keine Spiele angesetzt.</p>
            ) : (
              matches.map(match => (
                <div key={match.id} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginRight: '10px' }}>{match.category}</span>
                    <span style={{ fontWeight: match.winner === match.player1_name ? 'bold' : 'normal', color: match.winner === match.player1_name ? '#0070f3' : 'inherit' }}>{match.player1_name}</span>
                    <span style={{ color: '#a1a1aa', margin: '0 8px', fontSize: '12px' }}>VS</span>
                    <span style={{ fontWeight: match.winner === match.player2_name ? 'bold' : 'normal', color: match.winner === match.player2_name ? '#0070f3' : 'inherit' }}>{match.player2_name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#f4f4f5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{match.court}</span>
                    <span style={{ color: match.status === 'Beendet' ? 'green' : '#d97706', fontSize: '13px', fontWeight: '500' }}>
                      {match.status === 'Beendet' ? `🎉 ${match.result || 'Beendet'}` : '● Aktiv'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ANSICHT 2: LIVE-TABELLE */}
        {activeTab === 'table' && (
          <div>
            {Object.keys(standingsData).length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#a1a1aa' }}>Noch keine Tabellendaten verfügbar. Spiele müssen dafür beendet sein.</p>
            ) : (
              Object.keys(standingsData).map(cat => (
                <div key={cat} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#166534', fontSize: '18px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>Altersklasse {cat}</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: '#71717a', borderBottom: '2px solid #f4f4f5' }}>
                        <th style={{ padding: '6px' }}>Platz</th>
                        <th style={{ padding: '6px' }}>Spieler</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Spiele</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Siege</th>
                        <th style={{ padding: '6px', textAlign: 'right' }}>Punkte</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standingsData[cat].map((row, index) => (
                        <tr key={row.name} style={{ borderBottom: '1px solid #f4f4f5', fontWeight: index === 0 ? 'bold' : 'normal' }}>
                          <td style={{ padding: '10px 6px', color: index === 0 ? '#d97706' : '#71717a' }}>#{index + 1}</td>
                          <td style={{ padding: '10px 6px' }}>{row.name} {index === 0 && '👑'}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center' }}>{row.played}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'center', color: 'green' }}>{row.wins}</td>
                          <td style={{ padding: '10px 6px', textAlign: 'right', color: '#0070f3' }}>{row.points} Pkt.</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
