import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateQuote } from '@/lib/pricing'

const schema = z.object({
  customer: z.object({ fullName: z.string().trim().min(2).max(120), email: z.string().email(), phone: z.string().trim().min(7).max(40) }),
  serviceLocation: z.string().trim().max(300).optional(),
  customerNotes: z.string().trim().max(2000).optional(),
  items: z.array(z.object({ serviceId: z.string().min(1).max(120), quantity: z.number().int().positive().max(1000), options: z.array(z.unknown()).default([]) })).min(1).max(20),
})

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check the form details.' }, { status: 400 })
    }

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

    const { data: existing } = await supabase
      .from('customers')
      .select('id')
      .eq('email', parsed.data.customer.email)
      .maybeSingle()

    const { data: customer, error: customerError } = existing
      ? { data: existing, error: null }
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

    return NextResponse.json({ reference: quotation.reference, total: quotation.total_amount })
  } catch (error) {
    console.error('[v0] quotation submission failed', error)
    return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 })
  }
}
