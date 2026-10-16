import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email().max(254), phone: z.string().trim().max(40).default(''), message: z.string().trim().min(5).max(4000) })
export async function POST(request: Request) { try { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: 'Please check the form details.' }, { status: 400 }); const supabase = await createClient(); const { error } = await supabase.rpc('submit_enquiry', { p_name: parsed.data.name, p_email: parsed.data.email, p_phone: parsed.data.phone, p_message: parsed.data.message }); if (error) { console.error('[contact] save failed', error.message); return NextResponse.json({ error: 'The enquiry service is not configured yet.' }, { status: 503 }) } return NextResponse.json({ ok: true }) } catch { return NextResponse.json({ error: 'Unable to process this request.' }, { status: 400 }) } }
