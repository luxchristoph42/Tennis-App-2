import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCheckin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [courts, setCourts] = useState(2);
  const [loading, setLoading] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [inputResult, setInputResult] = useState('');
  const [inputWinner, setInputWinner] = useState('');

  const ADMIN_PASSWORD = "tennis2026";

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: p } = await supabase.from('players').select('*').order('name');
      setPlayers(p || []);
      const { data: m } = await supabase.from('matches').select('*').order('id');
      setMatches(m || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
    const saved = localStorage.getItem('tennis_courts');
    if (saved) setCourts(parseInt(saved));
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const toggleCheckIn = async (p) => {
    await supabase.from('players').update({ checked_in: !p.checked_in }).eq('id', p.id);
    fetchData();
  };

  const deletePlayer = async (id) => {
    if (confirm('Löschen?')) {
      await supabase.from('players').delete().eq('id', id);
      fetchData();
    }
  };

  const generateSchedule = async () => {
    const active = players.filter(p => p.checked_in);
    if (active.length < 2) return alert('Mindestens 2 eingecheckte Spieler!');
    if (!confirm('Neuen Spielplan erstellen?')) return;

    await supabase.from('matches').delete().neq('id', 0);
    const cats = { U12: [], U15: [], U18: [], Open: [] };
    active.forEach(p => {
      const age = 2026 - p.birth_year;
      if (age <= 12) cats.U12.push(p);
      else if (age <= 15) cats.U15.push(p);
      else if (age <= 18) cats.U18.push(p);
      else cats.Open.push(p);
    });

    const list = [];
    let cnt = 0;
    Object.keys(cats).forEach(c => {
      const arr = cats[c];
      if (arr.length >= 2) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            list.push({
              category: c,
              player1_name: arr[i].name,
              player2_name: arr[j].name,
              court: `Platz ${(cnt % courts) + 1}`,
              status: 'Ausstehend'
            });
            cnt++;
          }
        }
      }
    });

    if (list.length > 0) await supabase.from('matches').insert(list);
    fetchData();
  };

  const saveResult = async (id) => {
    if (!inputWinner) return alert('Sieger wählen!');
    await supabase.from('matches').update({ result: inputResult, winner: inputWinner, status: 'Beendet' }).eq('id', id);
    setEditingMatchId(null);
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '300px', margin: '100px auto', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🔒 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' }} />
          {loginError && <p style={{ color: 'red' }}>Falsches Passwort!</p>}
          <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Link href="/">← Startseite</Link>
        <button onClick={handleLogout}>Abmelden 🔓</button>
      </div>
      
      <h1>Admin Control Panel 🛠️</h1>
      
      <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <label>Plätze: </label>
        <select value={courts} onChange={e => { setCourts(parseInt(e.target.value)); localStorage.setItem('tennis_courts', e.target.value); }}>
          <option value="1">1 Platz</option>
          <option value="2">2 Plätze</option>
          <option value="3">3 Plätze</option>
          <option value="4">4 Plätze</option>
        </select>
        <button onClick={generateSchedule} style={{ marginLeft: '20px', padding: '6px 12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px' }}>Spielplan generieren 🚀</button>
      </div>

      <h2>Spieler ({players.length})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f5', textAlign: 'left' }}><th style={{ padding: '8px' }}>Name</th><th style={{ padding: '8px' }}>Status</th><th style={{ padding: '8px', textAlign: 'right' }}>Aktion</th></tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{p.name} ({2026-p.birth_year})</td>
              <td>{p.checked_in ? '🟢 Eingecheckt' : '🟡 Wartend'}</td>
              <td style={{ textAlign: 'right' }}>
                <button onClick={() => toggleCheckIn(p)} style={{ marginRight: '6px' }}>Status</button>
                <button onClick={() => deletePlayer(p.id)} style={{ color: 'red' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Ergebnisse eintragen ({matches.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {matches.map(m => (
          <div key={m.id} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>[{m.category}]</strong> {m.player1_name} VS {m.player2_name}</span>
              <span style={{ color: m.status === 'Beendet' ? 'green' : 'orange' }}>{m.status} {m.result && `(${m.result})`}</span>
            </div>
            {editingMatchId === m.id ? (
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="z.B. 6:4, 6:2" value={inputResult} onChange={e => setInputResult(e.target.value)} />
                <select value={inputWinner} onChange={e => setInputWinner(e.target.value)}>
                  <option value="">-- Sieger --</option>
                  <option value={m.player1_name}>{m.player1_name}</option>
                  <option value={m.player2_name}>{m.player2_name}</option>
                </select>
                <button onClick={() => saveResult(m.id)} style={{ backgroundColor: 'green', color: 'white' }}>Speichern</button>
                <button onClick={() => setEditingMatchId(null)}>X</button>
              </div>
            ) : (
              <button onClick={() => { setEditingMatchId(m.id); setInputResult(m.result || ''); setInputWinner(m.winner || ''); }} style={{ marginTop: '6px', fontSize: '12px' }}>Ergebnis eintragen</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
