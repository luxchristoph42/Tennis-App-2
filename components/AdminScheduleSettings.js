export default function AdminScheduleSettings({
  courts, setCourts,
  startT, setStartT,
  endT, setEndT,
  dur, setDur,
  separateGender, setSeparateGender,
  tournamentMode, setTournamentMode,
  onGenerate
}) {
  const componentStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      .settings-card { background-color: #fff; border: 1px solid #e5e5ea; padding: 20px; border-radius: 14px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
      .settings-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 20px; }
      .form-group { display: flex; flex-direction: column; gap: 6px; }
      .form-label { font-size: 13px; font-weight: 600; color: #8e8e93; }
      
      .input-field { padding: 10px 12px; border-radius: 8px; border: 1px solid #d1d1d6; background-color: #fff; font-size: 15px; color: #1c1c1e; outline: none; transition: border-color 0.2s; box-sizing: border-box; width: 100%; height: 42px; }
      .input-field:focus { border-color: #000; }
      
      .select-field { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; padding-right: 36px; }
      
      .checkbox-container { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 12px 0; font-size: 14px; font-weight: 500; color: #1c1c1e; user-select: none; }
      .checkbox-input { width: 18px; height: 18px; border-radius: 4px; border: 1px solid #d1d1d6; accent-color: #000; cursor: pointer; }
      
      .btn-generate { width: 100%; padding: 12px 24px; background-color: #1a7f37; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 15px; font-weight: 600; transition: background-color 0.2s; text-align: center; box-sizing: border-box; }
      .btn-generate:hover { background-color: #115e29; }

      @media (min-width: 550px) {
        .settings-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 800px) {
        .settings-grid { grid-template-columns: repeat(3, 1fr); }
        .checkbox-container { grid-column: span 2; padding: 0; margin-top: 24px; }
        .btn-generate { width: auto; margin-left: auto; padding: 10px 20px; font-size: 14px; }
        .action-row { display: flex; align-items: center; justify-content: space-between; }
      }
    `}} />
  );

  return (
    <div className="settings-card">
      {componentStyles}
      
      <div className="settings-grid">
        <div className="form-group">
          <label className="form-label">Plätze</label>
          <select className="input-field select-field" value={courts} onChange={e => setCourts(parseInt(e.target.value))}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Plätze</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Startzeit</label>
          <input className="input-field" type="time" value={startT} onChange={e => setStartT(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Turnierende</label>
          <input className="input-field" type="time" value={endT} onChange={e => { setEndT(e.target.value); localStorage.setItem('t_end_time', e.target.value); }} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Dauer</label>
          <select className="input-field select-field" value={dur} onChange={e => setDur(parseInt(e.target.value))}>
            <option value="15">15 Min</option>
            <option value="20">20 Min</option>
            <option value="30">30 Min</option>
            <option value="40">40 Min</option>
          </select>
        </div>

        <div className="form-group" style={{ gridColumn: 'span 1' }}>
          <label className="form-label">Modus</label>
          <select className="input-field select-field" value={tournamentMode} onChange={e => { setTournamentMode(e.target.value); localStorage.setItem('t_mode', e.target.value); }}>
            <option value="time">Match auf Zeit (Spiele zählen)</option>
            <option value="sets">Klassisches Satz-System</option>
          </select>
        </div>
      </div>

      <div className="action-row">
        <label className="checkbox-container">
          <input 
            type="checkbox" 
            className="checkbox-input"
            checked={separateGender} 
            onChange={e => { setSeparateGender(e.target.checked); localStorage.setItem('t_sep_gender', e.target.checked.toString()); }} 
          />
          Geschlechter trennen
        </label>

        <button onClick={onGenerate} className="btn-generate">Spielplan generieren</button>
      </div>
    </div>
  );
}
