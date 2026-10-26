import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminServiceManager } from '@/components/admin-service-manager'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/admin')

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-5 py-8 text-[#171714]">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link href="/admin" className="text-sm font-semibold text-[#8d6d2d]">← Overview</Link>
            <h1 className="mt-2 text-3xl font-semibold">Service catalog</h1>
          </div>
        </div>

        <AdminServiceManager />
      </div>
    </main>
  )
}
