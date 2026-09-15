import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'sans-serif', color: '#18181b', margin: 0, padding: 0 }}>
      
      {/* Elegante Navigationsleiste */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e4e4e7', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎾</span> TennisTurnier
          </div>
          <nav style={{ display: 'flex', gap: '12px' }}>
            <Link href="/schedule" style={{ textDecoration: 'none', color: '#18181b', fontSize: '14px', fontWeight: '600' }}>
              Live-Spielplan
            </Link>
            <Link href="/admin/checkin" style={{ textDecoration: 'none', color: '#71717a', fontSize: '14px', fontWeight: '500' }}>
              Turnierleitung 🔒
            </Link>
          </nav>
        </div>
      </header>

      {/* Hauptbereich */}
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        
        {/* Willkommens-Box */}
        <div style={{ textAlign: 'center', marginBottom: '48px', padding: '20px 20px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#09090b' }}>
            Euer Turniertag digital organisiert.
          </h1>
          <p style={{ fontSize: '18px', color: '#52525b', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Spieler melden sich an, die Turnierleitung teilt die Plätze ein, und alle Sportler sehen Ergebnisse und Ranglisten live auf dem Smartphone.
          </p>
        </div>

        {/* BEREICH 1: FÜR SPORTLER & TEILNEHMER */}
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '14px', color: '#0070f3' }}>Für Turnierteilnehmer & Zuschauer 👥</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          
          <Link href="/register" style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📝</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Spieler-Anmeldung</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#71717a', lineHeight: '1.5' }}>Melde dich online für das anstehende Jugendturnier an, um auf die Meldeliste zu gelangen.</p>
          </Link>

          <Link href="/schedule" style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Live-Spielplan & Rangliste</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#71717a', lineHeight: '1.5' }}>Sieh nach, wann und auf welchem Platz du spielst, und verfolge die Tabellen live.</p>
          </Link>
        </div>

        {/* BEREICH 2: FÜR DIE TURNIERLEITUNG */}
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '14px', color: '#b91c1c' }}>Für die Turnierleitung / Organisatoren ⚙️</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          
          <Link href="/admin/checkin" style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Admin Control Panel</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#71717a', lineHeight: '1.5' }}>Geschützter Login für Ausrichter. Anwesenheiten prüfen, Plätze vergeben und Ergebnisse eintragen.</p>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e4e4e7', backgroundColor: 'white', padding: '24px', textAlign: 'center', fontSize: '14px', color: '#a1a1aa' }}>
        TennisTurnier &copy; {new Date().getFullYear()} • Digitale Vereinsverwaltung
      </footer>
    </div>
  );
}
