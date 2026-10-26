'use client'

import { useEffect, useState } from 'react'

const initial = {
  business_name: 'JA',
  business_email: 'hello@ja.example.com',
  phone: '+260 000 000000',
  whatsapp: '+260 000 000000',
  service_area: 'Zambia',
  default_currency: 'ZMW',
  default_validity_days: 14,
  default_terms: 'This quotation is valid until the expiry date shown above and is subject to final approval by JA.',
  tax_enabled: false,
  tax_rate: 0,
  logo_url: '',
}

export function AdminSettingsForm() {
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) {
        setMessage('Unable to load settings right now.')
        setLoading(false)
        return
      }
      const data = await res.json()
      setForm({ ...initial, ...data })
      setLoading(false)
    })()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(body.error || 'Unable to save settings.')
      setSaving(false)
      return
    }
    setMessage('Settings saved successfully.')
    setSaving(false)
  }

  if (loading) return <div className="rounded-2xl border border-[#dfe5ef] bg-white p-6 text-[#253248]">Loading settings…</div>

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-[#dfe5ef] bg-white p-6 text-[#253248]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium">
          <span>Business name</span>
          <input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Business email</span>
          <input value={form.business_email} onChange={(e) => setForm({ ...form, business_email: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Phone</span>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>WhatsApp</span>
          <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Service area</span>
          <input value={form.service_area} onChange={(e) => setForm({ ...form, service_area: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Default currency</span>
          <input value={form.default_currency} onChange={(e) => setForm({ ...form, default_currency: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2 uppercase" />
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Default validity (days)</span>
          <input type="number" min={1} max={365} value={form.default_validity_days} onChange={(e) => setForm({ ...form, default_validity_days: Number(e.target.value) })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Logo URL</span>
          <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          <span>Default quotation terms</span>
          <textarea rows={5} value={form.default_terms} onChange={(e) => setForm({ ...form, default_terms: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={form.tax_enabled} onChange={(e) => setForm({ ...form, tax_enabled: e.target.checked })} />
          Tax enabled
        </label>
        <label className="space-y-2 text-sm font-medium">
          <span>Tax rate (%)</span>
          <input type="number" min={0} max={100} step="0.01" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
        </label>
      </div>

      {message ? <p className="text-sm text-[#1f6f4b]">{message}</p> : null}
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="rounded-xl bg-[#101d35] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}
