export default function AdminPlayerTable({ players, onToggleCheck, onDelPlayer }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>Spieler ({players.length})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f5', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Name</th>
            <th style={{ padding: '8px' }}>Geschlecht</th>
            <th style={{ padding: '8px' }}>Status</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{p.name} ({2026 - p.birth_year})</td>
              <td style={{ padding: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>{p.gender || 'M'}</td>
              <td>{p.checked_in ? '🟢 Eingecheckt' : '🟡 Wartend'}</td>
              <td style={{ textAlign: 'right' }}>
                <button onClick={() => onToggleCheck(p)} style={{ marginRight: '6px', padding: '4px 8px', cursor: 'pointer' }}>Status</button>
                <button onClick={() => onDelPlayer(p.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2em' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
