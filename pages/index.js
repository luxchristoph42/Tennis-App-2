import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">
          🎾 TennisTurnier
        </h1>

        <nav className="flex gap-3">
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl border border-slate-200      className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transitionl mx-auto px-6">
        <section className="pt-20 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium mb-6">
              Turnierorganisation für Tennisvereine
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
              Tennisturniere
              <br />
              einfach planen.
            </h1>

            <p className="mt-8 text-xl text-slate-600 leading-relaxed">
              Spieler anmelden, Check-In durchführen,
              Gruppen automatisch erzeugen und Spielpläne
              in Sekunden berechnen lassen.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-me="bg-white border border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transitionn className="pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">📝</div>

              <h3 className="text-xl font-bold mb-3">
                Einfache Anmeldung
              </h3>

              <p className="text-slate-600">
                Spieler registrieren sich online inklusive
                Altersklasse und Vereinsdaten.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">⚡</div>

              <h3 className="text-xl font-bold mb-3">
                Automatische Turnierplanung
              </h3>

              <p className="text-slate-600">
                Optimierte Gruppen und automatische
                Spielpläne auf Knopfdruck.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="text-4xl mb-4">🎾</div>

              <h3 className="text-xl font-bold mb-3">
                Turniertag ohne Stress
              </h3>

              <p className="text-slate-600">
                Kurzfristige Ausfälle und neue
                Gruppeneinteilungen in Sekunden.
              </p>
            </div>
          </div>
        </section>

        {/* Statistik */}
        <section className="pb-24">
          <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 p-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-blue-600">
                  100%
                </div>
                <p className="mt-2 text-slate-600">
                  Digital
                </p>
              </div>

              <div>
                <div className="text-4xl font-black text-blue-600">
                  3-5
                </div>
                <p className="mt-2 text-slate-600">
                  Spieler pro Gruppe
                </p>
              </div>

              <div>
                <div className="text-4xl font-black text-blue-600">
                  1 Klick
                </div>
                <p className="mt-2 text-slate-600">
                  Neuplanung
                </p>
              </div>

              <div>
                <div className="text-4xl font-black text-blue-600">
                  ∞
                </div>
                <p className="mt-2 text-slate-600">
                  Turniere
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schnellzugriff */}
        <section className="pb-24">
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/register"
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg="text-slate-600">
                Neue Spieler anmelden
              </p>
            </Link>

            <Link
              href="/admin/checkin"
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition"
                     Anwesenheit verwalten
              </p>
            </Link>

            <Link
              href="/schedule"
              className="bg-white p-8 rounded-3xl border border-slateh3>
              <p className="text-slate-600">
                Turnierübersicht anzeigen
              </p>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500">
          TennisTurnier • Digitale Turnierverwaltung für Vereine
        </div>
      </footer>
    </div>
  );
}
