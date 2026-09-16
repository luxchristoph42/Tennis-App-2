import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCheckin() {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [courts, setCourts] = useState(2);
  const [editId, setEditId] = useState(null);
  const [resText, setResText] = useState('');
  const [winName, setWinName] = useState('');
  const [startT, setStartT] = useState('10:00');
  const [dur, setDur] = useState(20);

  const ADMIN_PASSWORD = "tennis2026";

  const loadData = async () => {
    const { data: p } = await supabase.from('players').select('*').order('name');
    setPlayers(p || []);
    const { data: m } = await supabase.from('matches').select('*').order('id');
    setMatches(m || []);
  };

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuth(true);
      loadData();
    }
    const c = localStorage.getItem('t_courts');
    if (c) setCourts(parseInt(c));
  }, [isAuth]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Falsches Passwort!');
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem('admin_auth');
  };

  const toggleCheck = async (p) => {
    await supabase.from('players').update({ checked_in: !p.checked_in }).eq('id', p.id);
    loadData();
  };

  const delPlayer = async (id) => {
    if (confirm('Löschen?')) {
      await supabase.from('players').delete().eq('id', id);
      loadData();
    }
  };

  const addMins = (t, m) => {
    const [h, mn] = t.split(':').map(Number);
    const tot = h * 60 + mn + m;
    return `${String(Math.floor(tot / 60) % 24).padStart(2, '0')}:${String(tot % 60).padStart(2, '0')}`;
  };

  const genSchedule = async () => {
    const act = players.filter(p => p.checked_in);
    if (act.length < 2) return alert('Mindestens 2 eingecheckte Spieler!');
    if (!confirm('Spielplan neu erstellen?')) return;

    await supabase.from('matches').delete().neq('id', '0');
    const cats = { U12: [], U15: [], U18: [], Open: [] };
    act.forEach(p => {
      const age = 2026 - p.birth_year;
      if (age <= 12) cats.U12.push(p);
      else if (age <= 15) cats.U15.push(p);
      else if (age <= 18) cats.U18.push(p);
      else cats.Open.push(p);
    });

    const getDist = (cnt) => {
      if (cnt < 3) return { g3: 0, g4: 0, g5: 0 };
      if (cnt === 4) return { g3: 0, g4: 1, g5: 0 };
      if (cnt === 5) return { g3: 0, g4: 0, g5: 1 };
      const r = cnt % 3;
      if (r === 0) return { g3: cnt / 3, g4: 0, g5: 0 };
      if (r === 1) return { g3: Math.floor((cnt - 4) / 3), g4: 1, g5: 0 };
      return { g3: Math.floor((cnt - 8) / 3), g4: 2, g5: 0 };
    };

    const list = [];
    let matchCnt = 0;
    const courtSchedules = {};
    for (let i = 1; i <= courts; i++) {
      courtSchedules[i] = { time: startT, matches: [] };
    }

    Object.keys(cats).forEach(c => {
      const arr = cats[c];
      if (arr.length < 2) return;
      const d = getDist(arr.length);
      let idx = 0, gLet = 0;

      const addPool = (sz) => {
        const pPlayers = arr.slice(idx, idx + sz);
        const cCourt = (matchCnt % courts) + 1;
        const sched = courtSchedules[cCourt];

        for (let i = 0; i < pPlayers.length; i++) {
          for (let j = i + 1; j < pPlayers.length; j++) {
            sched.matches.push({
              category: `${c} - Gr. ${String.fromCharCode(65 + gLet)}`,
              player1_name: pPlayers[i].name,
              player2_name: pPlayers[j].name,
              court: `Platz ${cCourt} (${sched.time} Uhr)`,
              status: 'Ausstehend'
            });
            sched.time = addMins(sched.time, parseInt(dur));
          }
        }
        idx += sz;
        gLet++;
        matchCnt++;
      };

      for (let i = 0; i < d.g5; i++) addPool(5);
      for (let i = 0; i < d.g4; i++) addPool(4);
      for (let i = 0; i < d.g3; i++) addPool(3);
      if (arr.length === 2) addPool(2);
    });

    const finalM = [];
    Object.keys(courtSchedules).forEach(c => finalM.push(...courtSchedules[c].matches));
    if (finalM.length > 0) await supabase.from('matches').insert(finalM);
    loadData();
  };

  const saveRes = async (id) => {
    if (!winName) return alert('Sieger wählen!');
    await supabase.from('matches').update({ result: resText, winner: winName, status: 'Beendet' }).eq('id', id);
    setEditId(null);
    loadData();
  };

  if (!isAuth) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '300px', margin: '100px auto', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🔒 Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '8px', width: '100%', marginBottom: '10px' }} />
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
      
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label>Plätze: </label>
        <select value={courts} onChange={e => { setCourts(parseInt(e.target.value)); localStorage.setItem('t_courts', e.target.value); }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Plätze</option>)}
        </select>
        <label>Start: </label>
        <input type="time" value={startT} onChange={e => setStartT(e.target.value)} />
        <label>Dauer: </label>
        <select value={dur} onChange={e => setDur(parseInt(e.target.value))}>
          <option value="15">15 Min</option>
          <option value="20">20 Min</option>
          <option value="30">30 Min</option>
          <option value="40">40 Min</option>
        </select>
        <button onClick={genSchedule} style={{ padding: '6px 12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Generieren 🚀</button>
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
                <button onClick={() => toggleCheck(p)} style={{ marginRight: '6px' }}>Status</button>
                <button onClick={() => delPlayer(p.id)} style={{ color: 'red', border: 'none', background: 'none' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Ergebnisse ({matches.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {matches.map(m => (
          <div key={m.id} style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span><strong>[{m.category}]</strong> {m.player1_name} VS {m.player2_name}</span>
              <span style={{ color: m.status === 'Beendet' ? 'green' : 'orange' }}>{m.status} {m.result && `(${m.result})`}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>📍 {m.court}</div>
            {editId === m.id ? (
              <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="z.B. 6:4, 6:2" value={resText} onChange={e => setResText(e.target.value)} />
                <select value={winName} onChange={e => setWinName(e.target.value)}>
                  <option value="">-- Sieger --</option>
                  <option value={m.player1_name}>{m.player1_name}</option>
                  <option value={m.player2_name}>{m.player2_name}</option>
                </select>
                <button onClick={() => saveRes(m.id)} style={{ backgroundColor: 'green', color: 'white' }}>OK</button>
                <button onClick={() => setEditId(null)}>X</button>
              </div>
            ) : (
              <button onClick={() => { setEditId(m.id); setResText(m.result || ''); setWinName(m.winner || ''); }} style={{ marginTop: '6px', fontSize: '12px' }}>Ergebnis eintragen</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
