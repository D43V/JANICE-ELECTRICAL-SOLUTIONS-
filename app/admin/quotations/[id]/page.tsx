import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuotationEditor } from '@/components/quotation-editor'

export default async function QuotationDetail({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(); if (profile?.role !== 'admin') redirect('/admin')
  const { id } = await params; const { data: quote } = await supabase.from('quotations').select('id,reference,status,subtotal,additional_charges,discount_amount,tax_amount,total_amount,admin_notes,customer_notes,valid_until,customers(full_name,email,phone),quotation_items(description_snapshot,quantity,unit_name,unit_price,line_total,options_snapshot)').eq('id', id).single(); if (!quote) redirect('/admin/quotations')
  const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers
  return <main className="min-h-screen bg-[#f5f3ee] px-5 py-8 text-[#171714]"><div className="mx-auto max-w-4xl"><Link href="/admin/quotations" className="text-sm font-semibold text-[#8d6d2d]">← Quotations</Link><div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[.18em] text-[#8d6d2d]">{quote.status}</p><h1 className="mt-2 text-4xl font-semibold">{quote.reference}</h1><p className="mt-2 text-sm text-black/55">{customer?.full_name} · {customer?.email} · {customer?.phone}</p></div><p className="text-2xl font-semibold">K{(quote.total_amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div><QuotationEditor quote={{ id: quote.id, status: quote.status, adminNotes: quote.admin_notes, additionalCharges: quote.additional_charges, discountAmount: quote.discount_amount }} /></div></main>
}
