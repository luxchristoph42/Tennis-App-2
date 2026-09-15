import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900">
            🎾 TennisTurnier
          </h1>

          <nav className="flex gap-3">
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              Registrieren
            </Link>
            <Link
              href="/admin/checkin"
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              Admin Check-In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            Moderne Turnierverwaltung für Tennisvereine
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
            Tennisturniere
            <br />
            einfach organisieren.
          </h1>

          <p className="mt-6 text-xl text-slate-600 leading-relaxed">
            Anmeldung, Check-In, automatische Gruppeneinteilung
            und Spielpläne in einer einzigen Anwendung.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition"
            >
              Jetzt registrieren
            </Link>
            <Link
              href="/admin/checkin"
              className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition"
            >
              Zum Check-In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-blue-600">
                100%
              </div>
              <p className="mt-2 text-slate-500">Digital</p>
            </div>

            <div>
              <div className="text-4xl font-black text-blue-600">
                3-5
              </div>
              <p className="mt-2 text-slate-500">
                Spieler pro Gruppe
              </p>
            </div>

            <div>
              <div className="text-4xl font-black text-blue-600">
                1 Klick
              </div>
              <p className="mt-2 text-slate-500">Neuplanung</p>
            </div>

            <div>
              <div className="text-4xl font-black text-blue-600">
                ∞
              </div>
              <p className="mt-2 text-slate-500">Turniere</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-black text-center mb-12">
          Alles für euren Turniertag
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="text-4xl mb-4">📝</div>

            <h3 className="font-bold text-xl mb-3">
              Anmeldung
            </h3>

            <p className="text-slate-600">
              Spieler können sich bequem online
              registrieren.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="text-4xl mb-4">⚡</div>

            <h3 className="font-bold text-xl mb-3">
              Automatische Gruppen
            </h3>

            <p className="text-slate-600">
              Optimierte Gruppeneinteilung mit wenigen
              Klicks.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="text-4xl mb-4">🎾</div>

            <h3 className="font-bold text-xl mb-3">
              Spielpläne
            </h3>

            <p className="text-slate-600">
              Begegnungen und Plätze werden automatisch
              erstellt.
            </p>
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl border border-slate-100 p-10">
          <h2 className="text-3xl font-black mb-10">
            So funktioniert es
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-blue-600 text-3xl font-black mb-3">
                1
              </div>
              <p>Online anmelden</p>
            </div>

            <div>
              <div className="text-blue-600 text-3xl font-black mb-3">
                2
              </div>
              <p>Am Turniertag einchecken</p>
            </div>

            <div>
              <div className="text-blue-600 text-3xl font-black mb-3">
                3
              </div>
              <p>Gruppen automatisch erzeugen</p>
            </div>

            <div>
              <div className="text-blue-600 text-3xl font-black mb-3">
                4
              </div>
              <p>Spielplan sofort nutzen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schnellzugriff */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/register"
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition block"
          >
            <h3 className="font-bold text-xl mb-2">Registrierung</h3>
            <p className="text-slate-600">
              Neue Spieler registrieren
            </p>
          </Link>

          <Link
            href="/admin/checkin"
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition block"
          >
            <h3 className="font-bold text-xl mb-2">Check-In</h3>
            <p className="text-slate-600">
              Anwesenheiten verwalten
            </p>
          </Link>

          <Link
            href="/schedule"
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition block"
          >
            <h3 className="font-bold text-xl mb-2">Spielplan</h3>
            <p className="text-slate-600">
              Aktuelle Begegnungen anzeigen
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-blue-600 rounded-[32px] p-12 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Bereit für den nächsten Turniertag?
          </h2>

          <p className="text-blue-100 mb-8 text-lg">
            Weniger Excel. Weniger Chaos. Mehr Tennis.
          </p>

          <Link
            href="/register"
            className="inline-flex bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition"
          >
            Jetzt loslegen
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500">
          TennisTurnier • Digitale Turnierverwaltung für Vereine
        </div>
      </footer>
    </div>
  );
}
