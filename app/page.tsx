import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, ShieldCheck, Zap } from 'lucide-react'

const services = [
  {
    name: 'Electrical installations',
    desc: 'Safe, considered installation work for homes, offices and commercial spaces.',
  },
  {
    name: 'Maintenance & repairs',
    desc: 'Practical troubleshooting and scheduled support for ongoing reliability.',
  },
  {
    name: 'Commercial projects',
    desc: 'Scalable electrical solutions for growth-focused businesses and facilities.',
  },
]

export default function Home() {
  return (
    <main className="bg-[#f5f7fb] text-slate-900">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#f5f7fb_30%,_#e2e8f0_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-end">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 backdrop-blur-sm">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Trusted electrical specialists
              </div>

              <h1 className="text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                Smart electrical solutions for modern spaces.
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-600">
                From residential upgrades to commercial installations, we deliver safe, efficient, and future-ready electrical systems built to last.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/#quote"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Request a quote
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5"
                >
                  Book a consultation
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  Fully insured
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  24/7 emergency support
                </div>
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  Certified workmanship
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Fast service</p>
                    <h2 className="mt-2 text-3xl font-semibold">24/7 Response</h2>
                  </div>
                  <div className="rounded-full bg-amber-400/15 p-3 text-amber-300">
                    <Zap className="size-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Emergency callout</span>
                      <span className="text-lg font-semibold text-white">24h</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Electrical safety inspections</span>
                      <span className="text-lg font-semibold text-white">Same day</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Commercial fit-out support</span>
                      <span className="text-lg font-semibold text-white">On schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">What we do</p>
            <h2 className="text-4xl font-semibold">Services built around your property.</h2>
          </div>

          <Link href="/contact" className="hidden text-sm font-medium text-slate-700 md:inline-flex">
            Explore more
            <ChevronDown className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.name}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1"
            >
              <div className="mb-5 h-12 w-12 rounded-2xl bg-amber-50 p-3 text-amber-700">
                <Zap className="size-6" />
              </div>
              <h3 className="text-2xl font-semibold">{service.name}</h3>
              <p className="mt-3 text-slate-600">{service.desc}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                Learn more
                <ArrowRight className="size-4" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Why choose us</p>
              <h2 className="text-4xl font-semibold">Experienced, dependable, and ready when you are.</h2>
            </div>

            <div className="space-y-5">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-300">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Licensed and fully insured</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-300">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Clear communication and workmanship</h3>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-300">
                    <Check className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Project planning that keeps things moving</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
