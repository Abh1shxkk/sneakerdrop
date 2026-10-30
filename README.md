# SneakerDrop — Premium Sneaker Showcase

> Limited pairs. Zero compromise.

SneakerDrop is a showcase for a fictional sneaker brand. It has a **scroll-driven 3D hero**, a catalogue served from a **real Postgres database (Supabase)**, a **per-product email waitlist**, and a **protected admin dashboard** for managing sneakers and viewing signups.

**Live site:** https://sneakerdrop-rho.vercel.app · **Admin:** https://sneakerdrop-rho.vercel.app/admin · **Repo:** https://github.com/Abh1shxkk/sneakerdrop

![Landing page](docs/screenshots/home.jpg)

---

## Features

### Public site
- **3D scroll hero.** A sneaker built in code with three.js / React Three Fiber, pinned with GSAP ScrollTrigger. As you scroll it spins a full 360°, then tilts to a ¾ angle while four feature callouts appear, then flips to a top-down view as the panel colour shifts. It follows the mouse and bobs when idle.
- **Colourway swatches.** The round thumbnails in the hero come from the database. Picking one blends the 3D shoe to that product's `accent_hex` and shows its name, price and stock status.
- **Best sellers spotlight.** A carousel of featured products over giant faded "BEST SELLERS" text, with directional slide and rotate transitions.
- **Collection grid.** Every product from the database, with animated filter chips by availability, 3D tilt-on-hover cards and staggered reveal on scroll.
- **Product pages** (`/sneakers/[slug]`). Details, availability badge, waitlist copy that changes with stock status, and related products.
- **Waitlist.** Validated on the client and the server, saved in the database, blocks the same email signing up twice for one product, and includes a honeypot field against bots. Success and "already on the list" states are animated.
- Smooth scrolling (Lenis), a glass sticky nav, a full-screen animated mobile menu, a marquee strip, a grain texture, a skip link, and `prefers-reduced-motion` support.

### Admin dashboard (`/admin`)
- Email and password login (Supabase Auth). Only users listed in the `admins` table get in.
- Product **create, edit and delete**, with image upload to Supabase Storage or an Unsplash URL, auto-generated slug, and an accent colour picker.
- **Availability** and **featured** can be changed straight from the table.
- **Waitlist view** with a per-product filter, counts, entry removal and **CSV export**.
- Stats tiles, toasts, a confirmation modal before deleting, and empty and loading states.
- Every change refreshes the public pages at once (`revalidatePath`).

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Server Actions), React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 with design tokens in `globals.css` |
| Database / Auth / Storage | Supabase (Postgres + Row Level Security, Auth, Storage) |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| Motion | GSAP + ScrollTrigger, Lenis, Motion (Framer Motion) |
| Validation | Zod |
| UI | lucide-react, sonner |
| Fonts | Fredoka (display), Anton (headlines), DM Sans (body), via `next/font` |
| Hosting | Vercel |

---

## Getting started

### 1. Clone and install
```bash
git clone <repo-url> sneakerdrop && cd sneakerdrop
npm install
```

### 2. Create the Supabase project
1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor:** run [`supabase/schema.sql`](supabase/schema.sql), then [`supabase/seed.sql`](supabase/seed.sql).
3. **Authentication → Providers → Email:** turn **off** "Allow new users to sign up".
4. **Authentication → Users → Add user:** create your admin with an email and password, and tick "Auto confirm".
5. Make that user an admin (SQL Editor):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

### 3. Environment variables
```bash
cp .env.example .env.local
```
Fill in the values from **Project Settings → API**:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
> The service-role key is **never** used by this app.

### 4. Run
```bash
npm run dev      # http://localhost:3000
npm run build    # production build
```

### Deploy (Vercel)
Import the repo into Vercel, add the two environment variables, and deploy.

---

## Database schema

Full SQL: [`supabase/schema.sql`](supabase/schema.sql)

```
products
  id uuid PK · slug text UNIQUE · name · tagline · description
  price_cents int (≥0) · image_url · colorway · accent_hex (#RRGGBB)
  availability enum(available | low_stock | sold_out | coming_soon)
  featured bool · sort_order int · created_at · updated_at (trigger)

waitlist
  id uuid PK · product_id → products.id (ON DELETE CASCADE)
  email (CHECK format) · created_at
  UNIQUE INDEX (product_id, lower(email))     ← duplicate prevention

admins
  user_id → auth.users.id PK

is_admin()  security-definer function: is auth.uid() listed in admins?
product_waitlist_counts  view (security_invoker): product_id, total
```

