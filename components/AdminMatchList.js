export default function AdminMatchList({
  matches,
  editId,
  resText,
  setResText,
  winName,
  setWinName,
  onStartEdit,
  onSaveRes,
  setEditId
}) {
  // Hilfsfunktion, um die Platznummer aus dem String zu extrahieren (z.B. "Platz 1 (10:00 Uhr)" -> "Platz 1")
  const getCourtName = (courtString) => {
    if (!courtString) return 'Unbekannter Platz';
    const match = courtString.match(/Platz\s+\d+/i);
    return match ? match[0] : courtString;
  };

  // Gruppierung der Matches nach Plätzen
  const groupedMatches = {};
  matches.forEach(m => {
    const courtName = getCourtName(m.court);
    if (!groupedMatches[courtName]) {
      groupedMatches[courtName] = [];
    }
    groupedMatches[courtName].push(m);
  });

  // Sortierung der Plätze (Platz 1, Platz 2, ...)
  const sortedCourts = Object.keys(groupedMatches).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  const componentStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      .match-empty-card { padding: 32px 24px; text-align: center; background-color: #fff; border: 1px solid #e5e5ea; border-radius: 14px; color: #8e8e93; font-style: italic; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
      .list-title { font-size: 20px; font-weight: 700; margin: 32px 0 16px 0; color: #1c1c1e; letter-spacing: -0.3px; }
      .court-group { margin-bottom: 32px; }
      
      .court-header { background-color: #000; color: #fff; padding: 12px 16px; border-radius: 10px; font-weight: 600; font-size: 15px; margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
      .matches-container { display: flex; flex-direction: column; gap: 14px; }
      
      .match-card { padding: 16px; border: 1px solid #e5e5ea; border-radius: 12px; background-color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.01); transition: transform 0.2s; position: relative; }
      .match-status-active { border-left: 5px solid #007af5; }
      .match-status-ended { border-left: 5px solid #8e8e93; }
      
      .match-top-row { display: flex; flex-direction: column; gap: 12px; }
      .category-badge { font-size: 11px; background-color: #f2f2f7; color: #555; padding: 4px 8px; border-radius: 6px; font-weight: 600; width: fit-content; text-transform: uppercase; letter-spacing: 0.3px; }
      .time-info { color: #8e8e93; font-size: 13px; font-weight: 500; margin-left: 6px; }
      
      .versus-container { font-size: 16px; font-weight: 600; color: #1c1c1e; margin-top: 6px; line-height: 1.4; }
      .versus-divider { color: #aeaeb2; font-weight: 400; padding: 0 4px; }
      
      .status-pill { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; width: fit-content; text-align: center; }
      .pill-active { background-color: #eaf2ff; color: #007af5; }
      .pill-ended { background-color: #f2f2f7; color: #666; }
      
      .result-banner { margin-top: 14px; padding: 12px; background-color: #f6fdf8; border-radius: 8px; border: 1px solid #eaf7ed; display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
      .result-text { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 700; color: #1c1c1e; }
      .winner-text { color: #1a7f37; font-weight: 700; }
      
      .action-footer { margin-top: 14px; text-align: right; border-top: 1px solid #f2f2f7; padding-top: 12px; }
      
      .btn-action-trigger { width: 100%; padding: 10px 16px; cursor: pointer; background-color: #fafafa; border: 1px solid #d1d1d6; border-radius: 8px; font-size: 13px; font-weight: 600; color: #1c1c1e; transition: all 0.2s; box-sizing: border-box; }
      .btn-action-trigger:hover { background-color: #f2f2f7; }
      
      .edit-form-grid { display: flex; flex-direction: column; gap: 10px; width: 100%; }
      .edit-input { padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d1d6; font-size: 14px; width: 100%; box-sizing: border-box; outline: none; }
      .edit-input:focus { border-color: #000; }
      
      .edit-select { padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d1d6; background-color: #fff; font-size: 14px; width: 100%; box-sizing: border-box; outline: none; -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; }
      
      .btn-group-submit { display: flex; gap: 8px; width: 100%; }
      .btn-save { flex: 1; background-color: #1a7f37; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }
      .btn-save:hover { background-color: #115e29; }
      .btn-cancel { background: transparent; border: 1px solid #d1d1d6; color: #666; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; }
      .btn-cancel:hover { background-color: #fafafa; }

      @media (min-width: 640px) {
        .match-top-row { flex-direction: row; justify-content: space-between; align-items: center; }
        .result-banner { flex-direction: row; gap: 24px; }
        .btn-action-trigger { width: auto; display: inline-block; }
        .edit-form-grid { flex-direction: row; justify-content: flex-end; align-items: center; }
        .edit-input { width: 140px; }
        .edit-select { width: 200px; }
        .btn-group-submit { width: auto; }
      }
    `}} />
  );

  if (matches.length === 0) {
    return (
      <div className="match-empty-card">
        {componentStyles}
        Noch keine Spiele generiert. Gehe zum Tab "Setup und Spieler", um den Spielplan zu erstellen.
      </div>
    );
  }

  return (
    <div>
      {componentStyles}
      <h2 className="list-title">Turnier-Live-Betrieb und Ergebnisse ({matches.length} Spiele)</h2>
      
      {sortedCourts.map(court => (
        <div key={court} className="court-group">
          <div className="court-header">
            {court}
          </div>

          <div className="matches-container">
            {groupedMatches[court].map(m => (
              <div 
                key={m.id} 
                className={`match-card ${m.status === 'Beendet' ? 'match-status-ended' : 'match-status-active'}`}
              >
                <div className="match-top-row">
                  <div>
                    <span className="category-badge">
                      {m.category}
                    </span>
                    <strong className="time-info">
                      {m.court.includes('(') ? m.court.substring(m.court.indexOf('(')) : ''}
                    </strong>
                    <div className="versus-container">
                      {m.player1_name} <span className="versus-divider">vs.</span> {m.player2_name}
                    </div>
                  </div>
                  <div>
                    <span className={`status-pill ${m.status === 'Beendet' ? 'pill-ended' : 'pill-active'}`}>
                      {m.status === 'Beendet' ? 'Beendet' : 'Aktiv'}
                    </span>
                  </div>
                </div>

                {m.status === 'Beendet' && (
                  <div className="result-banner">
                    <span><strong>Ergebnis:</strong> <span className="result-text">{m.result}</span></span>
                    <span><strong>Sieger:</strong> <span className="winner-text">{m.winner}</span></span>
                  </div>
                )}

                <div className="action-footer">
                  {editId === m.id ? (
                    <div className="edit-form-grid">
                      <input 
                        type="text" 
                        placeholder="z.B. 6:4, 7:5" 
                        value={resText} 
                        onChange={e => setResText(e.target.value)} 
                        className="edit-input" 
                      />
                      <select value={winName} onChange={e => setWinName(e.target.value)} className="edit-select">
                        <option value="">-- Sieger wählen --</option>
                        <option value={m.player1_name}>{m.player1_name}</option>
                        <option value={m.player2_name}>{m.player2_name}</option>
                      </select>
                      <div className="btn-group-submit">
                        <button onClick={() => onSaveRes(m.id)} className="btn-save">Speichern</button>
                        <button onClick={() => setEditId(null)} className="btn-cancel">Abbrechen</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => onStartEdit(m)} className="btn-action-trigger">
                      {m.status === 'Beendet' ? 'Ergebnis bearbeiten' : 'Ergebnis eintragen'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
