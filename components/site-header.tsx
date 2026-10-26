import Link from "next/link"
import { Menu, ArrowUpRight } from "lucide-react"

const companyLogo = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-BE8B060F-fYutj03o9wgMRfg6nw8kUk0xLhSpsB.jpeg"

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-[#101D35] text-white">
      <div className="container flex min-h-[74px] items-center justify-between gap-4 py-2">
        <Link href="/" aria-label="JANICE ELECTRICAL SOLUTIONS home" className="flex min-w-0 items-center gap-3">
          <img src={companyLogo} alt="JANICE ELECTRICAL SOLUTIONS logo" className="size-12 shrink-0 rounded-lg object-contain" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[11px] font-black tracking-[.12em] text-white sm:text-sm">JANICE</span>
            <span className="block truncate text-[9px] font-semibold tracking-[.1em] text-[#D4AF65] sm:text-[10px]">ELECTRICAL SOLUTIONS</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex"><Link href="/services">Services</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/admin/login" className="text-[#6e6c67]">Admin</Link></nav>
        <div className="flex items-center gap-2"><Link href="/get-a-quote" className="btn btn-gold hidden sm:inline-flex">Get a quote <ArrowUpRight className="ml-2" size={16}/></Link><button aria-label="Open menu" className="flex size-11 items-center justify-center rounded border border-[#dedbd3] md:hidden"><Menu size={20}/></button></div>
      </div>
    </header>
  )
}
