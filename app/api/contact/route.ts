import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).default(''),
  message: z.string().trim().min(5).max(4000),
})

const rateLimitWindowMs = 60_000
const rateLimitMaxRequests = 10
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function enforceRateLimit(clientIp: string) {
  const now = Date.now()
  const bucket = rateLimitMap.get(clientIp)

  if (!bucket || bucket.resetAt <= now) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + rateLimitWindowMs })
    return false
  }

  if (bucket.count >= rateLimitMaxRequests) {
    return true
  }

  bucket.count += 1
  return false
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request)
    if (enforceRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many contact submissions. Please try again shortly.' },
        { status: 429 },
      )
    }

    const body = await request.json().catch(() => null)
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please check the form details.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase.from('enquiries').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      status: 'new',
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('contact form submission failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    return NextResponse.json(
      { error: 'We could not send your message. Please try again.' },
      { status: 500 },
    )
  }
}
