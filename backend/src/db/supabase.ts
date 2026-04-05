import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env')
  }
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}
