# Deployment checklist

Follow these steps before launching the site.

## 1. Supabase setup

1. Create or connect a Supabase project.
2. Apply the database migrations in the `supabase/migrations` directory.
3. Create the first admin user in Supabase Auth.
4. Insert a matching row in `public.profiles` with `role = 'admin'`.
5. Configure the app URL and redirect settings for `/auth/callback`.

## 2. Environment configuration

Create a `.env.local` file using `.env.example` and populate values for:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
EMAIL_FROM=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Notes:
- `SUPABASE_SERVICE_ROLE_KEY` is optional if `SUPABASE_SECRET_KEY` is already set.
- `EMAIL_FROM` must use a verified Resend sending domain.
- `NEXT_PUBLIC_SITE_URL` should be the production domain in deployment.

## 3. Admin bootstrap

After the user exists in Supabase Auth, run the following SQL in the Supabase dashboard:

```sql
INSERT INTO public.profiles (id, email, full_name, phone, role, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  'Admin User',
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

Replace the UUID with the actual authenticated user ID and the email with the real admin address.

A reusable template is available in `supabase/templates/admin-bootstrap.sql`.

## 4. Vercel deployment

1. Import the GitHub repository into Vercel.
2. Select the project and confirm the framework is detected as Next.js.
3. Add the environment variables from `.env.example` in the Vercel dashboard.
4. Set the production domain in `NEXT_PUBLIC_SITE_URL`.
5. Configure the Supabase redirect URL for `/auth/callback`.
6. Ensure the project is using Node 20.
7. Trigger a production deployment and verify your site loads.

## 5. Email and PDF requirements

- Configure a verified Resend domain.
- Set `EMAIL_FROM` to the exact verified sender address.
- Keep PDFs in a private storage bucket.
- Only generate signed URLs after admin authorization checks.

## 6. Production checklist

- Deploy to Vercel or your preferred hosting provider.
- Set all environment variables in the hosting platform.
- Confirm login works at `/admin/login`.
- Test the customer quotation flow.
- Test admin approval and rejection actions.
- Verify email delivery and PDF attachment generation.
- Confirm database backups and recovery procedures exist.

## 7. Do not do this in production

- Do not insert sample customer data into the live database.
- Do not leave admin access enabled for a non-authorized account.
- Do not use local development secrets in production.
