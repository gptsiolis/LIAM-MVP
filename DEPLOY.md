# LIAM MVP — Deployment Guide

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Push database schema + seed demo data
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Prerequisites

- GitHub account with the `liam-mvp` repo pushed
- [Vercel account](https://vercel.com) (free tier works)

### Step 1: Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `liam-mvp` repo
4. Vercel auto-detects **Next.js** — no framework config needed

### Step 2: Set Environment Variables

In the Vercel project dashboard → **Settings** → **Environment Variables**, add:

| Variable | Value | Required |
|----------|-------|----------|
| `DATABASE_URL` | `file:./dev.db` (SQLite) or Turso URL | Yes |
| `JWT_SECRET` | A long random string (`openssl rand -base64 32`) | Yes |

> **Important:** For the demo/video shoot, SQLite (`file:./dev.db`) works but
> the database resets on each deployment. See "Production Database" below
> for a persistent option.

### Step 3: Deploy

1. Click **Deploy** — Vercel runs `npm install` → `prisma generate` → `next build`
2. After deploy, seed the database by running the seed script locally
   against the deployed DB (or accept an empty state for the demo)
3. Preview URL is live immediately

### Step 4: Preview Branches

- Every push to a branch creates a **Preview Deployment** automatically
- Push to `main` triggers a **Production Deployment**
- Preview URLs look like: `liam-mvp-<hash>-yourteam.vercel.app`

---

## Production Database (Turso)

SQLite on Vercel has limitations (ephemeral filesystem). For a persistent
database, use [Turso](https://turso.tech) (hosted LibSQL, free tier):

### Setup

```bash
# 1. Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 2. Sign up / login
turso auth signup   # or: turso auth login

# 3. Create a database
turso db create liam-mvp

# 4. Get the connection URL
turso db show liam-mvp --url
# → libsql://liam-mvp-yourorg.turso.io

# 5. Create an auth token
turso db tokens create liam-mvp
# → eyJ...
```

### Code Changes for Turso

Replace `@prisma/adapter-better-sqlite3` with `@prisma/adapter-libsql`:

```bash
npm install @prisma/adapter-libsql @libsql/client
npm uninstall @prisma/adapter-better-sqlite3 better-sqlite3
```

Update `src/lib/db.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
```

Set in Vercel Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `libsql://liam-mvp-yourorg.turso.io` |
| `TURSO_AUTH_TOKEN` | `eyJ...` |

Then push schema and seed:

```bash
npx prisma db push
npm run db:seed
```

---

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite file path or Turso URL | `file:./dev.db` |
| `JWT_SECRET` | Secret for signing session cookies | Dev fallback provided |
| `TURSO_AUTH_TOKEN` | Auth token for Turso (production only) | — |

### Future Variables (not yet used)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe API key for fiat payments |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID for embedded wallets |
| `BASE_RPC_URL` | Base L2 RPC endpoint for on-chain reads |

---

## Troubleshooting

**Build fails with Prisma error:**
Ensure `postinstall` script runs `prisma generate`. Check that `prisma` is
in `dependencies` (not just `devDependencies`).

**Database is empty after deploy:**
SQLite on Vercel uses an ephemeral filesystem. Either run `db:seed` after
deploy, or switch to Turso for persistence.

**`better-sqlite3` native module error on Vercel:**
This can happen if Vercel's build environment differs from local. Consider
switching to Turso/LibSQL which is pure JavaScript (no native modules).

**Session cookies not working:**
Ensure `JWT_SECRET` is set in Vercel environment variables. The fallback
dev secret only works locally.
