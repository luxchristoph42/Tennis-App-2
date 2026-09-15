import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function AdminCheckin() {
  // Passwort-Schutz Zustände
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Turnier-Daten Zustände
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [courts, setCourts] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ergebniseingabe
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [inputResult, setInputResult] = useState('');
  const [inputWinner, setInputWinner] = useState('');

  // DAS ADMIN-PASSWORT
  const ADMIN_PASSWORD = "tennis2026";

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: pData, error: pError } = await supabase.from('players').select('*').order('name');
      if (pError) throw pError;
      setPlayers(pData || []);

      const { data: mData, error: mError } = await supabase.from('matches').select('*').order('id');
      if (!mError && mData) setMatches(mData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Prüfen, ob der Admin auf diesem Gerät bereits eingeloggt war
    const authStatus = localStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
    const savedCourts = localStorage.getItem('tennis_courts');
    if (savedCourts) setCourts(parseInt(savedCourts));
  }, [isAuthenticated]);

  // Login verarbeiten
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(false);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      setLoginError(true);
    }
  };

  // Logout Funktion
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
  };

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

  const generateAndSaveSchedule = async () => {
    const checkedIn = players.filter(p => p.checked_in);
    if (checkedIn.length < 2) {
      alert('Mindestens 2 eingecheckte Spieler benötigt!');
      return;
    }
    if (!confirm('Achtung: Dadurch wird der alte Spielplan gelöscht!')) return;

    try {
      setLoading(true);
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
        alert('Spielplan erfolgreich generiert!');
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

  const saveResult = async (matchId) => {
    if (!inputWinner) {
      alert('Bitte wähle den Gewinner aus!');
      return;
    }
    try {
      await supabase.from('matches').update({ result: inputResult, winner: inputWinner, status: 'Beendet' }).eq('id', matchId);
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

  // ANSICHT A: Passwort-Formular anzeigen, wenn nicht eingeloggt
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '360px', width: '100%', backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e4e4e7', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>Veranstalter Login</h1>
          <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '24px' }}>Dieser Bereich ist geschützt. Bitte gib das Turnier-Passwort ein.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="password" 
              placeholder="Passwort eingeben" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: loginError ? '1px solid #ef4444' : '1px solid #ccc', borderRadius: '6px', fontSize: '14px', textAlign: 'center' }}
            />
            {loginError && <p style={{ color: '#dc2626', fontSize: '12px', margin: '0', fontWeight: '500' }}>Falsches Passwort!</p>}
            <button type="submit" style={{ width: '100%', backgroundColor: '#0070f3', color: 'white', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '4px' }}>
              Freischalten
            </button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '13px' }}>
            <Link href="/">← Zurück zur Startseite</Link>
          </div>
        </div>
      </div>
    );
  }

  // ANSICHT B: Das eigentliche Admin Control Panel
  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/">← Zurück zur Startseite</Link>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleLogout} style={{ padding: '8px 14px', backgroundColor: '#e4e4e7', color: '#18181b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Abmelden 🔓
          </button>
          <button onClick={resetAll} style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            💥 Turnier zurücksetzen (0)
          </button>
        </div>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#09090b' }}>Admin Control Panel 🛠️</h1>
      <p style={{ color: '#71717a', fontSize: '14px', marginTop: '-4px', marginBottom: '24px' }}>Rolle: Turnierleitung / Turnierausrichter</p>

      {/* Plätze & Generieren */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '4px', fontWeight: '500' }}>Plätze auf der Anlage:</label>
          <select value={courts} onChange={handleCourtChange} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Plätze</option>)}
          </select>
        </div>
        <button onClick={generateAndSaveSchedule} style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '18px' }}>
          Spiele generieren & online veröffentlichen 🚀
        </button>
      </div>

      {/* Spieler-Tabelle */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Gemeldete Spieler ({players.length})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f5', textAlign: 'left' }}><th style={{ padding: '10px' }}>Name</th><th style={{ padding: '10px' }}>Anwesenheit</th><th style={{ padding: '10px', textAlign: 'right' }}>Aktionen</th></tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
