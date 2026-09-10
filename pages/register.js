import { useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, birth_year: parseInt(birthYear) }),
    });
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="p-8 text-center text-green-600 font-bold text-xl">
      🎾 Erfolgreich zum Turnier angemeldet!
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl font-sans border">
      <h1 className="text-2xl font-bold mb-4 text-center">Jugendturnier Anmeldung</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name des Kindes</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full border p-2 rounded" 
            placeholder="Vor- und Nachname"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Geburtsjahr</label>
          <input 
            type="number" 
            required 
            placeholder="z.B. 2012" 
            value={birthYear} 
            onChange={(e) => setBirthYear(e.target.value)} 
            className="w-full border p-2 rounded" 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition">
          Jetzt Anmelden
        </button>
      </form>
    </div>
  );
}
