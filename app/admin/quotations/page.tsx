import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function QuotationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/admin')
  const { data: quotations } = await supabase.from('quotations').select('id,reference,status,total_amount,submitted_at,customers(full_name,email)').order('submitted_at', { ascending: false })
  return <main className="min-h-screen bg-[#f5f3ee] px-5 py-8 text-[#171714]"><div className="mx-auto max-w-6xl"><Link href="/admin" className="text-sm font-semibold text-[#8d6d2d]">← Overview</Link><h1 className="mt-6 text-4xl font-semibold">Quotations</h1><p className="mt-2 text-sm text-black/55">Live quotation requests requiring review.</p><div className="mt-8 flex flex-col gap-3">{quotations?.length ? quotations.map((quote) => { const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers; return <Link href={`/admin/quotations/${quote.id}`} key={quote.id} className="rounded-2xl border border-[#dfdbd1] bg-white p-5 transition hover:border-[#c9a24d]"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{quote.reference}</p><p className="mt-1 text-sm text-black/55">{customer?.full_name ?? 'Customer'} · {customer?.email ?? 'No email'}</p></div><p className="font-semibold">K{(quote.total_amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div><p className="mt-4 text-xs uppercase tracking-[.16em] text-[#8d6d2d]">{quote.status}</p></Link> }) : <p className="rounded-2xl border border-dashed p-6 text-sm text-black/55">No quotations found.</p>}</div></div></main>
}
