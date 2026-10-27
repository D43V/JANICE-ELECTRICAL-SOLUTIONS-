import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createHash } from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateQuote } from '@/lib/pricing'

const quoteRateLimitWindowMs = 60_000
const quoteRateLimitMaxRequests = 15
const quoteRequestStore = new Map<string, { expiresAt: number; reference?: string }>()

const schema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(40),
  }),
  serviceLocation: z.string().trim().max(300).optional(),
  customerNotes: z.string().trim().max(2000).optional(),
  idempotencyKey: z.string().trim().min(6).max(128).optional(),
  items: z.array(z.object({
    serviceId: z.string().min(1).max(120),
    quantity: z.number().int().positive().max(1000),
    options: z.array(z.unknown()).default([]),
  })).min(1).max(20),
})

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
  return ip
}

function enforceQuoteRateLimit(clientIp: string) {
  const now = Date.now()
  const entries = quoteRateLimitStore.get(clientIp) ?? { expiresAt: now + quoteRateLimitWindowMs, reference: undefined }

  if (entries.expiresAt <= now) {
    quoteRateLimitStore.delete(clientIp)
    quoteRateLimitStore.set(clientIp, { expiresAt: now + quoteRateLimitWindowMs })
    return false
  }

  const key = `${clientIp}:${Math.floor(now / quoteRateLimitWindowMs)}`
  const bucket = quoteRateLimitStore.get(key)
  if (!bucket) {
    quoteRateLimitStore.set(key, { expiresAt: now + quoteRateLimitWindowMs })
    return false
  }

  const requestCount = Number(bucket.reference ?? 0)
  if (requestCount >= quoteRateLimitMaxRequests) {
    return true
  }

  bucket.reference = String(requestCount + 1)
  return false
}

function getIdempotencyKey(payload: z.infer<typeof schema>) {
  return payload.idempotencyKey || createHash('sha256').update(JSON.stringify({
    customer: payload.customer,
    items: payload.items,
    serviceLocation: payload.serviceLocation,
    customerNotes: payload.customerNotes,
  })).digest('hex')
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    if (enforceQuoteRateLimit(clientIp)) {
      return NextResponse.json({ error: 'Too many quotation requests. Please try again shortly.' }, { status: 429 })
    }

    const body = await request.json().catch(() => null)
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check the form details.' }, { status: 400 })
    }

    const idempotencyKey = getIdempotencyKey(parsed.data)
    const existing = quoteRequestStore.get(idempotencyKey)
    if (existing && existing.reference && existing.expiresAt > Date.now()) {
      return NextResponse.json({ reference: existing.reference, total: 0, duplicate: true })
    }

    quoteRequestStore.set(idempotencyKey, { expiresAt: Date.now() + 10 * 60_000 })

    const supabase = createAdminClient()
    const ids = parsed.data.items.map((item) => item.serviceId)

    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id,slug,name,description,pricing_type,base_price,unit_name,options')
      .in('slug', ids)
      .eq('is_active', true)

    if (servicesError) {
      throw servicesError
    }

    if (!services || services.length !== new Set(ids).size) {
      return NextResponse.json({ error: 'One or more selected services are no longer available.' }, { status: 400 })
    }

    const serviceMap = new Map(services.map((service) => [service.slug, service]))
    const lines = parsed.data.items.map((item) => {
      const service = serviceMap.get(item.serviceId)
      if (!service) {
        throw new Error(`Service ${item.serviceId} is no longer available.`)
      }

      return {
        quantity: item.quantity,
        unitPriceMinor: Number(service.base_price),
      }
    })

    const totals = calculateQuote(lines)

    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', parsed.data.customer.email)
      .maybeSingle()

    const { data: customer, error: customerError } = existingCustomer
      ? { data: existingCustomer, error: null }
      : await supabase.from('customers').insert({
          full_name: parsed.data.customer.fullName,
          email: parsed.data.customer.email,
          phone: parsed.data.customer.phone,
        }).select('id').single()

    if (customerError || !customer) {
      throw customerError ?? new Error('Customer could not be saved')
    }

    const { data: reference, error: referenceError } = await supabase.rpc('next_quotation_reference')
    if (referenceError || !reference) {
      throw referenceError ?? new Error('Reference could not be generated')
    }

    const { data: quotation, error: quotationError } = await supabase.from('quotations').insert({
      reference,
      customer_id: customer.id,
      currency: 'ZMW',
      subtotal: totals.subtotal,
      total_amount: totals.total,
      tax_amount: totals.tax,
      status: 'new',
      service_location: parsed.data.serviceLocation ?? null,
      customer_notes: parsed.data.customerNotes ?? null,
    }).select('id,reference,total_amount').single()

    if (quotationError || !quotation) {
      throw quotationError ?? new Error('Quotation could not be saved')
    }

    const items = parsed.data.items.map((item) => {
      const service = serviceMap.get(item.serviceId)
      if (!service) {
        throw new Error(`Service ${item.serviceId} is no longer available.`)
      }

      return {
        quotation_id: quotation.id,
        service_id: service.id,
        description_snapshot: service.description,
        quantity: item.quantity,
        unit_price: Number(service.base_price),
        line_total: Number(service.base_price) * item.quantity,
      }
    })

    const { error: itemsError } = await supabase.from('quotation_items').insert(items)
    if (itemsError) {
      throw itemsError
    }

    quoteRequestStore.set(idempotencyKey, { expiresAt: Date.now() + 10 * 60_000, reference: quotation.reference })

    return NextResponse.json({ reference: quotation.reference, total: quotation.total_amount })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('quotation submission failed', { message })
    return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
