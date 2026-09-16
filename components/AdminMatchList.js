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

  if (matches.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px', color: '#666', fontStyle: 'italic' }}>
        Noch keine Spiele generiert. Gehe zum Tab "Spieler- & Turnierverwaltung", um den Spielplan zu erstellen.
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Turnier-Live-Betrieb & Ergebnisse ({matches.length} Spiele)</h2>
      
      {sortedCourts.map(court => (
        <div key={court} style={{ marginBottom: '32px' }}>
          {/* Klare Zwischenüberschrift für den Platz */}
          <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.2em', marginBottom: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            🏟️ {court}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groupedMatches[court].map(m => (
              <div key={m.id} style={{ padding: '14px', border: '1px solid #e4e4e7', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: m.status === 'Beendet' ? '6px solid #a1a1aa' : '6px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.85em', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', marginRight: '8px' }}>
                      {m.category}
                    </span>
                    <strong style={{ color: '#4b5563' }}>{m.court.includes('(') ? m.court.substring(m.court.indexOf('(')) : ''}</strong>
                    <div style={{ fontSize: '1.15em', fontWeight: '500', marginTop: '6px' }}>
                      {m.player1_name} <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>vs.</span> {m.player2_name}
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: '6px 10px', borderRadius: '20px', fontSize: '0.85em', backgroundColor: m.status === 'Beendet' ? '#f4f4f5' : '#dbeafe', color: m.status === 'Beendet' ? '#71717a' : '#1e40af', fontWeight: 'bold', border: m.status === 'Beendet' ? '1px solid #e4e4e7' : '1px solid #bfdbfe' }}>
                      {m.status === 'Beendet' ? '🏁 Beendet' : '🎾 Aktiv'}
                    </span>
                  </div>
                </div>

                {m.status === 'Beendet' && (
                  <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', gap: '16px' }}>
                    <span><strong>Ergebnis:</strong> <span style={{ fontFamily: 'monospace', fontSize: '1.1em' }}>{m.result}</span></span>
                    <span><strong>Sieger:</strong> <span style={{ color: '#166534', fontWeight: 'bold' }}>🏆 {m.winner}</span></span>
                  </div>
                )}

                <div style={{ marginTop: '12px', textAlign: 'right', borderTop: '1px solid #f4f4f5', paddingTop: '8px' }}>
                  {editId === m.id ? (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <input 
                        type="text" 
                        placeholder="z.B. 6:4, 7:5" 
                        value={resText} 
                        onChange={e => setResText(e.target.value)} 
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '120px' }} 
                      />
                      <select value={winName} onChange={e => setWinName(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                        <option value="">-- Sieger wählen --</option>
                        <option value={m.player1_name}>{m.player1_name}</option>
                        <option value={m.player2_name}>{m.player2_name}</option>
                      </select>
                      <button onClick={() => onSaveRes(m.id)} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Speichern</button>
                      <button onClick={() => setEditId(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '6px' }}>Abbrechen</button>
                    </div>
                  ) : (
                    <button onClick={() => onStartEdit(m)} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '4px', fontWeight: '500', color: '#3f3f46' }}>
                      {m.status === 'Beendet' ? 'Ergebnis bearbeiten 📝' : 'Ergebnis eintragen 🏆'}
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
