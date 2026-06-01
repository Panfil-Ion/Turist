# Moldova Explorer MVP

Premium tourism web app for Republic of Moldova — Next.js, Supabase, Stripe, Railway.

## Features

- **Freemium**: 3 free destinations, €5 one-time 14-day Full Explorer Pass (Stripe)
- **Video loops**: MP4 background on location pages (place files in `public/media/`)
- **Taxi deep-links**: Yandex Go + Letz/geo with estimated MDL fares
- **Weather**: OpenWeatherMap — hides outdoor parks, shows "Zi Ploioasă" section
- **Culinary guide**: Order/avoid tips + pronunciation audio

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Without Supabase/Stripe env vars, the app runs with **fallback seed data** in code.

## Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial.sql` in SQL Editor
3. Run `supabase/seed.sql`
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Stripe

1. Create Product + one-time Price (€5) in Stripe Dashboard
2. Set `STRIPE_PRICE_ID`, keys in `.env.local`
3. Webhook: `checkout.session.completed` → `https://your-app.up.railway.app/api/webhooks/stripe`
4. Local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## Railway deploy

1. Push repo to GitHub
2. New Railway project → Deploy from repo
3. Add all env vars from `.env.example`
4. Set `NEXT_PUBLIC_APP_URL` to your Railway public URL
5. Health check: `/api/health`

## Media assets

Add optimized silent MP4 loops and MP3 audio to:

- `public/media/*.mp4`
- `public/media/audio/*.mp3`

Paths must match `supabase/seed.sql` or update seed accordingly.
