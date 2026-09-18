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
  const [endT, setEndT] = useState('16:00');
  const [dur, setDur] = useState(20);
  const [separateGender, setSeparateGender] = useState(true);
  const [tournamentMode, setTournamentMode] = useState('time');
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
    const te = localStorage.getItem('t_end_time');
    if (te) setEndT(te);
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
    const { finalM, error } = buildTournamentSchedule(players, courts, startT, endT, dur, separateGender);
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

  const responsiveStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      .admin-container { padding: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 900px; margin: 0 auto; color: #1c1c1e; background-color: #fafafa; min-height: 100vh; }
      .nav-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; font-size: 14px; }
      .back-link { color: #8e8e93; text-decoration: none; transition: color 0.2s; font-weight: 500; }
      .back-link:hover { color: #1c1c1e; }
      .logout-btn { padding: 8px 16px; cursor: pointer; background: #fff; border: 1px solid #e5e5ea; border-radius: 20px; font-size: 13px; font-weight: 500; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
      .logout-btn:hover { background: #f2f2f7; border-color: #d1d1d6; }
      .main-title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 24px; color: #1c1c1e; }
      .tabs-container { display: flex; background: #eee; padding: 4px; border-radius: 12px; margin-bottom: 28px; gap: 4px; }
      .tab-trigger { flex: 1; padding: 12px 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; background: transparent; border-radius: 9px; color: #666; transition: all 0.2s; text-align: center; }
      .tab-active { background: #fff; color: #000; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
      .login-card { padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 360px; margin: 120px auto; text-align: center; background: #fff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #efeff4; }
      .login-title { font-size: 20px; font-weight: 600; margin-bottom: 20px; letter-spacing: -0.3px; }
      .login-input { padding: 14px; width: 100%; box-sizing: border-box; margin-bottom: 14px; border: 1px solid #e5e5ea; border-radius: 10px; font-size: 16px; background: #fafafa; transition: all 0.2s; outline: none; }
      .login-input:focus { border-color: #000; background: #fff; }
      .login-submit { width: 100%; padding: 14px; background-color: #000; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; }
      .login-submit:hover { opacity: 0.85; }
      @media (min-width: 640px) {
        .admin-container { padding: 32px; }
        .main-title { font-size: 34px; }
        .tab-trigger { font-size: 14px; padding: 12px 20px; }
        .tabs-container { display: inline-flex; width: auto; min-width: 400px; }
      }
    `}} />
  );

  if (!isAuth) {
    return (
      <>
        {responsiveStyles}
        <div className="login-card">
          <h2 className="login-title">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Passwort" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="login-input"
            />
            <button type="submit" className="login-submit">Einloggen</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      {responsiveStyles}
      <div className="admin-container">
        <div className="nav-header">
          <Link href="/" className="back-link">← Zurück zur Startseite</Link>
          <button onClick={handleLogout} className="logout-btn">Abmelden</button>
        </div>
        
        <h1 className="main-title">Admin Control Panel</h1>
        
        <div className="tabs-container">
          <button 
            onClick={() => setActiveTab('setup')} 
            className={`tab-trigger ${activeTab === 'setup' ? 'tab-active' : ''}`}
          >
            Setup und Spieler
          </button>
          <button 
            onClick={() => setActiveTab('live')} 
            className={`tab-trigger ${activeTab === 'live' ? 'tab-active' : ''}`}
          >
            Live-Matches
          </button>
        </div>

        {activeTab === 'setup' ? (
          <div>
            <AdminScheduleSettings courts={courts} setCourts={setCourts} startT={startT} setStartT={startT} endT={endT} setEndT={setEndT} dur={dur} setDur={setDur} separateGender={separateGender} setSeparateGender={setSeparateGender} tournamentMode={tournamentMode} setTournamentMode={setTournamentMode} onGenerate={genSchedule} />
            <AdminPlayerTable players={players} onToggleCheck={toggleCheck} onDelPlayer={delPlayer} loadData={loadData} />
          </div>
        ) : (
          <AdminMatchList matches={matches} editId={editId} resText={resText} setResText={setResText} winName={winName} setWinName={setWinName} onStartEdit={startEdit} onSaveRes={saveRes} setEditId={setEditId} />
        )}
      </div>
    </>
  );
}
