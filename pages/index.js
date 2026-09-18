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
    const tm = localStorage.getItem('t_mode');
    if (tm) setTournamentMode(tm);

    const interval = setInterval(fetchMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  const getCourtName = (courtString) => {
    if (!courtString) return 'Unbekannter Platz';
    const match = courtString.match(/Platz\s+\d+/i);
    return match ? match[0] : courtString;
  };

  const groupedMatches = {};
  matches.forEach(m => {
    const courtName = getCourtName(m.court);
    if (!groupedMatches[courtName]) groupedMatches[courtName] = [];
    groupedMatches[courtName].push(m);
  });
  const sortedCourts = Object.keys(groupedMatches).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const categoriesMap = {};
  matches.forEach(m => {
    if (!m.category.includes(' - Gr. ')) return;
    if (!categoriesMap[m.category]) categoriesMap[m.category] = [];
    categoriesMap[m.category].push(m);
  });
  const sortedCategories = Object.keys(categoriesMap).sort();

  const componentStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      .app-wrapper { min-height: 100vh; backgroundColor: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1c1c1e; }
      .site-header { background-color: #ffffff; border-bottom: 1px solid #e5e5ea; padding: 16px; }
      .header-container { max-width: 1000px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
      .brand-title { font-size: 18px; font-weight: 700; letter-spacing: -0.4px; color: #1c1c1e; }
      
      .top-nav { display: flex; gap: 16px; align-items: center; }
      .nav-link-primary { text-decoration: none; color: #007af5; font-size: 14px; font-weight: 600; transition: opacity 0.2s; }
      .nav-link-secondary { text-decoration: none; color: #8e8e93; font-size: 14px; font-weight: 500; transition: color 0.2s; }
      .nav-link-primary:hover, .nav-link-secondary:hover { opacity: 0.8; color: #1c1c1e; }
      
      .main-content { max-width: 1000px; margin: 24px auto; padding: 0 16px; }
      
      .tabs-bar { display: flex; background: #eee; padding: 4px; border-radius: 12px; margin-bottom: 28px; gap: 4px; }
      .tab-btn { flex: 1; padding: 12px 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; background: transparent; border-radius: 9px; color: #666; transition: all 0.2s; text-align: center; }
      .tab-btn-active { background: #fff; color: #000; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      
      .msg-empty { background-color: #ffffff; border: 1px solid #e5e5ea; border-radius: 14px; padding: 48px 24px; text-align: center; color: #8e8e93; font-style: italic; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
      .standings-stack { display: flex; flex-direction: column; gap: 28px; }
      
      .category-card { background-color: #ffffff; border: 1px solid #e5e5ea; border-radius: 14px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); overflow: hidden; }
      .category-card-title { margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1c1c1e; border-bottom: 1px solid #f2f2f7; padding-bottom: 12px; letter-spacing: -0.2px; }
      
      /* Responsive Table Style */
      .desktop-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; display: none; }
      .th-label { padding: 10px 12px; font-size: 13px; font-weight: 600; color: #8e8e93; border-bottom: 1px solid #e5e5ea; }
      .td-value { padding: 12px; border-bottom: 1px solid #f2f2f7; vertical-align: middle; }
      
      .mobile-rows-list { display: flex; flex-direction: column; gap: 10px; }
      .mobile-row-item { padding: 12px; border: 1px solid #e5e5ea; border-radius: 10px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
      .mobile-item-top { display: flex; justify-content: space-between; align-items: center; }
      .player-rank-name { display: flex; gap: 8px; align-items: center; font-weight: 600; }
      .rank-num { font-size: 13px; color: #8e8e93; min-width: 20px; }
      .mobile-metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: #fafafa; padding: 8px; border-radius: 6px; font-size: 12px; text-align: center; color: #555; }
      .metric-label { font-size: 10px; color: #8e8e93; text-transform: uppercase; margin-bottom: 2px; font-weight: 600; }
      .metric-val { font-weight: 600; }
      
      .color-top-two { background-color: #f6fdf8 !important; }
      .rank-top-two { color: #1a7f37 !important; font-weight: 700; }
      .diff-positive { color: #1a7f37; font-weight: 600; font-family: monospace; }
      .diff-negative { color: #ff3b30; font-weight: 600; font-family: monospace; }

      @media (min-width: 600px) {
        .tabs-bar { display: inline-flex; width: auto; min-width: 360px; }
        .main-content { margin: 40px auto; }
        .site-header { padding: 16px 24px; }
      }
      @media (min-width: 768px) {
        .desktop-table { display: table; }
        .mobile-rows-list { display: none; }
      }
    `}} />
  );

  return (
    <div className="app-wrapper">
      {componentStyles}
      
      <header className="site-header">
        <div className="header-container">
          <div className="brand-title">Turnier-Dashboard</div>
          <nav className="top-nav">
            <Link href="/register" className="nav-link-primary">Spieler-Anmeldung</Link>
            <Link href="/admin/checkin" className="nav-link-secondary">Turnierleitung</Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="tabs-bar">
          <button 
            onClick={() => setActiveTab('schedule')} 
            className={`tab-btn ${activeTab === 'schedule' ? 'tab-btn-active' : ''}`}
          >
            Live-Spielplan
          </button>
          <button 
            onClick={() => setActiveTab('standings')} 
            className={`tab-btn ${activeTab === 'standings' ? 'tab-btn-active' : ''}`}
          >
            Ranglisten & Tabellen
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#8e8e93', fontSize: '14px', fontStyle: 'italic' }}>Daten werden geladen...</p>
        ) : matches.length === 0 ? (
          <div className="msg-empty">
            Der Spielplan wurde noch nicht generiert.
          </div>
        ) : activeTab === 'schedule' ? (
          <LiveScheduleView sortedCourts={sortedCourts} groupedMatches={groupedMatches} />
        ) : (
          <div className="standings-stack">
            {sortedCategories.map(catKey => {
              const groupRankings = calculateStandings(categoriesMap[catKey], tournamentMode);

              return (
                <div key={catKey} className="category-card">
                  <h3 className="category-card-title">{catKey}</h3>
                  
                  {/* MOBILE ANSICHT: Kartensystem für kleine Bildschirme */}
                  <div className="mobile-rows-list">
                    {groupRankings.map((player, index) => {
                      const diffSign = player.diff > 0 ? '+' : '';
                      const isTopTwo = index < 2;
                      return (
                        <div 
                          key={player.name} 
                          className={`mobile-row-item ${isTopTwo ? 'color-top-two' : ''}`}
                        >
                          <div className="mobile-item-top">
                            <div className="player-rank-name">
                              <span className={`rank-num ${isTopTwo ? 'rank-top-two' : ''}`}>{index + 1}.</span>
                              <span style={{ fontWeight: isTopTwo ? '600' : '500' }}>{player.name}</span>
                            </div>
                          </div>
                          
                          <div className="mobile-metrics-grid">
                            <div>
                              <div className="metric-label">Spiele</div>
                              <div className="metric-val">{player.matchesPlayed}</div>
                            </div>
                            <div>
                              <div className="metric-label">{tournamentMode === 'time' ? 'Games' : 'Matches'}</div>
                              <div className="metric-val">{tournamentMode === 'time' ? player.gamesWon : `${player.wins}:${player.losses}`}</div>
                            </div>
                            <div>
                              <div className="metric-label">Diff</div>
                              <div className={`metric-val ${player.diff >= 0 ? 'diff-positive' : 'diff-negative'}`}>
                                {diffSign}{player.gamesWon - player.gamesLost}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* DESKTOP ANSICHT: Tabellenstruktur ab Tablet/PC */}
                  <table className="desktop-table">
                    <thead>
                      <tr style={{ color: '#8e8e93', borderBottom: '1px solid #e5e5ea' }}>
                        <th className="th-label" style={{ width: '60px' }}>Rang</th>
                        <th className="th-label">Spieler</th>
                        <th className="th-label" style={{ textAlign: 'center', width: '60px' }}>Spiele</th>
                        <th className="th-label" style={{ textAlign: 'center', width: '100px' }}>
                          {tournamentMode === 'time' ? 'Gew. Games' : 'Matches'}
                        </th>
                        <th className="th-label" style={{ textAlign: 'center', width: '100px' }}>Verhältnis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupRankings.map((player, index) => {
                        const diffSign = player.diff > 0 ? '+' : '';
                        const isTopTwo = index < 2;
                        
                        return (
                          <tr 
                            key={player.name} 
                            className={isTopTwo ? 'color-top-two' : ''}
                            style={{ borderBottom: '1px solid #f2f2f7', transition: 'background-color 0.2s' }}
                          >
                            <td className="td-value" style={{ fontWeight: isTopTwo ? '600' : '400', color: isTopTwo ? '#1a7f37' : '#8e8e93' }}>
                              {index + 1}.
                            </td>
                            <td className="td-value" style={{ fontWeight: isTopTwo ? '600' : '400' }}>
                              {player.name}
                            </td>
                            <td className="td-value" style={{ textAlign: 'center', color: '#8e8e93' }}>
                              {player.matchesPlayed}
                            </td>
                            <td className="td-value" style={{ textAlign: 'center', fontWeight: '600' }}>
                              {tournamentMode === 'time' ? player.gamesWon : `${player.wins}:${player.losses}`}
                            </td>
                            <td className={`td-value ${player.diff >= 0 ? 'diff-positive' : 'diff-negative'}`} style={{ textAlign: 'center' }}>
                              {diffSign}{player.gamesWon - player.gamesLost}
                            </td>
                          </tr>
                        );
                      })}
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

