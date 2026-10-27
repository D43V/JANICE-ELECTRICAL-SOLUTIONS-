import Link from "next/link"
import { Menu, ArrowUpRight } from "lucide-react"

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/get-a-quote", label: "Get a quote" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#101D35] text-white">
      <div className="container flex h-[74px] items-center justify-between gap-5">
        <Link href="/" aria-label="JANICE Electrical Solutions home" className="flex items-center gap-3 shrink-0">
          <img
            src="/janice-logo.svg"
            alt="JANICE Electrical Solutions"
            className="h-11 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-white/80 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/get-a-quote"
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF65] bg-[#D4AF65] px-4 py-2 text-sm font-semibold text-[#101D35] transition hover:brightness-110"
          >
            Book a call
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