### Row Level Security

| Table | anon / public | admin (`is_admin()`) |
|---|---|---|
| products | SELECT | INSERT, UPDATE, DELETE |
| waitlist | **INSERT only** (can never read emails) | SELECT, DELETE |
| admins | — | SELECT own row |
| storage `product-images` | read | upload / update / delete |

---

## Architecture & technical decisions

```
Browser ──► Next.js on Vercel
             ├─ Server Components ── cookie-less anon client ──► products (public read, cached)
             ├─ Server Action joinWaitlist ── anon ──► waitlist (insert-only RLS)
             ├─ Server Actions (admin CRUD) ── user's session cookie ──► RLS is_admin()
             └─ middleware.ts ── refreshes session, redirects /admin/* when signed out
```

1. **No service-role key anywhere.** Every admin write runs as the logged-in user, and Postgres RLS (`is_admin()`) decides whether it is allowed. Even if someone took the public anon key, they could not change products or read the waitlist.
2. **Three layers of admin protection:** the middleware redirect, a `requireAdmin()` / `getAdmin()` check in the admin layout and in *every* server action, and RLS in the database.
3. **The database stops duplicates.** A unique index on `(product_id, lower(email))` blocks repeat signups, even if two requests arrive at the same moment. The action turns Postgres error `23505` into a friendly "you're already on the list".
4. **Validation at every layer:** Zod on the server (the source of truth), a quick check in the browser for better UX, and `CHECK` constraints in Postgres.
5. **Fast public pages that stay fresh.** Public reads use a client without cookies, so pages can be cached (`revalidate = 60`). Admin changes call `revalidatePath()`, so updates appear at once.
6. **A sneaker built in code instead of a downloaded model.** The hero shoe is assembled from shaped three.js geometry (a reshaped sphere for the upper, an extruded side profile for the sole, plus laces, tongue and collar) with per-vertex colour zones. That means no licensing issues, no large download, and the colour changes live for every product in the database. It is loaded with `next/dynamic` (`ssr: false`).
7. **One shared scroll value.** A GSAP ScrollTrigger timeline animates the page elements and also writes its progress into a ref. The R3F `useFrame` loop reads that ref and eases the shoe toward the matching pose, so scroll causes no React re-renders.
8. **Design system:** colour, radius and shadow tokens live in Tailwind v4 `@theme` (`src/app/globals.css`), with three fonts only: Fredoka, Anton and DM Sans.

### Project structure
```
src/
  app/(site)/            landing page, product page
  app/admin/             login + protected dashboard (products, waitlist)
  actions/               server actions (products, waitlist, auth)
  components/site/       Hero, Sneaker3D, ShoeScene, Spotlight, Collection, ...
  components/admin/      ProductForm, ProductTable, WaitlistTable, ...
  lib/                   supabase clients, queries, validation, auth, format
supabase/                schema.sql, seed.sql
```

---

## Screenshots

| | |
|---|---|
| ![Hero](docs/screenshots/home.jpg) | ![Callouts](docs/screenshots/hero-callouts.jpg) |
| ![Collection](docs/screenshots/collection.jpg) | ![Product](docs/screenshots/product.jpg) |
| ![Admin products](docs/screenshots/admin-products.jpg) | ![Admin waitlist](docs/screenshots/admin-waitlist.jpg) |
| ![Mobile](docs/screenshots/mobile.jpg) | |

---

## Known limitations
- No cart, checkout or payments. This is a showcase, not a shop.
- Waitlist signups are stored but no emails are sent. A Supabase Edge Function plus an email provider would be the next step.
- The 3D shoe is a stylised model built in code, not a scanned product model.
- Seed photos come from Unsplash and show real-brand sneakers as placeholders. Replace them with your own images through the admin.
- Single admin role. There are no per-admin permissions or audit log.
- Waitlist spam protection is a honeypot plus validation only. There is no rate limiting or CAPTCHA.

## Credits
Product photography: [Unsplash](https://unsplash.com). Fonts: Google Fonts (Fredoka, Anton, DM Sans). Design references: "Mochi" and "Soleship" concept shots in `docs/references/`.
