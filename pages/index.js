import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-blue-500/30">
      {/* Subtiler Luma-Glow-Effekt im Hintergrund */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#09090b]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎾</span>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              TennisTurnier
            </span>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/admin/checkin"
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 rounded-xl hover:bg-zinc-900 transition-all duration-200"
            >
              Admin Check-In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl shadow-sm transition-all duration-200"
            >
              Registrieren
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs font-medium text-zinc-400 mb-6 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          Moderne Turnierverwaltung für Vereine
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 max-w-3xl leading-[1.15] bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Tennisturniere einfach organisieren.
        </h1>

        <p className="mt-6 text-lg text-zinc-400 max-w-xl font-normal leading-relaxed">
          Anmeldung, Check-In, automatische Gruppeneinteilung und Live-Spielpläne in einer flüssigen Web-App.
        </p>

        <div className="flex sm:flex-row flex-col gap-3 mt-10 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-8 py-4 rounded-2xl font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 shadow-lg shadow-zinc-950/20 text-center transition-all duration-200"
          >
            Turnier erstellen
          </Link>
          <Link
            href="/schedule"
            className="px-8 py-4 rounded-2xl font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/70 hover:border-zinc-700 text-center transition-all duration-200"
          >
            Spielpläne ansehen
          </Link>
        </div>
      </section>

      {/* Bento Grid (Schnellzugriff & Features kombiniert) */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Große Kachel: Anmeldung (Link) */}
          <Link 
            href="/register" 
            className="group relative md:col-span-2 overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-300" />
            <div className="text-3xl bg-zinc-800/50 w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-700/50">📝</div>
            <div>
              <h3 className="font-bold text-xl text-zinc-100 mb-2 flex items-center gap-2">
                Spieler-Registrierung
                <span className="text-zinc-500 group-hover:translate-x-1 transition-transform text-sm">→</span>
              </h3>
              <p className="text-zinc-400 text-sm max-w-md">
                Erstelle ein neues Turnier. Spieler können sich bequem über einen geteilten Link online anmelden.
              </p>
            </div>
          </Link>

          {/* Kleine Kachel: Stats */}
          <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-8 flex flex-col justify-between min-h-[240px]">
            <div className="text-3xl bg-zinc-800/50 w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-700/50">⚡</div>
            <div>
              <div className="text-3xl font-black text-zinc-100 tracking-tight">1 Klick</div>
              <p className="text-zinc-400 text-sm mt-1">Automatische Gruppeneinteilung (3-5 Spieler).</p>
            </div>
          </div>

          {/* Kleine Kachel: Admin Check-In (Link) */}
          <Link 
            href="/admin/checkin" 
            className="group relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
          >
            <div className="text-3xl bg-zinc-800/50 w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-700/50">🛡️</div>
            <div>
              <h3 className="font-bold text-xl text-zinc-100 mb-2 flex items-center gap-2">
                Admin Check-In
                <span className="text-zinc-500 group-hover:translate-x-1 transition-transform text-sm">→</span>
              </h3>
              <p className="text-zinc-400 text-sm">
                Anwesenheiten am Turniertag live verwalten und verifizieren.
              </p>
            </div>
          </Link>

          {/* Große Kachel: Spielpläne (Link) */}
          <Link 
            href="/schedule" 
            className="group relative md:col-span-2 overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between min-h-[240px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-300" />
            <div className="text-3xl bg-zinc-800/50 w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-700/50">🎾</div>
            <div>
              <h3 className="font-bold text-xl text-zinc-100 mb-2 flex items-center gap-2">
                Live-Spielpläne
                <span className="text-zinc-500 group-hover:translate-x-1 transition-transform text-sm">→</span>
              </h3>
              <p className="text-zinc-400 text-sm max-w-md">
                Begegnungen, freie Plätze und Ergebnisse in Echtzeit für alle Teilnehmer einsehbar.
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* So funktioniert es (Ablauf als edle Zeile) */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/20 p-8 md:p-10 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-zinc-200 mb-8 tracking-tight">In 4 Schritten auf dem Platz</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "01", text: "Online anmelden" },
              { num: "02", text: "Am Turniertag einchecken" },
              { num: "03", text: "Gruppen erzeugen" },
              { num: "04", text: "Spielplan live nutzen" }
            ].map((step, idx) => (
              <div key={idx} className="border-l border-zinc-800 pl-4">
                <div className="text-xs font-mono text-zinc-500 mb-1">{step.num}</div>
                <p className="text-sm font-medium text-zinc-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalistischer Footer */}
      <footer className="border-t border-zinc-900 bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>&copy; {new Date().getFullYear()} TennisTurnier. Alle Rechte vorbehalten.</div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 cursor-pointer">Impressum</span>
            <span className="hover:text-zinc-300 cursor-pointer">Datenschutz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
