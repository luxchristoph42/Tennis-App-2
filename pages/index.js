import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f5', fontFamily: 'sans-serif', color: '#18181b', margin: 0, padding: 0 }}>
      
      {/* Elegante Navigationsleiste */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e4e4e7', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'between', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎾</span> TennisTurnier
          </div>
          <nav style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/checkin" style={{ textDecoration: 'none', color: '#71717a', fontSize: '14px', fontWeight: '500', padding: '8px 12px', borderRadius: '6px' }}>
              Admin-Bereich
            </Link>
            <Link href="/register" style={{ textDecoration: 'none', backgroundColor: '#0070f3', color: 'white', fontSize: '14px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '6px' }}>
              Registrieren
            </Link>
          </nav>
        </div>
      </header>

      {/* Hauptbereich */}
      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        
        {/* Willkommens-Box */}
        <div style={{ textAlign: 'center', marginBottom: '48px', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: '800', trackingTight: '-0.05em', marginBottom: '16px', color: '#09090b' }}>
            Turniere einfach organisieren.
          </h1>
          <p style={{ fontSize: '18px', color: '#52525b', maxWidth: '600px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            Online-Anmeldung, automatischer Check-In und Echtzeit-Spielpläne für euren Tennisverein an einem zentralen Ort.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/register" style={{ textDecoration: 'none', backgroundColor: '#0070f3', color: 'white', padding: '14px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
              Jetzt Spieler anmelden
            </Link>
          </div>
        </div>

        {/* Kachel-Ansicht (Bento-Grid-Stil mit Inline-Kacheln statt einfachen Links) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          
          <Link href="/register" style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '24px', transition: 'transform 0.2s' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📝</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#09090b' }}>Spieler-Anmeldung</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#71717a', lineHeight: '1.5' }}>Ergänze neue Test-Teilnehmer und schicke sie direkt in die Supabase-Datenbank.</p>
          </Link>

          <Link href="/admin/checkin" style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🛡️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#09090b' }}>Admin Übersicht</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#71717a', lineHeight: '1.5' }}>Sieh live ein, wer sich eingetragen hat und verwalte die Anwesenheiten auf dem Platz.</p>
          </Link>

          <Link href="/schedule" style={{ textDecoration: 'none', color: 'inherit', backgroundColor: 'white', border: '1px solid #e4e4e7', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🎾</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#09090b' }}>Turnier-Spielplan</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#71717a', lineHeight: '1.5' }}>Generiere Begegnungen und sieh die Live-Ergebnisse der Gruppenphasen ein.</p>
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
