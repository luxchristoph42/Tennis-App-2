import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import LiveScheduleView from '../components/LiveScheduleView';
import { calculateStandings } from '../lib/tournamentLogic';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');
  const [tournamentMode, setTournamentMode] = useState('time');

  const fetchMatches = async () => {
    const { data } = await supabase.from('matches').select('*').order('id');
    setMatches(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches();
    
    // Modus aus dem LocalStorage auslesen, um die Tabelle richtig zu rendern
    const tm = localStorage.getItem('t_mode');
    if (tm) setTournamentMode(tm);

    const interval = setInterval(fetchMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  const getCourtName = (courtString) => {
    if (!courtString) return 'Unbekannter Platz';
    const match = courtString.match(/Platz\s+\d+/i);
    return match ? match : courtString;
  };

  // --- LOGIK FÜR TAB 1: SPIELPLAN ---
  const groupedMatches = {};
  matches.forEach(m => {
    const courtName = getCourtName(m.court);
    if (!groupedMatches[courtName]) groupedMatches[courtName] = [];
    groupedMatches[courtName].push(m);
  });
  const sortedCourts = Object.keys(groupedMatches).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // --- LOGIK FÜR TAB 2: RANGLISTEN & TABELLEN ---
  const categoriesMap = {};
  matches.forEach(m => {
    if (!m.category.includes(' - Gr. ')) return;
    if (!categoriesMap[m.category]) categoriesMap[m.category] = [];
    categoriesMap[m.category].push(m);
  });

  const sortedCategories = Object.keys(categoriesMap).sort();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', fontFamily: 'sans-serif', color: '#1c1917', margin: 0, padding: 0 }}>
      
      {/* Schlichte Navigationsleiste */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e4', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.025em' }}>
            Turnier-Dashboard
          </div>
          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link href="/register" style={{ textDecoration: 'none', color: '#2563eb', fontSize: '14px', fontWeight: '600' }}>
              Spieler-Anmeldung
            </Link>
            <Link href="/admin/checkin" style={{ textDecoration: 'none', color: '#78716c', fontSize: '14px', fontWeight: '500' }}>
              Turnierleitung
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        
        {/* Cleane Tab-Navigation ohne Icons */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e7e5e4', marginBottom: '32px', justify_content: 'flex-start', gap: '24px' }}>
          <button 
            onClick={() => setActiveTab('schedule')} 
            style={{ padding: '12px 4px', fontSize: '15px', fontWeight: activeTab === 'schedule' ? '700' : '500', cursor: 'pointer', border: 'none', background: 'none', borderBottom: activeTab === 'schedule' ? '2px solid #1c1917' : '2px solid transparent', color: activeTab === 'schedule' ? '#1c1917' : '#78716c', transition: 'all 0.15s ease' }}
          >
            Live-Spielplan
          </button>
          <button 
            onClick={() => setActiveTab('standings')} 
            style={{ padding: '12px 4px', fontSize: '15px', fontWeight: activeTab === 'standings' ? '700' : '500', cursor: 'pointer', border: 'none', background: 'none', borderBottom: activeTab === 'standings' ? '2px solid #1c1917' : '2px solid transparent', color: activeTab === 'standings' ? '#1c1917' : '#78716c', transition: 'all 0.15s ease' }}
          >
            Ranglisten & Tabellen
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#78716c', fontSize: '14px' }}>Daten werden geladen...</p>
        ) : matches.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '8px', padding: '48px', textAlign: 'center', color: '#78716c', fontSize: '15px' }}>
            Der Spielplan wurde noch nicht generiert.
          </div>
        ) : activeTab === 'schedule' ? (
          
          /* ================= TAB 1: CLEANER SPIELPLAN ================= */
          <LiveScheduleView sortedCourts={sortedCourts} groupedMatches={groupedMatches} />
          
        ) : (
          
          /* ================= TAB 2: CLEANER RANGLISTEN ================= */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {sortedCategories.map(catKey => {
              // Nutzt die exakte Berechnungslogik aus tournamentLogic.js
              const groupRankings = calculateStandings(categoriesMap[catKey], tournamentMode);

              return (
                <div key={catKey} style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: '#1c1917', borderBottom: '1px solid #f5f5f4', paddingBottom: '12px' }}>
                    {catKey}
                  </h3>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ color: '#78716c', borderBottom: '1px solid #e7e5e4' }}>
                        <th style={{ padding: '8px 12px', width: '60px' }}>Rang</th>
                        <th style={{ padding: '8px 12px' }}>Spieler</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', width: '60px' }}>Spiele</th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', width: '80px' }}>
                          {tournamentMode === 'time' ? 'Gew. Games' : 'Matches'}
                        </th>
                        <th style={{ padding: '8px 12px', textAlign: 'center', width: '80px' }}>Verhältnis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupRankings.map((player, index) => {
                        const diffSign = player.diff > 0 ? '+' : '';
                        return (
                          <tr key={player.name} style={{ borderBottom: '1px solid #f5f5f4', backgroundColor: index < 2 ? '#fafaf9' : 'transparent' }}>
                            <td style={{ padding: '12px 12px', fontWeight: '600', color: index < 2 ? '#1c1917' : '#78716c' }}>
                              {index + 1}.
                            </td>
                            <td style={{ padding: '12px 12px', fontWeight: index < 2 ? '600' : '400' }}>
                              {player.name}
                            </td>
                            <td style={{ padding: '12px 12px', textAlign: 'center', color: '#78716c' }}>
                              {player.matchesPlayed}
                            </td>
                            <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: '600' }}>
                              {tournamentMode === 'time' ? player.gamesWon : `${player.wins}:${player.losses}`}
                            </td>
                            <td style={{ padding: '12px 12px', textAlign: 'center', color: player.diff >= 0 ? '#16a34a' : '#dc2626', fontFamily: 'monospace' }}>
                              {diffSign}{player.gamesWon - player.gamesLost}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ marginTop: '14px', fontSize: '12px', color: '#78716c' }}>
                    Die besten zwei Platzierungen qualifizieren sich für die Endrunde.
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer style={{ borderTop: '1px solid #e7e5e4', padding: '24px', textAlign: 'center', fontSize: '13px', color: '#a8a29e', marginTop: '60px' }}>
        Vereinsverwaltung Live-Modul
      </footer>
    </div>
  );
}
