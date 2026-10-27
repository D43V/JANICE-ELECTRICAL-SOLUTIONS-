'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, Minus, Plus, ShieldCheck, Sparkles } from 'lucide-react'

type Service = { id: string; name: string; price: number; description: string }

type FormState = {
  fullName: string
  email: string
  phone: string
  location: string
  notes: string
}

type Status = {
  kind: 'idle' | 'loading' | 'error' | 'success'
  message?: string
}

const emptyForm: FormState = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  notes: '',
}

function validateForm(form: FormState) {
  if (!form.fullName.trim()) return 'Please enter your name.'
  if (!form.email.trim()) return 'Please enter your email address.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    return 'Please enter a valid email address.'
  }
  if (!form.phone.trim()) return 'Please enter your phone number.'
  return ''
}

export function QuoteForm({ services }: { services: Service[] }) {
  const [selected, setSelected] = useState<string[]>([])
  const [qty, setQty] = useState<Record<string, number>>({})
  const [form, setForm] = useState<FormState>(emptyForm)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const total = useMemo(
    () =>
      services
        .filter((service) => selected.includes(service.id))
        .reduce((sum, service) => sum + service.price * (qty[service.id] ?? 1), 0),
    [services, selected, qty],
  )

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }

  function changeQty(id: string, delta: number) {
    setQty((current) => ({
      ...current,
      [id]: Math.max(1, (current[id] ?? 1) + delta),
    }))
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationMessage = validateForm(form)
    if (validationMessage) {
      setStatus({ kind: 'error', message: validationMessage })
      return
    }

    if (!selected.length) {
      setStatus({ kind: 'error', message: 'Select at least one service.' })
      return
    }

    setStatus({ kind: 'loading', message: 'Sending your quote request...' })

    const payload = {
      customer: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      serviceLocation: form.location.trim() || undefined,
      customerNotes: form.notes.trim() || undefined,
      items: selected.map((serviceId) => ({
        serviceId,
        quantity: qty[serviceId] ?? 1,
        options: [],
      })),
      idempotencyKey: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    }

    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.error || 'We could not save your request. Please try again.')
      }

      setStatus({
        kind: 'success',
        message: `Thanks! Your quote reference is ${data.reference ?? 'received'}.`,
      })

      setSelected([])
      setQty({})
      setForm(emptyForm)
    } catch (error) {
      setStatus({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      })
    }
  }

  if (status.kind === 'success') {
    return (
      <div className="mx-auto max-w-xl rounded-[28px] border border-white/30 bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Check className="size-7" />
        </div>
        <h2 className="text-3xl font-semibold text-slate-900">Quote request received</h2>
        <p className="mt-3 text-base text-slate-600">{status.message}</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-7 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form className="grid gap-8 lg:grid-cols-[1.2fr_380px]" onSubmit={submit} noValidate>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
                01 — Service selection
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Choose the work you need</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              <Sparkles className="size-3.5" />
              Tailored pricing
            </div>
          </div>

          <div className="space-y-4">
            {services.map((service) => {
              const selectedService = selected.includes(service.id)
              const quantity = qty[service.id] ?? 1

              return (
                <div
                  key={service.id}
                  className={`rounded-2xl border p-4 transition-all duration-200 ${
                    selectedService
                      ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                      : 'border-slate-200 bg-slate-50/80 text-slate-800 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => toggle(service.id)}
                      className="flex flex-1 items-start gap-3 text-left"
                    >
                      <span
                        className={`mt-0.5 flex size-6 items-center justify-center rounded border ${
                          selectedService
                            ? 'border-white/50 bg-white/10 text-white'
                            : 'border-slate-300 bg-white text-slate-900'
                        }`}
                      >
                        {selectedService ? <Check className="size-4" /> : null}
                      </span>

                      <span>
                        <span className="block text-lg font-semibold">{service.name}</span>
                        <span
                          className={`mt-1 block text-sm ${
                            selectedService ? 'text-slate-200' : 'text-slate-500'
                          }`}
                        >
                          {service.description}
                        </span>
                      </span>
                    </button>

                    <div className={`text-right ${selectedService ? 'text-white' : 'text-slate-900'}`}>
                      <div className="text-sm font-medium opacity-80">From</div>
                      <div className="text-lg font-semibold">K {service.price.toFixed(2)}</div>
                    </div>
                  </div>

                  {selectedService ? (
                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/10 px-3 py-3">
                      <span className="text-sm font-medium">Quantity</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => changeQty(service.id, -1)}
                          className="rounded-full border border-white/20 bg-white/5 p-2 text-white transition hover:bg-white/10"
                          aria-label={`Decrease quantity for ${service.name}`}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(service.id, 1)}
                          className="rounded-full border border-white/20 bg-white/5 p-2 text-white transition hover:bg-white/10"
                          aria-label={`Increase quantity for ${service.name}`}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                02 — Your details
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">Get in touch</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                placeholder="Your full name"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Phone
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                placeholder="+260 ..."
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Project location
              <input
                value={form.location}
                onChange={(event) => updateField('location', event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                placeholder="Area or site address"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Project notes
              <textarea
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                placeholder="Tell us about the project scope, timeline, and any important details."
              />
            </label>
          </div>

          {status.kind === 'error' ? (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {status.message}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="relative h-fit rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-amber-400/30 via-yellow-300/20 to-transparent" />
        <div className="relative">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Summary</p>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-200">
              Live estimate
            </span>
          </div>

          <div className="space-y-4">
            {selected.length === 0 ? (
              <p className="text-sm text-slate-300">No services selected yet.</p>
            ) : (
              selected.map((serviceId) => {
                const service = services.find((item) => item.id === serviceId)
                if (!service) return null

                const quantity = qty[serviceId] ?? 1

                return (
                  <div
                    key={serviceId}
                    className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-slate-400">Qty {quantity}</p>
                    </div>
                    <p className="font-medium">K {(service.price * quantity).toFixed(2)}</p>
                  </div>
                )
              })
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Estimated total</span>
              <span className="text-2xl font-semibold text-white">K {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={status.kind === 'loading'}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.kind === 'loading' ? 'Submitting...' : 'Request a quote'}
          </button>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
            <ShieldCheck className="size-4 text-emerald-400" />
            <span>Fast, secure quote requests</span>
          </div>
        </div>
      </aside>
    </form>
  )
}
