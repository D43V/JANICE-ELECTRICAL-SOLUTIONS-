'use client'

import { useEffect, useState } from 'react'

const blank = {
  id: '',
  name: '',
  slug: '',
  description: '',
  category: '',
  pricing_type: 'fixed',
  base_price: 0,
  unit_name: '',
  image_path: '',
  is_active: true,
}

export function AdminServiceManager() {
  const [services, setServices] = useState<any[]>([])
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/admin/services')
      if (!res.ok) return
      const data = await res.json()
      setServices(data.services || [])
    })()
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      setMessage(body.error || 'Unable to save service.')
      setSaving(false)
      return
    }
    setMessage('Service saved successfully.')
    setForm(blank)
    const next = await fetch('/api/admin/services')
    if (next.ok) {
      const json = await next.json()
      setServices(json.services || [])
    }
    setSaving(false)
  }

  async function toggleStatus(service: any) {
    await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...service, is_active: !service.is_active }),
    })
    const res = await fetch('/api/admin/services')
    if (res.ok) {
      const json = await res.json()
      setServices(json.services || [])
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-[#dfe5ef] bg-white p-6 text-[#253248]">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            <span>Service name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Slug</span>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium md:col-span-2">
            <span>Description</span>
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Category</span>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Pricing type</span>
            <select value={form.pricing_type} onChange={(e) => setForm({ ...form, pricing_type: e.target.value as any })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2">
              <option value="fixed">Fixed</option>
              <option value="per_unit">Per unit</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="tiered">Tiered</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Base price (minor units)</span>
            <input type="number" min={0} value={form.base_price} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>Unit name</span>
            <input value={form.unit_name} onChange={(e) => setForm({ ...form, unit_name: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
          </label>
          <label className="space-y-2 text-sm font-medium md:col-span-2">
            <span>Image path</span>
            <input value={form.image_path} onChange={(e) => setForm({ ...form, image_path: e.target.value })} className="w-full rounded-lg border border-[#d6dfe8] px-3 py-2" />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium md:col-span-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active service
          </label>
        </div>

        {message ? <p className="text-sm text-[#1f6f4b]">{message}</p> : null}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#101d35] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Saving…' : 'Save service'}
          </button>
        </div>
      </form>

      <div className="space-y-3 rounded-2xl border border-[#dfe5ef] bg-white p-6 text-[#253248]">
        <h2 className="text-lg font-semibold">Current services</h2>
        {services.length === 0 ? <p className="text-sm text-[#5c687b]">No services yet.</p> : null}
        {services.map((service) => (
          <div key={service.id} className="rounded-xl border border-[#dfe5ef] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-xs text-[#5c687b]">{service.category} · {service.pricing_type}</p>
              </div>
              <button type="button" onClick={() => toggleStatus(service)} className="rounded-lg border border-[#d6dfe8] px-2 py-1 text-xs font-medium">
                {service.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <button type="button" onClick={() => setForm({ ...service, id: service.id })} className="mt-3 text-xs font-semibold text-[#8d6d2d]">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
