#!/usr/bin/env node

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_URL',
  'SUPABASE_SECRET_KEY',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'ADMIN_NOTIFICATION_EMAIL',
];

const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === '');

if (missing.length > 0) {
  console.error('Missing required environment variables:');
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  process.exit(1);
}

console.log('All required environment variables are configured.');
