import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
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
        body: JSON.stringify({ name, birth_year: parseInt(birthYear) }),
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

  if (submitted) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'green', fontWeight: 'bold', fontSize: '20px', fontFamily: 'sans-serif' }}>
        🎾 Erfolgreich zum Turnier angemeldet!
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '12px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
        Jugendturnier Anmeldung
      </h1>
      
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
            Name des Kindes
          </label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px' }} 
            placeholder="Vor- und Nachname"
          />
        </div>
        
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
            Geburtsjahr
          </label>
          <input 
            type="number" 
            required 
            placeholder="z.B. 2012" 
            value={birthYear} 
            onChange={(e) => setBirthYear(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '6px' }} 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', backgroundColor: loading ? '#ccc' : '#0070f3', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px' }}
        >
          {loading ? 'Wird angemeldet...' : 'Jetzt Anmelden'}
        </button>
      </form>
    </div>
  );
}
