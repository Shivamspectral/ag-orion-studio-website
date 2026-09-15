# AG Orion Studio - official website

Production-ready Next.js (App Router) website for **AG Orion Studio**, an independent app and game development/publishing studio. Content is fully separated from presentation: apps, games, releases, branding, SEO and advertising authorization all live in typed content files and can be overridden from a secured admin dashboard backed by PostgreSQL.

## Stack

- Next.js 16 (App Router, React Server Components, ISR) + TypeScript
- Tailwind CSS 4 with a dark-first design system (`src/app/globals.css`)
- PostgreSQL via Drizzle ORM (`src/db`)
- Zod for all server-side validation

## Where things live

| Purpose | Location |
| --- | --- |
| Brand (logo, favicon, icons, OG image, colors), hero/about copy, contact channels, social links, navigation | `src/config/site.ts` |
| Content types (App, Game, Release, Screenshot, StoreLink, AdConfiguration, SEOConfiguration, ContactInformation) | `src/content/types.ts` |
| Games | `src/content/games.ts` |
| Apps | `src/content/apps.ts` |
| Per-app app-ads.txt configuration | `src/content/ads.ts` |
| Privacy policy / terms | `src/content/legal.ts` |
| Content access layer (file content + database overrides) | `src/lib/content.ts` |
| SEO helpers and schema.org builders | `src/lib/seo.ts` |
| ads.txt / app-ads.txt generation + validation | `src/lib/ads.ts` |
| Admin auth (HMAC-signed HttpOnly cookie) | `src/lib/auth.ts`, `src/lib/session.ts`, `src/proxy.ts` |
| Server actions (admin + contact form) | `src/lib/actions/` |
| Brand assets | `public/brand/` |
| Product artwork | `public/images/apps/<slug>/`, `public/images/games/<slug>/` |

### Adding an app or game

Append one object to `src/content/apps.ts` or `src/content/games.ts` (or create it in **Admin → Apps & games**). The detail page, listing card, sitemap entry, metadata, Open Graph tags, structured data, footer links, per-app `/<slug>/ads-txt/` page and short URL `/<slug>/` are generated automatically.

### Replacing the logo, favicon or social image

Drop the new files into `public/brand/` and update the paths in `src/config/site.ts` → `brand` (or Admin → Studio settings). Nothing else references those files.

## Routes

- `/`, `/apps/`, `/games/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/sitemap/`
- `/apps/<slug>/`, `/games/<slug>/` - canonical product pages
- `/<slug>/` → 308 redirect to the canonical product page
- `/<slug>/ads-txt/` - human-readable advertising authorization info (noindex)
- `/app-ads.txt` - official machine-readable file for **app** inventory (plain text, generated from production ad configs)
- `/ads.txt` - **website** inventory; served only when enabled in settings, otherwise a plain-text 404
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`
- `/admin/` - protected dashboard (noindex, blocked in robots.txt)

## Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | production | Canonical origin, e.g. `https://agorionstudio.com` (no trailing slash) |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_BUSINESS_EMAIL` | no | Public contact addresses; leave empty to route everything through the contact form |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` / `NEXT_PUBLIC_ANALYTICS_ID` | no | `gtag` (GA4) or `plausible`; nothing loads without an ID |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | for admin | Admin is disabled unless both are set (secret ≥ 16 chars) |
| `CONTACT_IP_SALT` | no | Salt for hashed IPs used in rate limiting |

Secrets are only read on the server. Nothing sensitive is shipped to the browser.

## Advertising authorization (app-ads.txt)

- Publisher IDs are **never** invented. Template records ship with an empty `publisherId` and are ignored until you fill them in (Admin → Advertising, or `src/content/ads.ts`).
- Each app has independent **production** (published) and **draft** (never published) record sets. "Promote draft → production" copies the draft and stamps the date.
- The root `/app-ads.txt` is the union of all valid production records across ad-enabled apps. Only syntactically valid lines are written.

## Development

```bash
npm install
npx drizzle-kit push   # create tables
npm run dev
```

## Deployment (Vercel)

1. Create a PostgreSQL database and set `DATABASE_URL`.
2. Set `NEXT_PUBLIC_SITE_URL` to the production domain, plus `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`.
3. Run `npx drizzle-kit push` against the production database once.
4. Deploy. Public pages are statically generated and revalidated every 5 minutes; admin edits revalidate immediately.
