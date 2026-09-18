import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState('m'); 
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          birth_year: parseInt(birthYear),
          gender: gender 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Fehler bei der Anmeldung.');
      }
    } catch (err) {
      setError('Verbindung zum Server fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  const componentStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      .reg-wrapper { min-height: 100vh; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1c1c1e; display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box; }
      .reg-card { background-color: #ffffff; border: 1px solid #e5e5ea; padding: 32px 24px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); max-width: 400px; width: 100%; box-sizing: border-box; }
      .reg-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; text-align: center; letter-spacing: -0.5px; }
      
      .alert-error { padding: 12px; background-color: #ffe5e5; color: #ff3b30; border-radius: 10px; margin-bottom: 20px; font-size: 14px; font-weight: 500; border: 1px solid #ffd1d1; }
      .alert-success { padding: 32px 24px; background-color: #f4f8ff; color: #007af5; border-radius: 16px; text-align: center; font-weight: 600; font-size: 18px; border: 1px solid #d0e1fd; max-width: 400px; width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
      
      .form-grid { display: flex; flex-direction: column; gap: 18px; }
      .label-text { display: block; font-size: 13px; font-weight: 600; color: #8e8e93; margin-bottom: 6px; }
      
      .input-control { width: 100%; padding: 12px; box-sizing: border-box; border: 1px solid #d1d1d6; border-radius: 10px; font-size: 16px; background-color: #fff; outline: none; transition: border-color 0.2s; -webkit-appearance: none; }
      .input-control:focus { border-color: #000; }
      
      .select-control { -webkit-appearance: none; -moz-appearance: none; appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://w3.org' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238e8e93' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>"); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; padding-right: 40px; cursor: pointer; }
      
      .btn-submit { width: 100%; background-color: #000; color: white; padding: 14px; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; }
      .btn-submit:hover { opacity: 0.85; }
      .btn-submit:disabled { background-color: #e5e5ea; color: #aeaeb2; cursor: not-allowed; }
    `}} />
  );

  if (submitted) {
    return (
      <div className="reg-wrapper">
        {componentStyles}
        <div className="alert-success">
          Erfolgreich zum Turnier angemeldet!
        </div>
      </div>
    );
  }

  return (
    <div className="reg-wrapper">
      {componentStyles}
      <div className="reg-card">
        <h1 className="reg-title">Jugendturnier Anmeldung</h1>
        
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <label className="label-text">Name des Kindes</label>
            <input 
              type="text" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="input-control"
              placeholder="Vor- und Nachname"
            />
          </div>
          
          <div>
            <label className="label-text">Geburtsjahr</label>
            <input 
              type="number" 
              required 
              placeholder="z.B. 2012" 
              value={birthYear} 
              onChange={(e) => setBirthYear(e.target.value)} 
              className="input-control"
            />
          </div>

          <div>
            <label className="label-text">Geschlecht</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input-control select-control"
            >
              <option value="m">Männlich (m)</option>
              <option value="w">Weiblich (w)</option>
              <option value="d">Divers (d)</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-submit"
          >
            {loading ? 'Wird angemeldet...' : 'Jetzt Anmelden'}
          </button>
        </form>
      </div>
    </div>
  );
}
