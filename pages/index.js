import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await supabase.from('matches').select('*').order('id');
      setMatches(data || []);
      setLoading(false);
    };
    fetchMatches();
    
    // Auto-Refresh alle 30 Sekunden für Live-Ergebnisse
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Hilfsfunktion zur Ermittlung des reinen Platznamens
  const getCourtName = (courtString) => {
    if (!courtString) return 'Unbekannter Platz';
    const match = courtString.match(/Platz\s+\d+/i);
    return match ? match[0] : courtString;
  };

  // Spiele nach Plätzen sortieren
  const groupedMatches = {};
  matches.forEach(m => {
    const courtName = getCourtName(m.court);
    if (!groupedMatches[courtName]) groupedMatches[courtName] = [];
    groupedMatches[courtName].push(m);
  });

  const sortedCourts = Object.keys(groupedMatches).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'sans-serif', color: '#18181b', margin: 0, padding: 0 }}>
      
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e4e4e7', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎾</span> TennisTurnier Live
          </div>
          <nav style={{ display: 'flex', gap: '14px' }}>
            <Link href="/register" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '14px', fontWeight: '600' }}> Spieler-Anmeldung </Link>
            <Link href="/admin/checkin" style={{ textDecoration: 'none', color: '#71717a', fontSize: '14px', fontWeight: '500' }}> Turnierleitung 🔒 </Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: '#09090b' }}>Live-Spielplan & Ergebnisse</h1>
          <p style={{ color: '#52525b', fontSize: '16px' }}>Alle Plätze aktualisieren sich automatisch live bei Ergebniseingabe.</p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Spieldaten werden geladen...</p>
        ) : matches.length === 0 ? (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#666' }}>
            Der Spielplan wurde von der Turnierleitung noch nicht generiert.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sortedCourts.map(court => (
              <div key={court} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '1.4em', color: '#1e3a8a', borderBottom: '2px solid #e4e4e7', paddingBottom: '8px' }}>
                  🏟️ {court}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {groupedMatches[court].map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', backgroundColor: m.status === 'Beendet' ? '#f8fafc' : '#eff6ff', border: m.status === 'Beendet' ? '1px solid #e2e8f0' : '1px solid #bfdbfe' }}>
                      <div>
                        <span style={{ fontSize: '0.8em', fontWeight: 'bold', backgroundColor: m.status === 'Beendet' ? '#e2e8f0' : '#3b82f6', color: m.status === 'Beendet' ? '#475569' : 'white', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>
                          {m.category}
                        </span>
                        <span style={{ fontSize: '0.9em', color: '#64748b' }}>{m.court.includes('(') ? m.court.substring(m.court.indexOf('(')) : ''}</span>
                        <div style={{ fontSize: '1.1em', fontWeight: '600', marginTop: '6px' }}>
                          {m.player1_name} vs. {m.player2_name}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', minWidth: '100px' }}>
                        {m.status === 'Beendet' ? (
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1em', fontFamily: 'monospace', color: '#0f172a' }}>{m.result}</div>
                            <div style={{ fontSize: '0.8em', color: '#16a34a', fontWeight: 'bold' }}>🏆 {m.winner}</div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.85em', color: '#2563eb', fontWeight: 'bold', backgroundColor: '#dbeafe', padding: '4px 8px', borderRadius: '12px' }}>🎾 Match läuft</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #e4e4e7', backgroundColor: 'white', padding: '24px', textAlign: 'center', fontSize: '14px', color: '#a1a1aa', marginTop: '40px' }}>
        TennisTurnier Live • Ergebnisse aktualisieren sich automatisch 🚀
      </footer>
    </div>
  );
}
