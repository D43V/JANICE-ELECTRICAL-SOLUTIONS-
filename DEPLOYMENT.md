# JA deployment checklist

1. Create or connect a Supabase project and apply `supabase/migrations/0001_initial_schema.sql` through the Supabase SQL editor or MCP.
2. Create the first administrator in Supabase Auth, then insert a matching row in `public.profiles` with role `admin` using a secure server-side operation.
3. Configure the variables in `.env.example` in Vercel for Preview and Production.
4. Configure a verified Resend sending domain and set `EMAIL_FROM` to that domain.
5. Keep customer PDFs in a private Supabase Storage bucket; issue signed URLs only after an admin authorization check.
6. Set the production site URL and configure Supabase Auth redirect URLs for `/auth/callback`.
7. Test customer submission, admin review, PDF generation, email failure logging and retry behavior before launch.
8. Enable database backups and document restore ownership and frequency.

No sample customer records should be inserted in production.
