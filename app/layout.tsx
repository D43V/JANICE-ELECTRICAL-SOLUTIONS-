import type { Metadata, Viewport } from "next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "JANICE ELECTRICAL SOLUTIONS | Reliable work. Done right.", description: "JANICE ELECTRICAL SOLUTIONS provides professional electrical solutions with clear quotations and dependable service." }
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#101D35" }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><SiteHeader />{children}</body></html> }
