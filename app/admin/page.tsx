import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') {
    return (
      <main className="min-h-screen bg-[#101d35] px-5 py-20 text-white">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d4af65]">Access denied</p>
          <p className="mt-3 text-lg">You do not have administrator access.</p>
        </div>
      </main>
    )
  }

  const [{ count: total }, { count: newRequests }, { count: underReview }, { count: accepted }, { data: recent }] = await Promise.all([
    supabase.from('quotations').select('id', { count: 'exact', head: true }),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'under_review'),
    supabase.from('quotations').select('id', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('quotations').select('reference,status,total_amount,submitted_at').order('submitted_at', { ascending: false }).limit(5),
  ])

  const metrics = [
    { label: 'Total quotation requests', value: total ?? 0 },
    { label: 'New requests', value: newRequests ?? 0 },
    { label: 'Under review', value: underReview ?? 0 },
    { label: 'Accepted quotations', value: accepted ?? 0 },
  ]

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-5 py-8 text-[#171714]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8d6d2d]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">JA operations overview</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/quotations" className="rounded-xl bg-[#101d35] px-4 py-2 text-sm font-semibold text-white">Quotations</Link>
            <Link href="/admin/services" className="rounded-xl border border-[#d6dfe8] bg-white px-4 py-2 text-sm font-semibold text-[#101d35]">Services</Link>
            <Link href="/admin/settings" className="rounded-xl border border-[#d6dfe8] bg-white px-4 py-2 text-sm font-semibold text-[#101d35]">Settings</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#5c687b]">{metric.label}</p>
              <p className="mt-4 text-3xl font-semibold text-[#101d35]">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#dfe5ef] bg-white p-6">
          <h2 className="text-xl font-semibold">Recent quotation activity</h2>
          <div className="mt-4 space-y-3">
            {(recent ?? []).length === 0 ? <p className="text-sm text-[#5c687b]">No recent activity.</p> : null}
            {(recent ?? []).map((item) => (
              <div key={item.reference} className="flex items-center justify-between border-b border-[#edf1f6] pb-3 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.reference}</p>
                  <p className="text-xs text-[#5c687b]">{new Date(item.submitted_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium uppercase tracking-wide text-[#8d6d2d]">{item.status}</p>
                  <p className="text-sm text-[#5c687b]">{item.total_amount ? `K${Number(item.total_amount / 100).toFixed(2)}` : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
