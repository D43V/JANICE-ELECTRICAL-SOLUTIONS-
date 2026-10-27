import { createBrowserClient } from '@supabase/ssr'
import { requireEnv } from '@/lib/env'

export function createClient() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = requireEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

  return createBrowserClient(url, key)
}
