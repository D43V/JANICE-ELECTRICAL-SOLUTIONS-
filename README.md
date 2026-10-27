# JANICE ELECTRICAL SOLUTIONS

Janice Electrical Solutions is a Next.js website and quotation workflow for an electrical services business. It includes a public-facing landing page, a quote request form, admin-only quotation review, Supabase-backed data storage, email notifications, and PDF quotation generation.

## Features

- Public marketing site and service overview
- Customer quote request form with quantity selection and service totals
- Database-backed quotation tracking in Supabase
- Admin authentication and role checks
- Quotation approval / rejection / sending workflow
- Resend email dispatch with PDF attachments
- Quote PDF generation for customer-facing documents
- Deployment-ready environment configuration

## Tech stack

- Next.js 15 / React / TypeScript
- Tailwind CSS
- Supabase Postgres + Auth
- Resend email API
- PDF generation with pdf-lib

## Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project
- A Resend account and verified sending domain

## Quick start

1. Install dependencies:

   npm install

2. Copy the environment template and fill in the values:

   cp .env.example .env.local

3. Validate your environment variables:

   npm run validate:env

4. Start the app:

   npm run dev

5. Visit http://localhost:3000

## Required environment variables

Copy these from `.env.example` into `.env.local` and provide real values.

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_URL
- SUPABASE_SECRET_KEY
- SUPABASE_SERVICE_ROLE_KEY (optional alias)
- RESEND_API_KEY
- ADMIN_NOTIFICATION_EMAIL
- EMAIL_FROM
- NEXT_PUBLIC_SITE_URL

## Supabase setup

1. Create a new Supabase project.
2. Apply the SQL migrations in `supabase/migrations/`.
3. Create a first user in Supabase Auth.
4. Insert a matching record in `public.profiles` with the role `admin`.
5. Configure the project site URL and redirect URLs for `/auth/callback`.

Example SQL for the admin profile:

```sql
-- Replace the UUID below with the authenticated user's ID in Supabase Auth
INSERT INTO public.profiles (id, email, full_name, phone, role, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  'Site Administrator',
  '+1234567890',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    is_admin = EXCLUDED.is_admin;
```

See `supabase/templates/admin-bootstrap.sql` for a reusable template.

## Running migrations

From the Supabase SQL editor or a local Supabase CLI session, apply the migrations in order:

```bash
supabase db push
```

If you are using the SQL editor directly, load the files in sequence:

- `supabase/migrations/0001_initial_schema.sql`
- `supabase/migrations/0002_enquiries_and_settings.sql`
- `supabase/migrations/0003_ja_service_catalogue.sql`
- `supabase/migrations/0004_business_settings_and_catalog_enhancements.sql`
- `supabase/migrations/0006_email_and_pdf_tracking.sql`

## Deployment notes

- Set `EMAIL_FROM` to a verified Resend sending domain.
- Put environment variables into Vercel or your hosting platform.
- For production, use the deployed site URL in `NEXT_PUBLIC_SITE_URL`.
- Keep customer PDFs in a private Supabase Storage bucket and generate signed URLs only after authorization checks.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run lint` — lint the project
- `npm run test` — run the test suite
- `npm run validate:env` — check required environment variables

## License

This project is intended for the Janice Electrical Solutions business use case and is configured for deployment in a Vercel + Supabase environment.
