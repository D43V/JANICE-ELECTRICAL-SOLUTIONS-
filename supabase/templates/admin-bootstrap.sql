-- Admin bootstrap template
-- Replace the UUID below with the actual Supabase Auth user ID.
-- Run this after creating the user in Supabase Auth.

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
