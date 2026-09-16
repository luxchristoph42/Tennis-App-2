import { supabase } from '../lib/supabase'; // Passe den Pfad an, falls nötig

export default function AdminPlayerTable({ players, onToggleCheck, onDelPlayer, loadData }) {
  
  // Hilfsfunktion zur Ermittlung der Kategorie (berücksichtigt manuelle Überschreibung)
  const getPlayerCategory = (p) => {
    // Falls der Admin manuell eine Kategorie gesetzt hat, nutzen wir diese
    if (p.assigned_category) return p.assigned_category;

    // Standard automatische Berechnung anhand des Geburtsjahres
    const age = 2026 - p.birth_year;
    let ageCat = 'Open';
    if (age <= 12) ageCat = 'U12';
    else if (age <= 15) ageCat = 'U15';
    else if (age <= 18) ageCat = 'U18';

    let gen = (p.gender || 'm').toLowerCase();
    if (gen === 'd' || gen === 'divers') gen = 'w'; // Divers wird zu Weiblich sortiert

    return `${ageCat} ${gen.toUpperCase()}`;
  };

  // Funktion zum manuellen Ändern der Kategorie in der Datenbank
  const handleCategoryChange = async (player, newCat) => {
    const val = newCat === 'auto' ? null : newCat;
    const { error } = await supabase
      .from('players')
      .update({ assigned_category: val })
      .eq('id', player.id);

    if (error) {
      alert('Fehler beim Umsortieren: ' + error.message);
    } else {
      loadData(); // Lädt die Daten im Hauptfenster neu
    }
  };

  // 1. Gruppierung der Spieler nach ihren Kategorien vornehmen
  const groupedPlayers = {};
  players.forEach(p => {
    const cat = getPlayerCategory(p);
    if (!groupedPlayers[cat]) groupedPlayers[cat] = [];
    groupedPlayers[cat].push(p);
  });

  // Sortierung der Gruppen-Überschriften (U12 zuerst, dann U15...)
  const sortedCategories = Object.keys(groupedPlayers).sort();

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>Spieler-Verwaltung ({players.length} Anmeldungen)</h2>

      {players.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>Noch keine Spieler angemeldet.</p>
      ) : (
        sortedCategories.map(catName => (
          <div key={catName} style={{ marginBottom: '24px', border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            
            {/* Gruppen-Header */}
            <div style={{ backgroundColor: '#f4f4f5', padding: '10px 16px', fontWeight: 'bold', fontSize: '1.1em', borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between' }}>
              <span>Kategorie: {catName}</span>
              <span style={{ fontSize: '0.9em', color: '#666' }}>({groupedPlayers[catName].length} Spieler)</span>
            </div>

            {/* Tabelle für diese spezifische Gruppe */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa', textAlign: 'left', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '10px 16px' }}>Name</th>
                  <th style={{ padding: '10px 16px' }}>Klasse ändern</th>
                  <th style={{ padding: '10px 16px' }}>Status</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right' }}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {groupedPlayers[catName].map(p => {
                  const currentAge = 2026 - p.birth_year;
                  return (
                    <tr 
                      key={p.id} 
                      style={{ 
                        borderBottom: '1px solid #eee', 
                        backgroundColor: p.checked_in ? '#f0fdf4' : 'transparent', // Dezenter grüner Hintergrund bei Check-In
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <td style={{ padding: '10px 16px' }}>
                        <strong>{p.name}</strong> <span style={{ color: '#666', fontSize: '0.9em' }}>({currentAge} Jahre, ehemals {p.gender?.toUpperCase()})</span>
                      </td>
                      
                      {/* Manuelle Umsortierung via Dropdown */}
                      <td style={{ padding: '10px 16px' }}>
                        <select 
                          value={p.assigned_category || 'auto'} 
                          onChange={(e) => handleCategoryChange(p, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                        >
                          <option value="auto">Automatisch ({2026 - p.birth_year <= 12 ? 'U12' : 2026 - p.birth_year <= 15 ? 'U15' : 2026 - p.birth_year <= 18 ? 'U18' : 'Open'})</option>
                          <option value="U12 M">U12 Männlich</option>
                          <option value="U12 W">U12 Weiblich</option>
                          <option value="U15 M">U15 Männlich</option>
                          <option value="U15 W">U15 Weiblich</option>
                          <option value="U18 M">U18 Männlich</option>
                          <option value="U18 W">U18 Weiblich</option>
                          <option value="Open M">Open Männlich</option>
                          <option value="Open W">Open Weiblich</option>
                        </select>
                      </td>

                      <td style={{ padding: '10px 16px' }}>
                        {p.checked_in ? (
                          <span style={{ color: '#166534', fontWeight: 'bold' }}>🟢 Bestätigt</span>
                        ) : (
                          <span style={{ color: '#854d0e' }}>🟡 Wartend</span>
                        )}
                      </td>

                      <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                        <button 
                          onClick={() => onToggleCheck(p)} 
                          style={{ 
                            marginRight: '8px', 
                            padding: '6px 12px', 
                            backgroundColor: p.checked_in ? '#e4e4e7' : '#0284c7', 
                            color: p.checked_in ? '#000' : '#fff',
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Check-In
                        </button>
                        <button 
                          onClick={() => onDelPlayer(p.id)} 
                          style={{ color: '#dc2626', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2em', verticalAlign: 'middle' }}
                          title="Spieler löschen"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

          </div>
        ))
      )}
    </div>
  );
}
