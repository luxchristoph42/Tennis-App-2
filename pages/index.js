import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900">
            🎾 TennisTurnier
          </h1>

          <nav className="flex gap-3">
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            Turnierorganisation für Tennisvereine
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
            Tennisturniere
            <br />
            endlich einfach.
          </h1>

          <p className="mt-6 text-xl text-slate-600 leading-relaxed">
            Anmeldung, Check-In, Gruppenauslosung und
            automatische Spielpläne in einer modernen Anwendung.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-4 rounded-2/checkin"
              className="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transitionName="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-[32px] p-10 shadow-xl border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-blue-600">
                100%
              </div>
              <div className="text-slate-500 mt-2">
                Digital
              </div>
            </div>

            <div>
              <div className="text-4xl font-black text-blue-600">
                3-5
              </div>
              <div className="text-slate-500 mt-2">
                Spieler pro Gruppe
              </div>
            </div>

            <div>
              <div className="text-4xl font-black text-blue-600">
                1 Klick
              </div>
              <div className="text-slate-500 mt-2">
                Neuplanung
              </div>
            </div>

            <div>
              <div className="text-4xl font-black text-blue-600">
                ∞
              </div>
              <div className="text-slate-500 mt-2">
                Turniere
              </div>
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
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">📝</div>

            <h3 className="text-xl font-bold mb-2">
              Online Anmeldung
            </h3>

            <p className="text-slate-600">
              Spieler registrieren sich bequem online.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">⚡</div>

            <h3 className="text-xl font-bold mb-2">
              Automatische Gruppen
            </h3>

            <p className="text-slate-600">
              Optimale Gruppengrößen und faire Auslosungen.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <div className="text-4xl mb-4">🎾</div>

            <h3 className="text-xl font-bold mb-2">
              Sofortiger Spielplan
            </h3>

            <p className="text-slate-600">
              Plätze und Begegnungen werden automatisch erstellt.
            </p>
          </div>
        </div>
      </section>

      {/* So funktioniert's */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl p-10 border border-slate-100">
          <h2 className="text-3xl font-black mb-8">
            So funktioniert es
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-black text-blue-600 mb-2">
                1
              </div>
              <p>Anmeldung der Spieler</p>
            </div>

            <div>
              <div className="text-2xl font-black text-blue-600 mb-2">
                2
              </div>
              <p>Check-In am Turniertag</p>
            </div>

            <div>
              <div className="text-2xl font-black text-blue-600 mb-2">
                3
              </div>
              <p>Automatische Gruppeneinteilung</p>
            </div>

            <div>
              <div className="text-2xl font-black text-blue-600 mb-2">
                4
              </div>
              <p>Spielplan sofort verfügbar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schnellzugriff */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          /register
            <h3 className="font-bold text-lg mb-2">
              Anmeldung
            </h3>

            <p className="text-slate-600">
              Neue Spieler registrieren
            </p>
          </Link>

          /admin/checkin
            <h3 className="font-bold text-lg mb-2">
              Check-In
            </h3>

            <p className="text-slate-600">
              Anwesenheit verwalten
            </p>
          </Link>

          <Link
            href="/schedule"
            className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow className="text-slate-600">
              Aktuelle Spiele anzeigen
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-blue-600 text-white rounded-[32px] p-12 text-center">
          <h2 className="text-4xl font-black mb-4">
            Bereit für euren nächsten Turniertag?
          </h2>

          <p className="text-blue-100 mb-8">
            Weniger Excel. Weniger Chaos. Mehr Tennis.
          </p>

          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-    <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500">
          TennisTurnier • Digitale Turnierverwaltung für Vereine
        </div>
      </footer>
    </div>
  );
}
