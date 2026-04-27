# Dunora

> AI-powered photo delivery for modern photographers. Upload once. Deliver smarter.

[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)

Dunora is a premium photo workflow platform for sports photographers, event teams, schools and clubs. The MVP collapses Lightroom → WeTransfer → email into a single flow: upload a shoot, apply a preset or AI enhancement, watermark, publish a branded gallery, share one link.

This repository contains the full Next.js 15 application (App Router, RSC by default), wired to Supabase for auth, database, and storage.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 · App Router · React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 with custom design tokens (light + emerald) |
| Auth · DB · Storage | Supabase (Frankfurt, GDPR-friendly) |
| Deploy | Vercel (region: `fra1`) |

---

## Quick start

```bash
git clone https://github.com/dirkboateng/Dunora.git
cd Dunora
npm install
cp .env.example .env.local        # fill in Supabase URL + keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Required environment variables

Get these from **Supabase Studio → Settings → API**, then drop them in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_PROJECT_ID=xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **`SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `NEXT_PUBLIC_`.** It bypasses Row Level Security — keep it server-only.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel — the framework is auto-detected as Next.js.
3. Add the five environment variables from above (use your Vercel domain for `NEXT_PUBLIC_APP_URL`, e.g. `https://dunora.app`).
4. Deploy. The `vercel.json` pins the function region to Frankfurt to match Supabase.

---

## Repo layout

```
.
├── app/
│   ├── (auth)/          login, register, forgot-password, reset-password, verify-email
│   ├── (dashboard)/     authenticated routes
│   ├── auth/callback/   Supabase OAuth/email callback
│   ├── globals.css      Tailwind + design tokens
│   ├── icon.svg         Favicon (Frame D logo)
│   ├── layout.tsx       Root layout + metadata
│   └── page.tsx         Marketing landing
├── components/
│   ├── auth/            Login, Register, ForgotPassword, ResetPassword forms
│   ├── landing/         11 modular landing-page sections
│   └── ui/              Button, Input, Select, Checkbox, Logo
├── lib/
│   ├── supabase/        client.ts, server.ts, middleware.ts
│   ├── tokens.ts        Design tokens as TS constants
│   └── utils.ts         cn() helper
├── types/
│   └── database.ts      Hand-typed Supabase schema (regen with CLI)
├── middleware.ts        Session refresh + protected routes
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json          Region: fra1
```

---

## Database setup

The Supabase schema lives in two SQL migrations (delivered separately):

- `dunora-001-initial-schema.sql` — 13 tables, 6 enums, RLS policies, storage buckets, signup trigger
- `dunora-002-account-type-on-signup.sql` — extends the trigger to capture `account_type`

Run them in the Supabase SQL Editor or via `supabase db push` after copying them into `supabase/migrations/`.

---

## Build status

| Step | Scope | Status |
|---|---|---|
| 1 | Design system v2.0 (light + emerald) | ✅ |
| 2 | Architecture + DB schema + MVP scope | ✅ |
| 3 | Supabase migrations + RLS + storage | ✅ |
| 4 | Next.js scaffold + auth wiring | ✅ |
| 5 | Marketing landing page | ✅ |
| 6 | Real auth screens (register, reset, verify) | ✅ |
| 7 | Onboarding wizard | ⬜ next |
| 8 | Dashboard shell (sidebar + topbar) | ⬜ |
| 9 | Projects CRUD | ⬜ |
| 10 | Upload flow (TUS resumable) | ⬜ |
| 11–14 | Photo grid, watermark, gallery builder, public gallery | ⬜ |
| 15 | Settings | ⬜ |

---

## License

Proprietary — © Dunora. All rights reserved.
