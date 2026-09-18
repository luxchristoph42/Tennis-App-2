import { supabase } from '../lib/supabase'; // Passe den Pfad an, falls nötig

export default function AdminPlayerTable({ players, onToggleCheck, onDelPlayer, loadData }) {

  // Hilfsfunktion zur Ermittlung der Kategorie (berücksichtigt manuelle Überschreibung)
  const getPlayerCategory = (p) => {
    if (p.assigned_category) return p.assigned_category;

    const age = 2026 - p.birth_year;
    let ageCat = 'Open';
    if (age <= 12) ageCat = 'U12';
    else if (age <= 15) ageCat = 'U15';
    else if (age <= 18) ageCat = 'U18';

    let gen = (p.gender || 'm').toLowerCase().charAt(0);
    if (gen === 'd') gen = 'w';

    return `${ageCat} ${gen.toUpperCase()}`;
  };

  // Funktion zum manuellen Ändern der Kategorie in der Datenbank
  const handleCategoryChange = async (player, newCat) => {
    const val = newCat === 'auto' ? null : newCat;
    const { error } = await supabase
      .from('players')
      .update({ assigned_category: val })
      .eq('id', player.id);

    if (error) {
      alert('Fehler beim Umsortieren: ' + error.message);
    } else {
      loadData();
    }
  };

  const groupedPlayers = {};
  players.forEach(p => {
    const cat = getPlayerCategory(p);
    if (!groupedPlayers[cat]) groupedPlayers[cat] = [];
    groupedPlayers[cat].push(p);
  });

  const sortedCategories = Object.keys(groupedPlayers).sort();

  const componentStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      .section-title { font-size: 20px; font-weight: 700; margin: 32px 0 16px 0; color: #1c1c1e; letter-spacing: -0.3px; }
      .empty-text { color: #8e8e93; font-style: italic; font-size: 14px; }
      .group-card { margin-bottom: 24px; border: 1px solid #e5e5ea; border-radius: 14px; overflow: hidden; background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
      .group-header { background-color: #f2f2f7; padding: 12px 16px; font-weight: 600; font-size: 15px; border-bottom: 1px solid #e5e5ea; display: flex; justify-content: space-between; align-items: center; }
      .group-count { font-size: 13px; color: #8e8e93; font-weight: 400; }
      
      /* Mobile Erstansicht als Card-List */
      .player-table { width: 100%; border-collapse: collapse; display: none; }
      .th-style { padding: 12px 16px; font-size: 13px; font-weight: 600; color: #8e8e93; text-align: left; border-bottom: 1px solid #e5e5ea; background: #fafafa; }
      .td-style { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #f2f2f7; vertical-align: middle; }
      
      .mobile-cards-container { display: flex; flex-direction: column; }
      .mobile-player-card { padding: 16px; border-bottom: 1px solid #e5e5ea; display: flex; flex-direction: column; gap: 12px; transition: background-color 0.2s; position: relative; }
      .mobile-player-card:last-child { border-bottom: none; }
      
      .player-info { display: flex; flex-direction: column; gap: 2px; }
      .player-name { font-weight: 600; color: #1c1c1e; font-size: 15px; }
      .player-details { color: #8e8e93; font-size: 13px; }
      
      .badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; width: fit-content; }
      .badge-confirmed { background-color: #eaf7ed; color: #1a7f37; }
      .badge-waiting { background-color: #fef3c7; color: #b45309; }
      
      .select-input { padding: 8px 12px; border-radius: 8px; border: 1px solid #d1d1d6; background-color: #fff; font-size: 14px; color: #1c1c1e; width: 100%; max-width: 100%; outline: none; transition: border-color 0.2s; -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>"); background-repeat: no-repeat; background-position: right 8px center; background-size: 16px; padding-right: 32px; }
      .select-input:focus { border-color: #000; }
      
      .actions-container { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 4px; }
      .btn-checkin { flex: 1; text-align: center; padding: 10px 16px; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
      .btn-active-false { background-color: #007af5; color: #fff; }
      .btn-active-false:hover { background-color: #0063c5; }
      .btn-active-true { background-color: #e5e5ea; color: #1c1c1e; }
      .btn-active-true:hover { background-color: #d1d1d6; }
      
      .btn-delete { padding: 10px; color: #ff3b30; border: 1px solid #ffe5e5; background: #fff5f5; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
      .btn-delete:hover { background: #ff3b30; color: #fff; }

      /* Desktop-Optimierung ab Tablet-Größe */
      @media (min-width: 768px) {
        .player-table { display: table; }
        .mobile-cards-container { display: none; }
        .select-input { width: auto; }
        .actions-container { justify-content: flex-end; margin-top: 0; }
        .btn-delete { background: transparent; border: none; padding: 6px 12px; font-size: 14px; }
        .btn-delete:hover { background: transparent; color: #ff3b30; text-decoration: underline; }
      }
    `}} />
  );

  return (
    <div style={{ marginBottom: '40px' }}>
      {componentStyles}
      <h2 className="section-title">Spieler-Verwaltung ({players.length} Anmeldungen)</h2>

      {players.length === 0 ? (
        <p className="empty-text">Noch keine Spieler angemeldet.</p>
      ) : (
        sortedCategories.map(catName => (
          <div key={catName} className="group-card">
            
            {/* Gruppen-Header */}
            <div className="group-header">
              <span>Kategorie: {catName}</span>
              <span className="group-count">({groupedPlayers[catName].length} Spieler)</span>
            </div>

            {/* MOBILE ANSICHT: Card-List für Smartphones */}
            <div className="mobile-cards-container">
              {groupedPlayers[catName].map(p => {
                const currentAge = 2026 - p.birth_year;
                return (
                  <div 
                    key={p.id} 
                    className="mobile-player-card"
                    style={{ backgroundColor: p.checked_in ? '#f6fdf8' : 'transparent' }}
                  >
                    <div style={{ display: 'flex', justifycontent: 'space-between', alignitems: 'flex-start' }}>
                      <div className="player-info">
                        <span className="player-name">{p.name}</span>
                        <span className="player-details">{currentAge} Jahre, ehemals {p.gender?.toUpperCase()}</span>
                      </div>
                      <span className={`badge ${p.checked_in ? 'badge-confirmed' : 'badge-waiting'}`}>
                        {p.checked_in ? 'Bestätigt' : 'Wartend'}
                      </span>
                    </div>

                    <div>
                      <select 
                        value={p.assigned_category || 'auto'} 
                        onChange={(e) => handleCategoryChange(p, e.target.value)}
                        className="select-input"
                      >
                        <option value="auto">Automatisch ({2026 - p.birth_year <= 12 ? 'U12' : 2026 - p.birth_year <= 15 ? 'U15' : 2026 - p.birth_year <= 18 ? 'U18' : 'Open'})</option>
                        <option value="U12 M">U12 Männlich</option>
                        <option value="U12 W">U12 Weiblich</option>
                        <option value="U15 M">U15 Männlich</option>
                        <option value="U15 W">U15 Weiblich</option>
                        <option value="U18 M">U18 Männlich</option>
                        <option value="U18 W">U18 Weiblich</option>
                        <option value="Open M">Open Männlich</option>
                        <option value="Open W">Open Weiblich</option>
                      </select>
                    </div>

                    <div className="actions-container">
                      <button 
                        onClick={() => onToggleCheck(p)} 
                        className={`btn-checkin ${p.checked_in ? 'btn-active-true' : 'btn-active-false'}`}
                      >
                        Check-In
                      </button>
                      <button 
                        onClick={() => onDelPlayer(p.id)} 
                        className="btn-delete"
                        title="Spieler löschen"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP ANSICHT: Klassische Tabelle für größere Bildschirme */}
            <table className="player-table">
              <thead>
                <tr>
                  <th className="th-style">Name</th>
                  <th className="th-style">Klasse ändern</th>
                  <th className="th-style">Status</th>
                  <th className="th-style" style={{ textAlign: 'right' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {groupedPlayers[catName].map(p => {
                  const currentAge = 2026 - p.birth_year;
                  return (
                    <tr 
                      key={p.id} 
                      style={{ 
                        borderBottom: '1px solid #eee', 
                        backgroundColor: p.checked_in ? '#f6fdf8' : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <td className="td-style">
                        <strong>{p.name}</strong> <span style={{ color: '#8e8e93', fontSize: '13px' }}>({currentAge} Jahre, ehemals {p.gender?.toUpperCase()})</span>
                      </td>
                      
                      <td className="td-style">
                        <select 
                          value={p.assigned_category || 'auto'} 
                          onChange={(e) => handleCategoryChange(p, e.target.value)}
                          className="select-input"
                        >
                          <option value="auto">Automatisch ({2026 - p.birth_year <= 12 ? 'U12' : 2026 - p.birth_year <= 15 ? 'U15' : 2026 - p.birth_year <= 18 ? 'U18' : 'Open'})</option>
                          <option value="U12 M">U12 Männlich</option>
                          <option value="U12 W">U12 Weiblich</option>
                          <option value="U15 M">U15 Männlich</option>
                          <option value="U15 W">U15 Weiblich</option>
                          <option value="U18 M">U18 Männlich</option>
                          <option value="U18 W">U18 Weiblich</option>
                          <option value="Open M">Open Männlich</option>
                          <option value="Open W">Open Weiblich</option>
                        </select>
                      </td>

                      <td className="td-style">
                        <span className={`badge ${p.checked_in ? 'badge-confirmed' : 'badge-waiting'}`}>
                          {p.checked_in ? 'Bestätigt' : 'Wartend'}
                        </span>
                      </td>

                      <td className="td-style" style={{ textAlign: 'right' }}>
                        <div className="actions-container">
                          <button 
                            onClick={() => onToggleCheck(p)} 
                            className={`btn-checkin ${p.checked_in ? 'btn-active-true' : 'btn-active-false'}`}
                            style={{ marginRight: '8px', flex: 'none' }}
                          >
                            Check-In
                          </button>
                          <button 
                            onClick={() => onDelPlayer(p.id)} 
                            className="btn-delete"
                            style={{ flex: 'none' }}
                            title="Spieler löschen"
                          >
                            Löschen
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
        ))
      )}
    </div>
  );
}

