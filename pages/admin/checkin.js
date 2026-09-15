import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCheckin() {
  const [players, setPlayers] = useState([]);
  const [courts, setCourts] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    const savedCourts = localStorage.getItem('tennis_courts');
    if (savedCourts) setCourts(parseInt(savedCourts));
  }, []);

  const handleCourtChange = (e) => {
    const val = parseInt(e.target.value);
    setCourts(val);
    localStorage.setItem('tennis_courts', val);
  };

  // FUNKTION 1: Einzelnen Spieler ein-/auschecken
  const toggleCheckIn = async (player) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ checked_in: !player.checked_in })
        .eq('id', player.id);

      if (error) throw error;
      fetchPlayers(); // Liste neu laden
    } catch (err) {
      alert('Fehler beim Status-Update: ' + err.message);
    }
  };

  // FUNKTION 2: Einzelnen Spieler bei Absage löschen
  const deletePlayer = async (id, name) => {
    if (!confirm(`Möchtest du ${name} wirklich vom Turnier abmelden?`)) return;
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPlayers();
    } catch (err) {
      alert('Fehler beim Löschen des Spielers: ' + err.message);
    }
  };

  // FUNKTION 3: Gesamtes Turnier zurücksetzen (Alle löschen)
  const resetAllPlayers = async () => {
    if (!confirm('WARNUNG: Möchtest du wirklich ALLE angemeldeten Spieler unwiderruflich löschen?')) return;
    try {
      setLoading(true);
      
      // Löscht alle Zeilen aus der Tabelle 'players'
      const { error } = await supabase
        .from('players')
        .delete()
        .neq('id', 0); // Löscht jeden Eintrag, dessen ID ungleich 0 ist (also alle)

      if (error) throw error;
      setPlayers([]);
      alert('Turnier erfolgreich zurückgesetzt. Alle Daten wurden gelöscht.');
    } catch (err) {
      alert('Fehler beim Zurücksetzen: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/">← Zurück zur Startseite</Link>
        {/* Reset Button oben rechts */}
        <button 
          onClick={resetAllPlayers} 
          style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          💥 Turnier komplett zurücksetzen (0)
        </button>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Admin-Bereich</h1>
      
      <div style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>Anlagen-Konfiguration</h3>
        <label style={{ fontSize: '14px', color: '#52525b', display: 'block', marginBottom: '8px' }}>
          Verfügbare Tennisplätze für dieses Turnier:
        </label>
        <select value={courts} onChange={handleCourtChange} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', width: '120px' }}>
          {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Platz' : 'Plätze'}</option>)}
        </select>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
        Gemeldete Personen ({players.length}) | Aktiv Eingecheckt: {players.filter(p => p.checked_in).length}
      </h2>
      
      <button onClick={fetchPlayers} style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}>
        Liste aktualisieren 🔄
      </button>

      {loading && <p>Lade Spielerdaten...</p>}
      {error && <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px' }}>{error}</div>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left', backgroundColor: '#f4f4f5' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Geburtsjahr</th>
              <th style={{ padding: '10px' }}>Klasse</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => {
              const age = 2026 - player.birth_year;
              let category = 'Open';
              if (age <= 12) category = 'U12';
              else if (age <= 15) category = 'U15';
              else if (age <= 18) category = 'U18';

              return (
                <tr key={player.id || idx} style={{ borderBottom: '1px solid #eee', backgroundColor: player.checked_in ? '#f0fdf4' : 'transparent' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>{player.name}</td>
                  <td style={{ padding: '10px' }}>{player.birth_year}</td>
                  <td style={{ padding: '10px' }}>{category}</td>
                  <td style={{ padding: '10px' }}>
                    {player.checked_in ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>🟢 Bestätigt</span>
                    ) : (
                      <span style={{ color: '#d97706' }}>🟡 Wartend</span>
                    )}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'end' }}>
                    {/* Einchecken / Auschecken Button */}
                    <button 
                      onClick={() => toggleCheckIn(player)}
                      style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: player.checked_in ? '#f3f4f6' : '#22c55e', color: player.checked_in ? '#374151' : 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      {player.checked_in ? 'Auschecken' : 'Anwesenheit bestätigen (Einchecken)'}
                    </button>
                    {/* Löschen Button */}
                    <button 
                      onClick={() => deletePlayer(player.id, player.name)}
                      style={{ padding: '6px 10px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      🗑️ Entfernen
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
