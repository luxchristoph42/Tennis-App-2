import { useState, useEffect } from 'react';

export default function CheckIn() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const res = await fetch('/api/checkin');
    const data = await res.json();
    setPlayers(data);
  };

  const toggleCheckIn = async (id, currentStatus) => {
    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, checked_in: !currentStatus }),
    });
    setPlayers(players.map(p => p.id === id ? { ...p, checked_in: !currentStatus } : p));
  };

  const generatePlan = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-plan', { method: 'POST' });
    setLoading(false);
    if (res.ok) {
      alert(' Turnierspielplan erfolgreich generiert!');
    } else {
      alert('Fehler beim Generieren des Plans.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4"> Turniertag Check-In</h1>
      
      <button 
        onClick={generatePlan} 
        disabled={loading}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Berechne Gruppen...' : ' Turnierspielplan jetzt (neu) generieren'}
      </button>

      <div className="space-y-2">
        {players.map(p => (
          <div key={p.id} className="flex justify-between items-center border p-3 rounded shadow-sm bg-white">
            <span><strong>{p.name}</strong> (Jahrgang {p.birth_year})</span>
            <button 
              onClick={() => toggleCheckIn(p.id, p.checked_in)}
              className={`px-4 py-1.5 rounded text-sm font-bold text-white transition ${p.checked_in ? 'bg-green-500' : 'bg-gray-400'}`}
            >
              {p.checked_in ? 'Anwesend' : 'Fehlt'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
