import { createClient } from '@supabase/supabase-js'
import { getEnv } from '@/lib/env'

export function createAdminClient() {
  const url = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = getEnv('SUPABASE_SECRET_KEY') || getEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (!url || !key) {
    throw new Error('Supabase server credentials are not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    (getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL')) &&
      (getEnv('SUPABASE_SECRET_KEY') || getEnv('SUPABASE_SERVICE_ROLE_KEY')),
  )
}
