# Berlin MarketHUB

A vibrant pink consumer marketplace where sellers post products and buyers browse, chat, and buy — mobile-first, powered by Supabase.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, path /api)
- `pnpm --filter @workspace/berlin-markethub run dev` — run the frontend (port auto, path /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase connection

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter routing, Supabase JS, framer-motion, Recharts
- API: Express 5 + Supabase JS (server-side)
- DB: Supabase PostgreSQL (project: fkeuioagahwqgpqjuwqj)
- Auth: Supabase Auth (OTP, magic link, email+password)
- Storage: Supabase Storage (listings bucket)
- Realtime: Supabase Realtime (messages, notifications)
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas
- `artifacts/berlin-markethub/src/` — React frontend
- `artifacts/berlin-markethub/src/lib/supabase.ts` — Supabase client
- `artifacts/berlin-markethub/src/context/AuthContext.tsx` — Auth state
- `artifacts/api-server/src/routes/` — Express API routes
- `lib/db/src/schema/` — Drizzle schema (not used, Supabase is the DB)

## Architecture decisions

- **Supabase as primary DB + Auth**: Auth, realtime chat, file storage all go through Supabase directly from the frontend
- **Express API for server-side logic**: Image compression (sharp), analytics aggregation, cart/orders state
- **Guest browsing**: Users can browse listings without signing up — auth only required to post, chat, or buy
- **Image compression**: All uploads compressed to <400KB via browser-image-compression (frontend) and sharp (backend)
- **Capacitor-ready**: Configured for Capacitor mobile wrapping

## Product

- Browse marketplace listings by category (Popular, Women, Men, Home, Beauty, Electronics)
- Featured products grid, trending section, search with filters
- Seller profiles with verification badge, stats, shop preview, social links
- Product detail with image carousel, reviews, seller info, Add to Cart / Buy Now
- Realtime buyer-seller chat with typing indicators and product sharing
- Create listings with multi-image upload and AI-generated descriptions
- Seller analytics dashboard with revenue charts, conversion rate, best sellers
- OTP email verification, magic link login, password reset
- Notification center (messages, follows, likes, orders, reviews)
- Wallet system for seller earnings and payouts

## User preferences

- Pink/rose primary color (#E91E8C) — matches uploaded screenshots exactly
- Mobile-first layout (max-width 430px centered)
- Bottom navigation: Home, Chats, Post (FAB), Profile, Search
- No emojis in the UI
- Prices shown with currency symbol

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing openapi.yaml
- Supabase RLS is enabled on all tables — always pass auth token in API server requests
- Image uploads go through /api/upload/image (compresses via sharp to JPEG)
- The berlin-markethub frontend uses Supabase JS directly for auth and realtime, not via the Express API

## Supabase

- Project ID: fkeuioagahwqgpqjuwqj
- URL: https://fkeuioagahwqgpqjuwqj.supabase.co
- CLI: `npx supabase db query --linked --file <sql_file>`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
