import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key')
)

if (!isSupabaseConfigured) {
  console.warn(
    '[SIGAP BESAPRAH] Supabase URL atau Anon Key belum dikonfigurasi di file .env. Menggunakan mode demonstrasi/fallback.'
  )
}

// Inisialisasi Supabase Client dengan konfigurasi fallback aman
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // Menjaga URL tetap bersih tanpa hash/query param
    },
  }
)

export default supabase
