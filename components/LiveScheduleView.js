export default function LiveScheduleView({ sortedCourts, groupedMatches }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {sortedCourts.map(court => (
        <div key={court} style={{ backgroundColor: 'white', border: '1px solid #e7e5e4', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          {/* Cleane Überschrift ohne Symbol */}
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.25em', color: '#1e3a8a', borderBottom: '2px solid #e7e5e4', paddingBottom: '8px', fontWeight: '700' }}>
            {court}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groupedMatches[court].map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '6px', backgroundColor: m.status === 'Beendet' ? '#f5f5f4' : '#f0f9ff', border: m.status === 'Beendet' ? '1px solid #e7e5e4' : '1px solid #bae6fd' }}>
                <div>
                  <span style={{ fontSize: '0.8em', fontWeight: 'bold', backgroundColor: m.status === 'Beendet' ? '#e7e5e4' : '#0284c7', color: m.status === 'Beendet' ? '#44403c' : 'white', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>
                    {m.category}
                  </span>
                  <span style={{ fontSize: '0.9em', color: '#78716c' }}>{m.court.includes('(') ? m.court.substring(m.court.indexOf('(')) : ''}</span>
                  <div style={{ fontSize: '1.05em', fontWeight: '600', marginTop: '6px' }}>
                    {m.player1_name} vs. {m.player2_name}
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  {m.status === 'Beendet' ? (
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1em', fontFamily: 'monospace', color: '#1c1917' }}>{m.result}</div>
                      <div style={{ fontSize: '0.8em', color: '#16a34a', fontWeight: 'bold' }}>Sieger: {m.winner}</div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85em', color: '#0369a1', fontWeight: 'bold', backgroundColor: '#e0f2fe', padding: '4px 8px', borderRadius: '4px' }}>Match läuft</span>
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
