import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Schedule() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    async function loadMatches() {
      // Wird erst im Browser ausgeführt, nicht beim Vercel-Build
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      
      const { data } = await supabase
        .from('matches')
        .select('*, player1:players!player1_id(name), player2:players!player2_id(name), court:courts(name)');
      if (data) setMatches(data);
    }
    loadMatches();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🎾 Spielplan & Platzübersicht</h1>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">Der Turnierplan wurde noch nicht generiert.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((m) => (
            <div key={m.id} className="border p-4 rounded-xl shadow-md bg-white">
              <div className="text-sm font-semibold text-blue-600 mb-1">
                {m.court ? m.court.name : 'Platz wird zugewiesen'}
              </div>
              <div className="text-lg font-bold">
                {m.player1?.name || 'Spieler 1'} VS {m.player2?.name || 'Spieler 2'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
