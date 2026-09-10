import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">🎾 Tennis Jugendturnier</h1>
      <p className="text-gray-600 max-w-md mb-8">
        Willkommen zum Turnier! Wähle eine Option, um fortzufahren:
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/register" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition">
          Kind anmelden
        </Link>
        <Link href="/schedule" className="w-full bg-white border border-gray-300 text-gray-800 py-3 rounded-lg font-bold shadow hover:bg-gray-100 transition">
          Spielplan & Plätze
        </Link>
        <Link href="/admin/checkin" className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold shadow hover:bg-gray-900 transition">
          Admin Check-In
        </Link>
      </div>
    </div>
  );
}
