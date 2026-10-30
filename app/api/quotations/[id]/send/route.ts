import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createQuotationPdf } from '@/lib/quotation-pdf'
import { sendQuotationNotification } from '@/lib/email'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Administrator access required' }, { status: 403 })
  const { id } = await params
  const { data: quote, error } = await supabase.from('quotations').select('id,reference,status,subtotal,total_amount,valid_until,customers(full_name,email),quotation_items(description_snapshot,quantity,unit_price,line_total)').eq('id', id).single()
  if (error || !quote) return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
  if (!['approved', 'sent'].includes(quote.status)) return NextResponse.json({ error: 'Approve the quotation before sending it.' }, { status: 409 })
  const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers
  if (!customer?.email) return NextResponse.json({ error: 'Customer email is missing.' }, { status: 400 })
  const items = (quote.quotation_items ?? []).map((item) => ({ description: item.description_snapshot, quantity: Number(item.quantity), unitPrice: item.unit_price / 100, lineTotal: item.line_total / 100 }))
  const pdf = await createQuotationPdf({ reference: quote.reference, version: 1, customer: customer.full_name, email: customer.email, items, subtotal: quote.subtotal / 100, total: quote.total_amount / 100, validUntil: quote.valid_until ?? undefined })
  const { data: log } = await supabase.from('email_logs').insert({ quotation_id: quote.id, recipient: customer.email, email_type: 'official_quotation', status: 'pending', attempt_count: 1 }).select('id').single()
  try {
    const result = await sendQuotationNotification({ to: customer.email, subject: `Janice Electrical Solutions quotation ${quote.reference}`, html: `<p>Dear ${customer.full_name},</p><p>Please find your official quotation attached.</p><p>Reference: <strong>${quote.reference}</strong></p>`, pdf })
    const providerMessageId = result.data?.id ?? null
    await supabase.from('email_logs').update({ status: 'accepted', provider_message_id: providerMessageId, sent_at: new Date().toISOString() }).eq('id', log?.id)
    await supabase.from('quotations').update({ status: 'sent', sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', quote.id)
    return NextResponse.json({ reference: quote.reference, providerMessageId })
  } catch (sendError) {
    await supabase.from('email_logs').update({ status: 'failed', error_message: sendError instanceof Error ? sendError.message : 'Email send failed' }).eq('id', log?.id)
    return NextResponse.json({ error: 'Quotation saved, but email delivery failed.' }, { status: 502 })
  }
}
