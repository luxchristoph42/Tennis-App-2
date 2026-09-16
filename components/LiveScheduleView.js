export default function LiveScheduleView({ sortedCourts, groupedMatches }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {sortedCourts.map(court => (
        <div key={court} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.4em', color: '#1e3a8a', borderBottom: '2px solid #e4e4e7', paddingBottom: '8px' }}>
            🏟️ {court}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groupedMatches[court].map(m => (
              <div key={m.id} style={{ display: 'flex', justify_content: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', backgroundColor: m.status === 'Beendet' ? '#f8fafc' : '#eff6ff', border: m.status === 'Beendet' ? '1px solid #e2e8f0' : '1px solid #bfdbfe' }}>
                <div>
                  <span style={{ fontSize: '0.8em', fontWeight: 'bold', backgroundColor: m.status === 'Beendet' ? '#e2e8f0' : '#3b82f6', color: m.status === 'Beendet' ? '#475569' : 'white', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>
                    {m.category}
                  </span>
                  <span style={{ fontSize: '0.9em', color: '#64748b' }}>{m.court.includes('(') ? m.court.substring(m.court.indexOf('(')) : ''}</span>
                  <div style={{ fontSize: '1.1em', fontWeight: '600', marginTop: '6px' }}>
                    {m.player1_name} vs. {m.player2_name}
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '120px' }}>
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
  );
}
