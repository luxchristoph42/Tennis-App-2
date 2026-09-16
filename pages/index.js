import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import LiveScheduleView from './LiveScheduleView'; // Weil die Hilfsdateien in pages/ liegen

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  const fetchMatches = async () => {
    const { data } = await supabase.from('matches').select('*').order('id');
    setMatches(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  const getCourtName = (courtString) => {
    if (!courtString) return 'Unbekannter Platz';
    const match = courtString.match(/Platz\s+\d+/i);
    return match ? match : courtString;
  };

  // --- LOGIK SPIELPLAN ---
  const groupedMatches = {};
  matches.forEach(m => {
    const courtName = getCourtName(m.court);
    if (!groupedMatches[courtName]) groupedMatches[courtName] = [];
    groupedMatches[courtName].push(m);
  });
  const sortedCourts = Object.keys(groupedMatches).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // --- LOGIK RANGLISTEN ---
  const standings = {};
  matches.forEach(m => {
    if (!m.category.includes(' - Gr. ')) return;
    const catName = m.category;
    if (!standings[catName]) standings[catName] = {};

    const p1 = m.player1_name;
    const p2 = m.player2_name;

    if (!standings[catName][p1]) standings[catName][p1] = { name: p1, matchesPlayed: 0, wins: 0, losses: 0 };
    if (!standings[catName][p2]) standings[catName][p2] = { name: p2, matchesPlayed: 0, wins: 0, losses: 0 };

    if (m.status === 'Beendet') {
      standings[catName][p1].matchesPlayed += 1;
      standings[catName][p2].matchesPlayed += 1;
      if (m.winner === p1) {
        standings[catName][p1].wins += 1;
        standings[catName][p2].losses += 1;
      } else if (m.winner === p2) {
        standings[catName][p2].wins += 1;
        standings[catName][p1].losses += 1;
      }
    }
  });

  const sortedCategories = Object.keys(standings).sort();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'sans-serif', color: '#18181b', margin: 0, padding: 0 }}>
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e4e4e7', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>🎾 TennisTurnier Live</div>
          <nav style={{ display: 'flex', gap: '14px' }}>
            <Link href="/register" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '14px', fontWeight: '600' }}>Spieler-Anmeldung</Link>
            <Link href="/admin/checkin" style={{ textDecoration: 'none', color: '#71717a', fontSize: '14px', fontWeight: '500' }}>Turnierleitung 🔒</Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Turnier-Dashboard</h1>
          <p style={{ color: '#52525b' }}>Ergebnisse und Tabellen aktualisieren sich vollautomatisch.</p>
        </div>

        <div style={{ display: 'flex', borderBottom: '2px solid #e4e4e7', marginBottom: '24px', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => setActiveTab('schedule')} style={{ padding: '12px 24px', fontSize: '1.05em', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: 'none', borderBottom: activeTab === 'schedule' ? '3px solid #0070f3' : '3px solid transparent', color: activeTab === 'schedule' ? '#0070f3' : '#71717a' }}>
            📅 Live-Spielplan & Courts
          </button>
          <button onClick={() => setActiveTab('standings')} style={{ padding: '12px 24px', fontSize: '1.05em', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: 'none', borderBottom: activeTab === 'standings' ? '3px solid #0070f3' : '3px solid transparent', color: activeTab === 'standings' ? '#0070f3' : '#71717a' }}>
            📊 Ranglisten & Tabellen
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Spieldaten werden geladen...</p>
        ) : matches.length === 0 ? (
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#666' }}>
            Der Spielplan wurde noch nicht generiert.
          </div>
        ) : activeTab === 'schedule' ? (
          <LiveScheduleView sortedCourts={sortedCourts} groupedMatches={groupedMatches} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sortedCategories.map(catKey => {
              const groupRankings = Object.values(standings[catKey]).sort((a, b) => b.wins - a.wins);
              return (
                <div key={catKey} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25em', color: '#0f172a', borderBottom: '2px solid #e4e4e7', paddingBottom: '8px' }}>Gruppe: {catKey}</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ color: '#64748b', fontSize: '0.9em', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 4px' }}>Platz</th>
                        <th style={{ padding: '8px 4px' }}>Spieler</th>
                        <th style={{ padding: '8px 4px', textAlign: 'center' }}>S</th>
                        <th style={{ padding: '8px 4px', textAlign: 'center' }}>G</th>
                        <th style={{ padding: '8px 4px', textAlign: 'center' }}>V</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupRankings.map((player, index) => (
                        <tr key={player.name} style={{ borderBottom: index === groupRankings.length - 1 ? 'none' : '1px solid #f1f5f9', fontWeight: index < 2 ? '600' : 'normal', backgroundColor: index < 2 ? '#f0fdf4' : 'transparent' }}>
                          <td style={{ padding: '12px 4px', color: index === 0 ? '#16a34a' : '#475569' }}>{index === 0 ? '🥇 1.' : index === 1 ? '🥈 2.' : `${index + 1}.`}</td>
                          <td style={{ padding: '12px 4px' }}>{player.name}</td>
                          <td style={{ padding: '12px 4px', textAlign: 'center', color: '#64748b' }}>{player.matchesPlayed}</td>
                          <td style={{ padding: '12px 4px', textAlign: 'center', color: '#16a34a' }}>{player.wins}</td>
                          <td style={{ padding: '12px 4px', textAlign: 'center', color: '#dc2626' }}>{player.losses}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
