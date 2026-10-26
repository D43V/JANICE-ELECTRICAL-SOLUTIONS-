import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Admin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return <main className="min-h-screen bg-[#101D35] px-5 py-20 text-white"><div className="mx-auto max-w-md text-center"><p className="text-sm tracking-[.28em] text-[#c9a24d]">JA / ADMIN</p><h1 className="mt-8 text-3xl font-semibold">Administrator access required</h1><p className="mt-4 text-sm text-white/60">Your account is authenticated but is not authorised to access this area.</p></div></main>
  const [{ count: total }, { count: underReview }, { count: accepted }, { data: recent }] = await Promise.all([
    supabase.from('quotations').select('id', { count: 'exact', head: true }),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'under_review'),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('quotations').select('reference,status,total_amount,submitted_at').order('submitted_at', { ascending: false }).limit(5),
  ])
  return <main className="min-h-screen bg-[#F3F5F8] px-5 py-8 text-[#101D35]"><div className="mx-auto max-w-6xl"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold tracking-[.25em] text-[#8d6d2d]">JA / ADMIN</p><h1 className="mt-4 text-4xl font-semibold tracking-tight">Overview</h1></div><form action="/auth/signout" method="post"><button className="min-h-11 rounded-full border border-[#d7d2c7] px-4 py-2 text-sm">Sign out</button></form></div><div className="mt-10 grid gap-4 sm:grid-cols-3"><Metric label="Quotation requests" value={total ?? 0}/><Metric label="Under review" value={underReview ?? 0}/><Metric label="Accepted" value={accepted ?? 0}/></div><section className="mt-8 rounded-2xl border border-[#dfdbd1] bg-white p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">Recent quotations</h2><p className="mt-2 text-sm text-black/55">Live requests from Supabase.</p></div><Link href="/admin/quotations" className="min-h-11 rounded-full bg-[#171714] px-4 py-3 text-sm font-semibold text-white">View all</Link></div><div className="mt-6 flex flex-col gap-3">{recent?.length ? recent.map((quote) => <div key={quote.reference} className="flex items-center justify-between gap-4 rounded-xl border border-[#eeeae2] p-4"><div><p className="font-semibold">{quote.reference}</p><p className="text-sm text-black/55">{quote.status}</p></div><p className="font-semibold">K{(quote.total_amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p></div>) : <p className="rounded-xl border border-dashed p-5 text-sm text-black/55">No quotation requests yet.</p>}</div></section></div></main>
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-[#dfdbd1] bg-white p-5"><p className="text-sm text-black/55">{label}</p><p className="mt-3 text-4xl font-semibold">{value}</p></div> }
