import { z } from 'zod'

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().min(5).max(4000),
  category: z.string().trim().min(2).max(120),
  pricing_type: z.enum(['fixed','per_unit','hourly','daily','tiered','custom']),
  base_price: z.coerce.number().int().min(0).max(100000000),
  unit_name: z.string().trim().max(50).optional().or(z.literal('')),
  image_path: z.string().trim().max(500).optional().or(z.literal('')),
  is_active: z.coerce.boolean().default(true),
})

export const businessSettingsSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  business_email: z.string().trim().email().max(254),
  phone: z.string().trim().min(5).max(50),
  whatsapp: z.string().trim().max(50).default(''),
  service_area: z.string().trim().min(2).max(200),
  default_currency: z.string().trim().length(3).default('ZMW'),
  default_validity_days: z.coerce.number().int().min(1).max(365),
  default_terms: z.string().trim().min(10).max(4000),
  tax_enabled: z.coerce.boolean().default(false),
  tax_rate: z.coerce.number().min(0).max(100),
  logo_url: z.string().trim().max(500).default(''),
})
