import { createClient } from "@supabase/supabase-js"

// Supabase istemcisini oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase istemcisi (anonim anahtar ile)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase istemcisi (servis rolü anahtarı ile)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Singleton pattern ile client-side istemcisini oluştur
let clientInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}
