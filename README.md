# 설탕 요정의 편지

Nutcracker-inspired anonymous letter board built with Next.js 15, Supabase, and Vercel.

## Supabase
1. Create a new Supabase project for this site.
2. Run all SQL in `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy Project URL and the `service_role` key from Project Settings → API. Never expose the service role key in browser code or commit it to Git.

## Vercel environment variables
Add these in Vercel → Project → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD` (strong private password)
- `ADMIN_SESSION_SECRET` (random string, at least 32 characters)
- `CRON_SECRET` (a different random secret)

Use `.env.example` for variable names only. Never commit real credentials.

## Deploy
Import this GitHub repository into Vercel. Select Next.js and use the repository root as Root Directory. Add all environment variables before deploying.

## Publish scheduling
The public page checks the configured publish time when requested. Vercel Hobby Cron is limited to daily execution, so unattended publication can be delayed until the next Cron run. For reliable minute-level unattended publishing, use a scheduler with minute-level support or a suitable Vercel plan.

## Privacy
All database access is server-side with the service-role key. RLS is enabled and anonymous/authenticated database roles have no table permissions. Public visitors only receive letters after publication. Admin routes use an HttpOnly signed session cookie. Add CAPTCHA/rate limiting and moderation before a public launch.
