import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-slate-900">
          🎾 TennisTurnier
        </h1>

        <nav className="flex gap-3">
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100ed-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700uto px-6 pt-20 pb-24">
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
              className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition"
rder-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition"="max-w-7xl mx-auto px-6 pb-24">
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
              Automatische Gruppen
            </h3>

            <p className="text-slate-600">
              Optimierte Gruppengrößen und automatische
              Spielpläne mit wenigen Klicks.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="text-4xl mb-4">🎾</div>

            <h3 className="text-xl font-bold mb-3">
              Live Turniertag
            </h3>

            <p className="text-slate-600">
              Check-In, kurzfristige Ausfälle und neue
              Auslosungen direkt am Turniertag.
            </p>
          </div>

        </div>
      </section>

      {/* Statistik */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-[32px] shadow-xl p-10 border border-slate-100">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

            <div>
              <div className="text-4xl font-black text-blue-600">
                100%
              </div>
              <p className="mt-2 text-slate-600">
                digital
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

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-500">
          TennisTurnier • Vereinsorganisation neu gedacht
        </div>
      </footer>
    </div>
  );
}
