create extension if not exists pgcrypto;

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'JA',
  business_email text not null default 'hello@ja.example.com',
  phone text not null default '',
  whatsapp text not null default '',
  service_area text not null default 'Zambia',
  default_currency text not null default 'ZMW',
  default_validity_days integer not null default 14,
  default_terms text not null default 'This quotation is valid until the expiry date shown above and is subject to final approval by JA.',
  tax_enabled boolean not null default false,
  tax_rate numeric(10,4) not null default 0,
  logo_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_settings_updated_idx on public.business_settings(updated_at desc);

alter table public.business_settings enable row level security;

create policy business_settings_admin on public.business_settings
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy business_settings_public_read on public.business_settings
for select to anon, authenticated
using (true);

grant select, insert, update, delete on public.business_settings to authenticated;

insert into public.business_settings (
  business_name,
  business_email,
  phone,
  whatsapp,
  service_area,
  default_currency,
  default_validity_days,
  default_terms,
  tax_enabled,
  tax_rate,
  logo_url
)
values (
  'JA Electrical Solutions',
  'hello@ja.example.com',
  '+260 000 000000',
  '+260 000 000000',
  'Zambia',
  'ZMW',
  14,
  'This quotation is valid until the expiry date shown above and is subject to final approval by JA.',
  false,
  0,
  ''
)
on conflict do nothing;
