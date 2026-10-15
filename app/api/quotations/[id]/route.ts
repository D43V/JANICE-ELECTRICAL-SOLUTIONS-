import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({ status: z.enum(['new', 'under_review', 'approved', 'sent', 'accepted', 'declined', 'expired', 'cancelled']).optional(), adminNotes: z.string().max(10000).optional(), additionalCharges: z.number().int().min(0).optional(), discountAmount: z.number().int().min(0).optional() })
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(); if (profile?.role !== 'admin') return NextResponse.json({ error: 'Administrator access required' }, { status: 403 })
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: 'Invalid quotation update' }, { status: 400 })
  const { id } = await params; const { data: current } = await supabase.from('quotations').select('subtotal,tax_amount').eq('id', id).single(); if (!current) return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
  const values = parsed.data; const total = current.subtotal + (values.additionalCharges ?? 0) - (values.discountAmount ?? 0) + current.tax_amount
  const { data, error } = await supabase.from('quotations').update({ ...values, total_amount: Math.max(0, total), updated_at: new Date().toISOString() }).eq('id', id).select('id,reference,status,total_amount').single()
  if (error) return NextResponse.json({ error: 'Unable to update quotation' }, { status: 500 }); return NextResponse.json(data)
}
