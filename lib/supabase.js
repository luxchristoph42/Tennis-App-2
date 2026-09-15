// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// TRAGE HIER DEINE ECHTEN DATEN EIN:
const supabaseUrl = 'https://ksyukhgmskqcwrludutf.supabase.co'; 
const supabaseAnonKey = 'sb_publishable_H9o7PyVdLjGCsblIOdEaqg_iDBtR3WV';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Achtung: Supabase URL oder Key fehlen in lib/supabase.js!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
