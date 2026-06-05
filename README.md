# CampusLink App 🔥

> Premium dating platform for Kenya — Next.js 14 + Supabase + PWA

## Deploy to Vercel

### 1. Import on Vercel
Go to → https://vercel.com/new → Import `claimpi/campuslink-app`

### 2. Add Environment Variables (copy these exactly)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hmilpoprosjoskhsjlbo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtaWxwb3Byb3Nqb3NraHNqbGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2Njc4MjYsImV4cCI6MjA5NjI0MzgyNn0._P77nu9ddrQ9njGwjKP_gzcAIItlVA6cE1lROl39Dzs` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtaWxwb3Byb3Nqb3NraHNqbGJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDY2NzgyNiwiZXhwIjoyMDk2MjQzODI2fQ.F9lr--Mu9CY0LCOVYmksMS0VuZuCFVLtVZLl17L4vXU` |
| `NEXT_PUBLIC_APP_URL` | `https://campuslink-app.vercel.app` |

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
- 📱 PWA — add to home screen, works offline
- 🌙 Dark mode by default
- 🛡️ RLS security on all tables
- 💳 PesaPal IPN webhook at `/api/pesapal/ipn`

## Local Development
```bash
cp .env.example .env.local
# fill in .env.local with your values
npm install
npm run dev
```

Built with ❤️ in Nairobi 🇰🇪
