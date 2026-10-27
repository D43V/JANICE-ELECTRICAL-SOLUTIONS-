import Link from 'next/link'
import { redirect } from 'next/navigation'
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
      <main className="min-h-screen bg-[#101D35] px-5 py-20 text-white">
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm tracking-[.28em] text-[#c9a24d]">ACCESS DENIED</p>
          <h1 className="mt-4 text-3xl font-semibold">Administrator access required</h1>
          <p className="mt-4 text-white/70">Ask a site admin to grant access to this account.</p>
          <Link href="/" className="mt-6 inline-block rounded-full bg-white px-5 py-3 text-sm font-medium text-[#101D35]">
            Back home
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
    <main className="min-h-screen bg-[#F3F5F8] px-5 py-8 text-[#101D35]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[.28em] text-[#8d6d2d]">ADMIN</p>
            <h1 className="mt-3 text-4xl font-semibold">Dashboard</h1>
          </div>
          <Link href="/" className="rounded-full border border-[#d7d1c7] bg-white px-4 py-2 text-sm font-medium text-[#101D35]">
            View site
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="Total quotes" value={total ?? 0} />
          <Metric label="Under review" value={underReview ?? 0} />
          <Metric label="Accepted" value={accepted ?? 0} />
        </div>

        <section className="mt-8 rounded-2xl border border-[#dfdbd1] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Recent quotations</h2>
            <Link href="/admin/quotations" className="text-sm font-semibold text-[#8d6d2d]">
              View all
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[#5b5a54]">
                <tr>
                  <th className="pb-3 font-medium">Reference</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {(recent ?? []).map((quote) => (
                  <tr key={quote.reference} className="border-t border-[#f0ece5]">
                    <td className="py-3 font-medium text-[#101D35]">{quote.reference}</td>
                    <td className="py-3 capitalize text-[#4d4b48]">{quote.status}</td>
                    <td className="py-3 text-[#101D35]">K {Number(quote.total_amount ?? 0).toFixed(2)}</td>
                    <td className="py-3 text-[#4d4b48]">
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
    <div className="rounded-2xl border border-[#dfdbd1] bg-white p-5 shadow-sm">
      <p className="text-sm text-black/55">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-[#101D35]">{value}</p>
    </div>
  )
}
