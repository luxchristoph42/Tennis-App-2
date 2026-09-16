import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import AdminScheduleSettings from '../../components/AdminScheduleSettings';
import AdminPlayerTable from '../../components/AdminPlayerTable';
import AdminMatchList from '../../components/AdminMatchList';

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
  const [separateGender, setSeparateGender] = useState(true); // Standardmäßig auf true gesetzt

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
    const sg = localStorage.getItem('t_sep_gender');
    if (sg) {
      setSeparateGender(sg === 'true');
    } else {
      localStorage.setItem('t_sep_gender', 'true');
    }
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
    const cats = {};

    act.forEach(p => {
      // 1. Priorität: Hat der Admin den Spieler manuell zugewiesen?
      if (p.assigned_category) {
        const catKey = p.assigned_category;
        if (!cats[catKey]) cats[catKey] = [];
        cats[catKey].push(p);
        return;
      }

      // 2. Priorität: Automatische Berechnung anhand von Alter und Geschlecht
      const age = 2026 - p.birth_year;
      let ageCat = 'Open';
      if (age <= 12) ageCat = 'U12';
      else if (age <= 15) ageCat = 'U15';
      else if (age <= 18) ageCat = 'U18';

      let gen = (p.gender || 'm').toLowerCase();
      if (gen === 'd' || gen === 'divers') gen = 'w'; // Divers zu Weiblich sortieren
      
      // Nutze die Geschlechtertrennung basierend auf dem Admin-Häkchen
      const catKey = separateGender ? `${ageCat} ${gen.toUpperCase()}` : ageCat;

      if (!cats[catKey]) cats[catKey] = [];
      cats[catKey].push(p);
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

    const courtSchedules = {};
    for (let i = 1; i <= courts; i++) {
      courtSchedules[i] = { time: startT, matches: [] };
    }

    let matchCnt = 0;
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
    setResText('');
    setWinName('');
    loadData();
  };

  const startEdit = (m) => {
    setEditId(m.id);
    setResText(m.result || '');
    setWinName(m.winner || '');
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
      
      <AdminScheduleSettings 
        courts={courts} setCourts={setCourts}
        startT={startT} setStartT={setStartT}
        dur={dur} setDur={setDur}
        separateGender={separateGender} setSeparateGender={setSeparateGender}
        onGenerate={genSchedule}
      />

      <AdminPlayerTable 
        players={players} 
        onToggleCheck={toggleCheck} 
        onDelPlayer={delPlayer} 
        loadData={loadData}
      />

      <AdminMatchList 
        matches={matches}
        editId={editId}
        resText={resText} setResText={setResText}
        winName={winName} setWinName={setWinName}
        onStartEdit={startEdit}
        onSaveRes={saveRes}
        setEditId={setEditId}
      />
    </div>
  );
}
