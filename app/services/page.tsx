import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Services() {
  const supabase = await createClient()
  const { data: services } = await supabase.from('services').select('name,description,category').eq('is_active', true).order('name')
  return <main><section className="bg-[#121212] py-16 text-white"><div className="container"><p className="eyebrow mb-4 text-[#c9a24d]">Our services</p><h1 className="text-5xl font-semibold">Practical expertise.<br/>Clear outcomes.</h1></div></section><section className="container py-14"><div className="grid-auto">{services?.length ? services.map((service, index) => <article className="card flex min-h-64 flex-col p-6" key={service.name}><span className="text-sm text-[#9a7833]">{String(index + 1).padStart(2, '0')} / {service.category}</span><h2 className="mt-auto text-2xl font-semibold">{service.name}</h2><p className="mt-3 text-sm leading-6 text-[#6e6c67]">{service.description}</p><Link href="/get-a-quote" className="mt-5 text-sm font-bold underline underline-offset-4">Get a quote →</Link></article>) : <p className="text-sm text-[#6e6c67]">Services will appear here once the catalogue is configured.</p>}</div></section></main>
}
