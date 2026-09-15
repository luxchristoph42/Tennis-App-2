import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCheckin() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [courts, setCourts] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Für die Ergebniseingabe
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [inputResult, setInputResult] = useState('');
  const [inputWinner, setInputWinner] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Spieler holen
      const { data: pData, error: pError } = await supabase.from('players').select('*').order('name');
      if (pError) throw pError;
      setPlayers(pData || []);

      // 2. Spiele holen
      const { data: mData, error: mError } = await supabase.from('matches').select('*').order('id');
      if (!mError && mData) setMatches(mData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const savedCourts = localStorage.getItem('tennis_courts');
    if (savedCourts) setCourts(parseInt(savedCourts));
  }, []);

  const handleCourtChange = (e) => {
    const val = parseInt(e.target.value);
    setCourts(val);
    localStorage.setItem('tennis_courts', val);
  };

  const toggleCheckIn = async (player) => {
    await supabase.from('players').update({ checked_in: !player.checked_in }).eq('id', player.id);
    fetchData();
  };

  const deletePlayer = async (id, name) => {
    if (!confirm(`${name} löschen?`)) return;
    await supabase.from('players').delete().eq('id', id);
    fetchData();
  };

  // TURNIERPLAN ERSTELLEN & IN SUPABASE SPEICHERN
  const generateAndSaveSchedule = async () => {
    const checkedIn = players.filter(p => p.checked_in);
    if (checkedIn.length < 2) {
      alert('Mindestens 2 eingecheckte Spieler benötigt!');
      return;
    }

    if (!confirm('Achtung: Dadurch wird der alte Spielplan gelöscht und ein neuer erstellt!')) return;

    try {
      setLoading(true);
      // Alten Plan löschen
      await supabase.from('matches').delete().neq('id', '0');

      const categories = { U12: [], U15: [], U18: [], Open: [] };
      checkedIn.forEach(p => {
        const age = 2026 - p.birth_year;
        if (age <= 12) categories.U12.push(p);
        else if (age <= 15) categories.U15.push(p);
        else if (age <= 18) categories.U18.push(p);
        else categories.Open.push(p);
      });

      const newMatches = [];
      let counter = 0;

      Object.keys(categories).forEach(cat => {
        const catP = categories[cat];
        if (catP.length >= 2) {
          for (let i = 0; i < catP.length; i++) {
            for (let j = i + 1; j < catP.length; j++) {
              newMatches.push({
                category: cat,
                player1_name: catP[i].name,
                player2_name: catP[j].name,
                court: `Platz ${(counter % courts) + 1}`,
                status: 'Ausstehend'
              });
              counter++;
            }
          }
        }
      });

      if (newMatches.length > 0) {
        const { error } = await supabase.from('matches').insert(newMatches);
        if (error) throw error;
        alert('Spielplan erfolgreich generiert und online gespeichert!');
      } else {
        alert('Keine Altersklasse hat genügend Spieler.');
      }
      fetchData();
    } catch (err) {
      alert('Fehler: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ERGEBNIS SPEICHERN
  const saveResult = async (matchId) => {
    if (!inputWinner) {
      alert('Bitte wähle den Gewinner aus!');
      return;
    }
    try {
      const { error } = await supabase
        .from('matches')
        .update({
          result: inputResult,
          winner: inputWinner,
          status: 'Beendet'
        })
        .eq('id', matchId);

      if (error) throw error;
      setEditingMatchId(null);
      setInputResult('');
      setInputWinner('');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const resetAll = async () => {
    if (!confirm('ALLES LÖSCHEN?')) return;
    await supabase.from('players').delete().neq('id', 0);
    await supabase.from('matches').delete().neq('id', '0');
    fetchData();
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/">← Zurück zur Startseite</Link>
        <button onClick={resetAll} style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          💥 Turnier zurücksetzen (0)
        </button>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Admin Control Panel</h1>

      {/* Plätze & Generieren */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Plätze:</label>
          <select value={courts} onChange={handleCourtChange} style={{ padding: '6px', borderRadius: '6px' }}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Plätze</option>)}
          </select>
        </div>
        <button onClick={generateAndSaveSchedule} style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '18px' }}>
          Spiele generieren & online speichern 🚀
        </button>
      </div>

      {/* Spieler-Tabelle */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Spieler ({players.length})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f5', textAlign: 'left' }}><th style={{ padding: '8px' }}>Name</th><th style={{ padding: '8px' }}>Status</th><th style={{ padding: '8px', textAlign: 'right' }}>Aktionen</th></tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.name} ({2026-p.birth_year})</td>
              <td style={{ padding: '8px' }}>{p.checked_in ? '🟢 Eingecheckt' : '🟡 Wartend'}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                <button onClick={() => toggleCheckIn(p)} style={{ marginRight: '6px' }}>{p.checked_in ? 'Auschecken' : 'Einchecken'}</button>
                <button onClick={() => deletePlayer(p.id, p.name)} style={{ color: 'red' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ergebniseingabe für Spiele */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Live-Ergebnisse eintragen ({matches.length} Spiele)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {matches.map(m => (
          <div key={m.id} style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span><strong style={{ color: '#166534' }}>[{m.category}]</strong> <strong>{m.player1_name}</strong> VS <strong>{m.player2_name}</strong></span>
              <span style={{ fontWeight: 'bold', color: m.status === 'Beendet' ? 'green' : '#d97706' }}>{m.status} {m.result && `(${m.result})`}</span>
            </div>

            {editingMatchId === m.id ? (
              <div style={{ backgroundColor: '#f4f4f5', padding: '12px', borderRadius: '8px', marginTop: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input type="text" placeholder="z.B. 6:4, 6:2" value={inputResult} onChange={e => setInputResult(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <select value={inputWinner} onChange={e => setInputWinner(e.target.value)} style={{ padding: '6px' }}>
                  <option value="">-- Sieger wählen --</option>
                  <option value={m.player1_name}>{m.player1_name}</option>
                  <option value={m.player2_name}>{m.player2_name}</option>
                </select>
                <button onClick={() => saveResult(m.id)} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Speichern</button>
                <button onClick={() => setEditingMatchId(null)}>Abbrechen</button>
              </div>
            ) : (
              <button onClick={() => { setEditingMatchId(m.id); setInputResult(m.result || ''); setInputWinner(m.winner || ''); }} style={{ fontSize: '12px', padding: '4px 8px' }}>
                {m.status === 'Beendet' ? 'Ergebnis korrigieren ✏️' : 'Ergebnis eintragen 📝'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
