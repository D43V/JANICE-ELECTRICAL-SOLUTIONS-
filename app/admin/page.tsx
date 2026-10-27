import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Admin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,is_admin')
    .eq('id', user.id)
    .maybeSingle()

  const isAdmin = profile?.role === 'admin' || profile?.is_admin === true

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Access denied</p>
          <h1 className="mt-4 text-4xl font-semibold">Administrator access required</h1>
          <p className="mt-4 text-slate-300">Ask a site admin to grant access to this account.</p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5"
          >
            Return home
          </Link>
        </div>
      </main>
    )
  }

  const [{ count: total }, { count: underReview }, { count: accepted }, { data: recent }] = await Promise.all([
    supabase.from('quotations').select('id', { count: 'exact', head: true }),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'under_review'),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('quotations').select('reference,status,total_amount,submitted_at').order('submitted_at', { ascending: false }).limit(5),
  ])

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-600">Admin</p>
            <h1 className="mt-2 text-4xl font-semibold">Operations dashboard</h1>
          </div>

          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5"
          >
            View site
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Total quotes" value={total ?? 0} />
          <Metric label="Under review" value={underReview ?? 0} />
          <Metric label="Accepted" value={accepted ?? 0} />
        </div>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent quotations</h2>
            <Link href="/admin/quotations" className="text-sm font-semibold text-amber-700">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-3 font-medium">Reference</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {(recent ?? []).map((quote) => (
                  <tr key={quote.reference} className="border-t border-slate-200">
                    <td className="py-3 font-medium text-slate-900">{quote.reference}</td>
                    <td className="py-3 capitalize text-slate-600">{quote.status}</td>
                    <td className="py-3 font-medium text-slate-900">K {Number(quote.total_amount ?? 0).toFixed(2)}</td>
                    <td className="py-3 text-slate-600">
                      {quote.submitted_at ? new Date(quote.submitted_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}
