import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, birth_year: parseInt(birthYear) }),
    });
    setSubmitted(true);
  };

  // Modernisierter Luma-Erfolgsbildschirm
  if (submitted) return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased flex items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md text-center rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
        <div className="text-4xl bg-zinc-800/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-zinc-700/50 mx-auto mb-6 shadow-sm">
          🎉
        </div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-3">
          Anmeldung erfolgreich!
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          Du wurdest erfolgreich für das Jugendturnier registriert. Wir freuen uns auf dich!
        </p>
        <Link
          href="/"
          className="inline-flex w-full justify-center px-5 py-3 rounded-xl font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 shadow-lg text-sm transition-all duration-200"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased flex flex-col justify-between selection:bg-blue-500/30 relative">
      {/* Subtiler Glow im Hintergrund */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-[#09090b]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl">🎾</span>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              TennisTurnier
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Zurück
          </Link>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="w-full max-w-md rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 shadow-2xl relative overflow-hidden">
          {/* Karten-interner Luma-Effekt */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              Jugendturnier Anmeldung
            </h1>
            <p className="text-zinc-500 text-xs mt-1.5">
              Fülle die Felder aus, um am Turniertag auf dem Platz zu stehen.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-2">
                Name des Kindes
              </label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all duration-200" 
                placeholder="Vor- und Nachname"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 tracking-wider uppercase mb-2">
                Geburtsjahr
              </label>
              <input 
                type="number" 
                required 
                placeholder="z.B. 2012" 
                value={birthYear} 
                onChange={(e) => setBirthYear(e.target.value)} 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all duration-200" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 px-5 py-3.5 rounded-xl font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 shadow-lg text-sm transition-all duration-200"
            >
              Jetzt Anmelden
            </button>
          </form>
        </div>
      </main>

      {/* Minimaler Footer */}
      <footer className="border-t border-zinc-900 bg-[#09090b] py-6 text-center text-[10px] text-zinc-600">
        TennisTurnier &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
