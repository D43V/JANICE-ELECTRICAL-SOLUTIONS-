'use client'

import { useMemo, useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'

type Service = { id: string; name: string; price: number; description: string }
type FormState = { fullName: string; email: string; phone: string; location: string; notes: string }
type Status = { kind: 'idle' | 'loading' | 'error' | 'success'; message?: string }

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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Please enter a valid email address.'
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
      <div className="mx-auto max-w-xl rounded-2xl border border-[#d9d4ca] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#ecf6ee] text-[#1b7a47]">
          <Check className="size-6" />
        </div>
        <h2 className="text-2xl font-semibold text-[#171714]">Quote request received</h2>
        <p className="mt-3 text-[#4d4c49]">{status.message}</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-6 rounded-full bg-[#111827] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1f2937]"
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form className="grid gap-10 lg:grid-cols-[1fr_360px]" onSubmit={submit} noValidate>
      <div className="flex flex-col gap-8">
        <div>
          <p className="eyebrow mb-3">01 — Services</p>
          <h2 className="text-2xl font-semibold text-[#171714]">Choose the services you need</h2>
        </div>

        <div className="space-y-4">
          {services.map((service) => {
            const selectedService = selected.includes(service.id)
            const quantity = qty[service.id] ?? 1

            return (
              <div key={service.id} className="rounded-2xl border border-[#dedbd3] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggle(service.id)}
                    className={`flex flex-1 items-start gap-3 text-left ${selectedService ? 'text-[#171714]' : 'text-[#4b4a45]'}`}
                  >
                    <span className={`mt-0.5 flex size-5 items-center justify-center rounded border ${selectedService ? 'border-[#111827] bg-[#111827] text-white' : 'border-[#b7b2a8] bg-white'}`}>
                      {selectedService ? <Check className="size-3" /> : null}
                    </span>
                    <span>
                      <span className="block text-lg font-medium">{service.name}</span>
                      <span className="mt-1 block text-sm text-[#60605d]">{service.description}</span>
                    </span>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#171714]">K {service.price.toFixed(2)}</span>
                  </div>
                </div>

                {selectedService ? (
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5f3ee] px-3 py-2">
                    <span className="text-sm font-medium text-[#171714]">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => changeQty(service.id, -1)} className="rounded-full border border-[#d4cec5] bg-white p-2 text-[#171714]" aria-label={`Decrease quantity for ${service.name}`}>
                        <Minus className="size-4" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold text-[#171714]">{quantity}</span>
                      <button type="button" onClick={() => changeQty(service.id, 1)} className="rounded-full border border-[#d4cec5] bg-white p-2 text-[#171714]" aria-label={`Increase quantity for ${service.name}`}>
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-medium text-[#171714]">
            Full name
            <input
              value={form.fullName}
              onChange={(event) => updateField('fullName', event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#d7d1c7] bg-white px-4 py-3 text-[#171714] outline-none transition focus:border-[#111827]"
              placeholder="Your full name"
            />
          </label>

          <label className="block text-sm font-medium text-[#171714]">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#d7d1c7] bg-white px-4 py-3 text-[#171714] outline-none transition focus:border-[#111827]"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-[#171714] md:col-span-2">
            Phone
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#d7d1c7] bg-white px-4 py-3 text-[#171714] outline-none transition focus:border-[#111827]"
              placeholder="+260 ..."
            />
          </label>

          <label className="block text-sm font-medium text-[#171714] md:col-span-2">
            Project location
            <input
              value={form.location}
              onChange={(event) => updateField('location', event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#d7d1c7] bg-white px-4 py-3 text-[#171714] outline-none transition focus:border-[#111827]"
              placeholder="Area or site address"
            />
          </label>

          <label className="block text-sm font-medium text-[#171714] md:col-span-2">
            Project notes
            <textarea
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              className="mt-2 min-h-28 w-full rounded-xl border border-[#d7d1c7] bg-white px-4 py-3 text-[#171714] outline-none transition focus:border-[#111827]"
              placeholder="Tell us about the scope of work, timeline, and any important details."
            />
          </label>
        </div>

        {status.kind === 'error' ? (
          <p className="rounded-xl border border-[#f4d2d2] bg-[#fff4f4] px-4 py-3 text-sm text-[#8b1d1d]">{status.message}</p>
        ) : null}
      </div>

      <aside className="rounded-2xl border border-[#dedbd3] bg-[#1d1d1d] p-6 text-white shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-[#d1b26a]">Summary</p>
        <div className="mt-5 space-y-4">
          {selected.length === 0 ? (
            <p className="text-sm text-[#d3d0cb]">No services selected yet.</p>
          ) : (
            <>
              {selected.map((serviceId) => {
                const service = services.find((item) => item.id === serviceId)
                if (!service) return null
                const quantity = qty[serviceId] ?? 1
                return (
                  <div key={serviceId} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-[#c7c2bb]">Qty {quantity}</p>
                    </div>
                    <p className="font-medium">K {(service.price * quantity).toFixed(2)}</p>
                  </div>
                )
              })}
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>K {total.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={status.kind === 'loading'}
          className="mt-6 w-full rounded-full bg-[#d7b66d] px-5 py-3 text-sm font-semibold text-[#171714] transition hover:bg-[#e1c57a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.kind === 'loading' ? 'Submitting...' : 'Request a quote'}
        </button>
      </aside>
    </form>
  )
}
