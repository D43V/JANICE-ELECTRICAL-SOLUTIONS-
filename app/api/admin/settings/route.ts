import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { businessSettingsSchema } from '@/lib/validation'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  const { data, error } = await admin.from('business_settings').select('*').limit(1).maybeSingle()
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Unable to load settings.' }, { status: 500 })
  }

  return NextResponse.json(data || {
    business_name: 'JA',
    business_email: 'hello@ja.example.com',
    phone: '+260 000 000000',
    whatsapp: '+260 000 000000',
    service_area: 'Zambia',
    default_currency: 'ZMW',
    default_validity_days: 14,
    default_terms: 'This quotation is valid until the expiry date shown above and is subject to final approval by JA.',
    tax_enabled: false,
    tax_rate: 0,
    logo_url: '',
  })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const parsed = businessSettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the business settings form.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const payload = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await admin.from('business_settings').upsert(payload, { onConflict: 'id' }).select().single()
  if (error) {
    return NextResponse.json({ error: error.message || 'Unable to save settings.' }, { status: 500 })
  }

  return NextResponse.json(data)
}
