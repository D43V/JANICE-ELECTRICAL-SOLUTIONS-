import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type Service = { name: string; description: string; category: string }

const catalogue: Service[] = [
  { name: 'Single-Line Diagram (SLD) Drafting', category: 'Design & Planning', description: 'Clear electrical schematics prepared for planning, review and installation.' },
  { name: 'Electrical Load Sizing & Analysis', category: 'Design & Planning', description: 'Practical load calculations to support safe, reliable system design.' },
  { name: 'Building Infrastructure Planning', category: 'Design & Planning', description: 'Electrical infrastructure planning for new builds and upgrades.' },
  { name: 'Site Supervision & Quality Control', category: 'Project Support', description: 'On-site technical oversight to keep electrical work safe and to specification.' },
  { name: 'Grid Connection Advisory', category: 'Power & Compliance', description: 'Guidance for grid connection planning, requirements and coordination.' },
  { name: 'Facility Power Quality Audits', category: 'Power & Compliance', description: 'Assessments that identify power quality issues affecting your facility.' },
  { name: 'Power Factor Correction (PFC)', category: 'Power & Compliance', description: 'Solutions designed to improve power factor and reduce avoidable losses.' },
  { name: 'Load Logging & Analysis', category: 'Power & Compliance', description: 'Measured load data and practical analysis for better electrical decisions.' },
  { name: 'Thermal Imaging Inspections', category: 'Power & Compliance', description: 'Non-invasive inspections to help identify overheating electrical components.' },
  { name: 'Efficiency Upgrade Reporting', category: 'Power & Compliance', description: 'Actionable reporting for improving electrical efficiency and performance.' },
  { name: 'Turnkey Solar PV Installation', category: 'Solar & Energy', description: 'End-to-end solar PV installation planning and delivery.' },
  { name: 'Energy Storage Systems', category: 'Solar & Energy', description: 'Battery storage solutions planned around your energy needs.' },
  { name: 'Inverter Calibration & MPPT Setup', category: 'Solar & Energy', description: 'Configuration support to help solar inverters perform at their best.' },
  { name: 'Solar Borehole Pumping Systems', category: 'Solar & Energy', description: 'Solar-powered pumping solutions for borehole and water applications.' },
  { name: 'Automatic Changeover (ATS/AMF)', category: 'Power Systems', description: 'Automatic transfer and mains-failure changeover system solutions.' },
  { name: 'Building Electrical Wiring', category: 'Installation', description: 'Professional electrical wiring for residential, commercial and light industrial spaces.' },
  { name: 'Distribution Board (DB) Assemblies', category: 'Installation', description: 'Neat, organised distribution board assembly and installation.' },
  { name: 'Power Risers & Cable Trunking', category: 'Installation', description: 'Structured power distribution using risers, containment and cable trunking.' },
  { name: 'Surge Protection Devices (SPD)', category: 'Protection & Security', description: 'Protection solutions to help guard electrical equipment against surges.' },
  { name: 'Electric Fence', category: 'Protection & Security', description: 'Electric fencing installation and electrical protection solutions.' },
  { name: 'Electrical Wiring', category: 'Installation', description: 'Reliable electrical wiring services for repairs, improvements and new installations.' },
]

export default async function Services() {
  const supabase = await createClient()
  const { data: liveServices } = await supabase.from('services').select('name,description,category').eq('is_active', true).order('name')
  const services = liveServices?.length ? liveServices : catalogue

  return <main><section className="bg-[#101D35] py-16 text-white"><div className="container"><p className="eyebrow mb-4 text-[#D4AF65]">Our services</p><h1 className="text-5xl font-semibold">Practical expertise.<br/>Clear outcomes.</h1><p className="mt-6 max-w-xl text-white/70">Professional electrical, power, solar and protection services for projects that need dependable results.</p></div></section><section className="container py-14"><div className="grid-auto">{services.map((service, index) => <article className="card flex min-h-64 flex-col p-6" key={service.name}><span className="text-sm text-[#9a7833]">{String(index + 1).padStart(2, '0')} / {service.category}</span><h2 className="mt-auto text-2xl font-semibold">{service.name}</h2><p className="mt-3 text-sm leading-6 text-[#6e6c67]">{service.description}</p><Link href="/get-a-quote" className="mt-5 text-sm font-bold underline underline-offset-4">Get a quote →</Link></article>)}</div></section></main>
}
