import Link from "next/link"
import { ArrowUpRight, Menu } from "lucide-react"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/get-a-quote", label: "Quote" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-[#101D35] text-white shadow-sm">
      <div className="container mx-auto flex h-[74px] items-center justify-between px-5">
        <Link href="/" aria-label="JANICE ELECTRICAL SOLUTIONS home" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF65] text-sm font-bold text-slate-900">
            JA
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.18em] text-white/90">JANICE</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">Electrical Solutions</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/75 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Book a consultation
          </Link>
          <Link
            href="/get-a-quote"
            className="inline-flex items-center gap-2 rounded-full bg-[#D4AF65] px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-[#e6c984]"
          >
            Get a quote
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white md:hidden"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  )
}
