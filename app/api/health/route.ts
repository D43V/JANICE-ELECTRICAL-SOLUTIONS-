import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const requiredEnv = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY']

export async function GET() {
  const missingEnv = requiredEnv.filter((name) => !process.env[name]?.trim())

  let supabaseStatus = 'not-configured'
  if (!missingEnv.length) {
    try {
      const supabase = createAdminClient()
      const { error } = await supabase.from('business_settings').select('id').limit(1)
      supabaseStatus = error ? 'error' : 'ok'
    } catch {
      supabaseStatus = 'error'
    }
  }

  const ok = missingEnv.length === 0 && supabaseStatus === 'ok'

  return NextResponse.json(
    {
      ok,
      service: 'ja-electrical-solutions',
      environment: {
        missing: missingEnv,
      },
      supabase: supabaseStatus,
      timestamp: new Date().toISOString(),
    },
    { status: ok ? 200 : 503 },
  )
}
