import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import AdminScheduleSettings from '../../components/AdminScheduleSettings';
import AdminPlayerTable from '../../components/AdminPlayerTable';
import AdminMatchList from '../../components/AdminMatchList';
import { buildTournamentSchedule, checkAndAdvanceGroup, checkAndAdvanceKO } from '../../lib/tournamentLogic';

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
  const [separateGender, setSeparateGender] = useState(true);
  const [tournamentMode, setTournamentMode] = useState('time'); // Neu: 'time' oder 'sets'
  const [activeTab, setActiveTab] = useState('setup');

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
    if (sg) setSeparateGender(sg === 'true');
    const tm = localStorage.getItem('t_mode');
    if (tm) setTournamentMode(tm);
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

  const genSchedule = async () => {
    const { finalM, error } = buildTournamentSchedule(players, courts, startT, dur, separateGender);
    if (error) return alert(error);
    if (!confirm('Spielplan neu erstellen?')) return;

    await supabase.from('matches').delete().neq('id', '0');
    if (finalM && finalM.length > 0) await supabase.from('matches').insert(finalM);
    setActiveTab('live');
    loadData();
  };

  const saveRes = async (id) => {
    if (!winName) return alert('Sieger wählen!');
    const currentMatch = matches.find(m => m.id === id);
    if (!currentMatch) return;

    await supabase.from('matches').update({ result: resText, winner: winName, status: 'Beendet' }).eq('id', id);
    
    if (currentMatch.category.includes(' - Gr. ')) {
      const [categoryName, groupPart] = currentMatch.category.split(' - Gr. ');
      const groupLetter = groupPart ? groupPart.trim() : null;
      if (categoryName && groupLetter) {
        await checkAndAdvanceGroup(supabase, categoryName, groupLetter, tournamentMode);
      }
    } else if (currentMatch.category.includes(' - Halbfinale')) {
      const [categoryName] = currentMatch.category.split(' - Halbfinale');
      if (categoryName) await checkAndAdvanceKO(supabase, categoryName.trim(), currentMatch.category);
    }

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
        <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>Abmelden 🔓</button>
      </div>
      
      <h1>Admin Control Panel 🛠️</h1>
      
      <div style={{ display: 'flex', borderBottom: '2px solid #e4e4e7', marginBottom: '24px', gap: '8px' }}>
        <button onClick={() => setActiveTab('setup')} style={{ padding: '10px 20px', fontSize: '1em', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: 'none', borderBottom: activeTab === 'setup' ? '3px solid #0070f3' : '3px solid transparent', color: activeTab === 'setup' ? '#0070f3' : '#71717a' }}>⚙️ Spieler- & Turnierverwaltung</button>
        <button onClick={() => setActiveTab('live')} style={{ padding: '10px 20px', fontSize: '1em', fontWeight: 'bold', cursor: 'pointer', border: 'none', background: 'none', borderBottom: activeTab === 'live' ? '3px solid #0070f3' : '3px solid transparent', color: activeTab === 'live' ? '#0070f3' : '#71717a' }}>🏆 Live-Spiele & Ergebnisse</button>
      </div>

      {activeTab === 'setup' ? (
        <div>
          <AdminScheduleSettings courts={courts} setCourts={setCourts} startT={startT} setStartT={setStartT} dur={dur} setDur={setDur} separateGender={separateGender} setSeparateGender={setSeparateGender} tournamentMode={tournamentMode} setTournamentMode={setTournamentMode} onGenerate={genSchedule} />
          <AdminPlayerTable players={players} onToggleCheck={toggleCheck} onDelPlayer={delPlayer} loadData={loadData} />
        </div>
      ) : (
        <AdminMatchList matches={matches} editId={editId} resText={resText} setResText={setResText} winName={winName} setWinName={setWinName} onStartEdit={startEdit} onSaveRes={saveRes} setEditId={setEditId} />
      )}
    </div>
  );
}
