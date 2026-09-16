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
  return (
    <div>
      <h2>Ergebnisse ({matches.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {matches.map(m => (
          <div key={m.id} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{m.category}</strong> - {m.court} <br />
                <span style={{ fontSize: '1.1em' }}>{m.player1_name} vs. {m.player2_name}</span>
              </div>
              <div>
                <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: m.status === 'Beendet' ? '#e4e4e7' : '#dbeafe', color: m.status === 'Beendet' ? '#71717a' : '#1e40af', fontWeight: 'bold' }}>
                  {m.status}
                </span>
              </div>
            </div>

            {m.status === 'Beendet' && (
              <div style={{ marginTop: '8px', padding: '6px', backgroundColor: '#f4f4f5', borderRadius: '4px' }}>
                <strong>Ergebnis:</strong> {m.result} | <strong>Sieger:</strong> {m.winner}
              </div>
            )}

            <div style={{ marginTop: '10px', textAlign: 'right' }}>
              {editId === m.id ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'flex-end', marginTop: '10px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="z.B. 6:4, 7:5" value={resText} onChange={e => setResText(e.target.value)} style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <select value={winName} onChange={e => setWinName(e.target.value)} style={{ padding: '4px' }}>
                    <option value="">-- Sieger wählen --</option>
                    <option value={m.player1_name}>{m.player1_name}</option>
                    <option value={m.player2_name}>{m.player2_name}</option>
                  </select>
                  <button onClick={() => onSaveRes(m.id)} style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Speichern</button>
                  <button onClick={() => setEditId(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>Abbrechen</button>
                </div>
              ) : (
                <button onClick={() => onStartEdit(m)} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                  {m.status === 'Beendet' ? 'Ergebnis bearbeiten 📝' : 'Ergebnis eintragen 🏆'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
