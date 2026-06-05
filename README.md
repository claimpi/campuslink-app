# CampusLink App 🔥

> Premium dating platform for Kenya — Next.js 14 + Supabase + PWA

## Deploy to Vercel

### 1. Import on Vercel
Go to → https://vercel.com/new → Import `claimpi/campuslink-app`

### 2. Add Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (keep secret!) |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL |

> ⚠️ Never commit actual key values to the repo. Use Vercel's environment variable dashboard.

### 3. Click Deploy 🚀

---

## Stack
- **Next.js 14** — App Router, TypeScript
- **Supabase** — Auth, Postgres, Realtime, Storage
- **Framer Motion** — Swipe animations
- **Tailwind CSS** — Styling
- **PWA** — Installs on Android & iPhone from browser

## Features
- 💘 Tinder-style swipe deck with drag gestures
- 🎉 Match modal with confetti
- 💬 Real-time chat (Supabase Realtime)
- 🪙 Campus Coins economy
- 💎 Premium subscriptions (Silver/Gold/Platinum)
- 📱 PWA — add to home screen
- 🌙 Dark mode
- 🛡️ RLS security on all tables
- 💳 PesaPal IPN webhook at `/api/pesapal/ipn`

## Local Development
```bash
cp .env.example .env.local
# fill in .env.local with your Supabase values
npm install
npm run dev
```

Built with ❤️ in Nairobi 🇰🇪
