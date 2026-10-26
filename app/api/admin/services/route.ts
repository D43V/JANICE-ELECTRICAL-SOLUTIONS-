import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { serviceSchema } from '@/lib/validation'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  const { data, error } = await admin.from('services').select('*').order('name')
  if (error) return NextResponse.json({ error: 'Unable to fetch services.' }, { status: 500 })
  return NextResponse.json({ services: data || [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const parsed = serviceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Please check the service details.' }, { status: 400 })

  const admin = createAdminClient()
  const payload = {
    ...parsed.data,
    base_price: Number(parsed.data.base_price),
    is_active: Boolean(parsed.data.is_active),
    slug: String(parsed.data.slug).toLowerCase().trim(),
    unit_name: parsed.data.unit_name || 'project',
    image_path: parsed.data.image_path || '',
    updated_at: new Date().toISOString(),
  }

  let result
  if (parsed.data.id) {
    result = await admin.from('services').update(payload).eq('id', parsed.data.id).select().single()
  } else {
    result = await admin.from('services').insert(payload).select().single()
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message || 'Unable to save service.' }, { status: 500 })
  }

  return NextResponse.json({ service: result.data })
}
