import { QuoteForm } from '@/components/quote-form'
import { createClient } from '@/lib/supabase/server'

export default async function QuotePage() {
  const supabase = await createClient()
  const { data } = await supabase.from('services').select('slug,name,base_price,description').eq('is_active', true).order('name')
  const services = (data ?? []).map((service) => ({ id: service.slug, name: service.name, price: service.base_price / 100, description: service.description }))
  return <main><section className="bg-[#121212] py-14 text-white"><div className="container"><p className="eyebrow mb-4 text-[#c9a24d]">Start a conversation</p><h1 className="text-4xl font-semibold sm:text-6xl">Tell us what you need.</h1><p className="mt-5 max-w-xl text-sm leading-6 text-white/60">Choose a service and share a few details. Your estimate is indicative and will be reviewed before any official quotation is issued.</p></div></section><section className="container py-12"><QuoteForm services={services}/></section></main>
}
