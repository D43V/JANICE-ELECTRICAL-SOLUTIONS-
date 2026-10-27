import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function QuotationsPage() {
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
  if (!isAdmin) redirect('/admin')

  const { data: quotations } = await supabase
    .from('quotations')
    .select('id,reference,status,total_amount,submitted_at,customers(full_name,email)')
    .order('submitted_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm font-semibold text-amber-700">
          ← Back to dashboard
        </Link>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-600">Quotes</p>
            <h1 className="mt-2 text-4xl font-semibold">Quotation management</h1>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Reference</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {(quotations ?? []).map((quote) => (
                  <tr key={quote.id} className="border-t border-slate-200">
                    <td className="px-5 py-3 font-medium text-slate-900">{quote.reference}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {quote.customers ? quote.customers.full_name || quote.customers.email : '—'}
                    </td>
                    <td className="px-5 py-3 capitalize text-slate-600">{quote.status}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      K {Number(quote.total_amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
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
