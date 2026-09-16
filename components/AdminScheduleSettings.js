export default function AdminScheduleSettings({
  courts, setCourts,
  startT, setStartT,
  endT, setEndT, // Neu
  dur, setDur,
  separateGender, setSeparateGender,
  tournamentMode, setTournamentMode,
  onGenerate
}) {
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <label>Plätze: </label>
      <select value={courts} onChange={e => setCourts(parseInt(e.target.value))}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Plätze</option>)}
      </select>
      
      <label>Start: </label>
      <input type="time" value={startT} onChange={e => setStartT(e.target.value)} />

      {/* Neues Eingabefeld für das Turnierende */}
      <label>Turnierende: </label>
      <input type="time" value={endT} onChange={e => { setEndT(e.target.value); localStorage.setItem('t_end_time', e.target.value); }} />
      
      <label>Dauer: </label>
      <select value={dur} onChange={e => setDur(parseInt(e.target.value))}>
        <option value="15">15 Min</option>
        <option value="20">20 Min</option>
        <option value="30">30 Min</option>
        <option value="40">40 Min</option>
      </select>

      <label>Modus: </label>
      <select value={tournamentMode} onChange={e => { setTournamentMode(e.target.value); localStorage.setItem('t_mode', e.target.value); }} style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
        <option value="time">Match auf Zeit (Spiele zählen)</option>
        <option value="sets">Klassisches Satz-System</option>
      </select>

      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        <input 
          type="checkbox" 
          checked={separateGender} 
          onChange={e => { setSeparateGender(e.target.checked); localStorage.setItem('t_sep_gender', e.target.checked.toString()); }} 
        />
        Geschlechter trennen 👫
      </label>

      <button onClick={onGenerate} style={{ padding: '6px 12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}>Generieren 🚀</button>
    </div>
  );
}
