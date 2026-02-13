# LIAM MVP — Project Guide

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Prisma + SQLite (local-first, no external services)
- Zod for input validation
- Custom cookie-based auth (email + password, bcrypt)
- Payment: simulated stablecoin checkout (DB-only, no real blockchain)

## Commands
- `npm run dev` — start dev server
- `npx prisma db push` — apply schema to SQLite
- `npx prisma db seed` — seed demo data
- `npm test` — run tests (vitest)

## Conventions
- App Router: all pages in `src/app/`
- Server actions in `src/app/actions/`
- Shared components in `src/components/`
- DB/Prisma client in `src/lib/db.ts`
- Business logic (tiers, percentiles) in `src/lib/`
- Zod schemas in `src/lib/validators.ts`

## Design System

Source: `style guide deck` (49-page PDF by Yichen "Ean" Shen / Essiivi.com)

### Color Palette

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Emphasis | Black | `#080708` | Logo, headings, primary text, nav bar backgrounds |
| Secondary | Blue | `#1c74f4` | Links, interactive accents, secondary buttons, "Sell" CTA variant |
| Secondary | Red | `#e20031` | Alerts, destructive actions, "Buy" CTA variant, emphasis badges |
| Main | Yellow | `#ffc600` | Primary CTA buttons, banners, hero backgrounds, highlight bars |
| Secondary | Light Yellow | `#ffd677` | Hover states, softer accents, secondary highlights |
| Neutral | Light Grey | `#ededed` | Borders, dividers, disabled states, card backgrounds |
| Background | Off-White | `#fcfcfc` | Page background, content areas |

**Additional palette colors** (from extended swatch grid on p33): orange, teal/green, sky blue, light blue, purple, dark navy, black, forest green — used sparingly as accent/category colors.

### Typography

**Dual-typeface system:**

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | **Skia Bold** | Bold | Hero headlines, special emphasis moments, brand expression |
| Title / Headings | **Kohinoor Bangla** | Bold | Section titles, card titles, nav labels, all UI headings |
| Body | **Kohinoor Bangla** | Regular | Body text, descriptions, form labels, metadata |

**Web substitutions** (since Skia is macOS-only and Kohinoor Bangla has limited web availability):
- Display: Use `"Skia", "Arial Black", system-ui, sans-serif` — or substitute with a bold condensed geometric sans like **Inter** or **Plus Jakarta Sans** (Extra Bold) for display
- Title/Body: Use `"Kohinoor Bangla", "Inter", system-ui, sans-serif` — **Inter** is the recommended web fallback for its similar geometric clarity

**Type scale (recommended for MVP):**
- Display/Hero: 48–64px, bold, tight tracking
- H1: 32–40px, bold
- H2: 24–28px, bold
- H3: 18–20px, bold
- Body: 16px, regular, 1.5 line-height
- Small/Meta: 13–14px, regular
- Caption/Badge: 11–12px, bold uppercase

### Layout System

- **12-column grid** (p36)
- **Divided by 3** (4-col groups): used for 3-panel layouts (p37)
- **Divided by 4** (3-col groups): used for 4-panel card grids (p38)
- **Layout modes:**
  - *All-over*: uniform 4-column card grid with nav bar (p39) — use for card browsing/feed
  - *Figure-dominant*: large hero (9-col) + sidebar (3-col), smaller cards below (p40) — use for video landing page
  - *Dynamic*: asymmetric mixed-size blocks (p41) — use for profile/dashboard layouts
- **Container**: max-width ~1200px centered, with consistent gutter (~16–24px)
- **Spacing scale**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)

### Component Styles

**Buttons:**
- **Primary CTA**: Yellow (`#ffc600`) background, black text, bold weight, rounded corners (~6–8px radius), no border. Used for main actions ("Try Now", "Okay", "Contribute")
- **Secondary CTA**: Blue (`#1c74f4`) background, white text, same radius. Used for secondary actions ("Sell")
- **Destructive/Alert**: Red (`#e20031`) background, white text. Used for "Buy" or alert actions
- **Ghost/Outline**: Transparent with dark border, used for tertiary actions ("Upload")
- **Button sizing**: Generous horizontal padding (24–32px), height ~40–48px
- **Hover**: Slight brightness shift or use lighter variant (e.g., `#ffd677` for yellow hover)

**Cards (content tiles):**
- Rectangular, slight rounding (~4–8px radius)
- Image/video thumbnail fills top portion
- Bottom overlay or strip: title, creator name, metadata (copies, time ago)
- Badge in corner: contribution count (e.g., "23K") in bold
- "OWN" badge: yellow background, black text, small pill shape
- Bold dark outlines on some card variants (graffiti-inspired layered look)
- Stacked/layered shadow effect on collectible cards (offset border behind)

**Navigation bar:**
- Yellow (`#ffc600`) background, full width
- Hamburger menu left, LIAM logo (black), nav links center ("Channels", "Messages", "Collection"), "Log In" link
- Search bar right side
- Icon row far right (small utility icons)

**Forms/Inputs:**
- Clean bordered inputs, subtle rounded corners (~4–6px)
- Black text on white/off-white background
- Focus state: blue (`#1c74f4`) border

**Banner/Toast:**
- Full-width yellow bar with body text left, CTA button right
- Used for announcements, prompts, info strips

### Shapes & Graphic Devices

- **Primary shapes**: Rectangles and lightly rounded rectangles for all UI containers
- **Accent shapes**: Spiky, irregular star/burst shapes for brand personality (used in logo variants, decorative elements — NOT in core UI containers)
- **Layered blocks**: Stacked/offset color rectangles evoking "collectible" feeling — bold outlines inspired by graffiti culture
- **Card layering**: Yellow blocks with dark outlines, sometimes with blue accent overlays — creates depth and collectible energy
- **Logo variants**:
  - "Main": Bold block LIAM wordmark, black
  - "Star": LIAM with 4-point star replacing the dot in "i"
  - "Star II": Evolved star variant with pointed star in A
  - Used on light and dark backgrounds, also reversed (white on grey)

### Overall Vibe

**Bold, collectible, subcultural energy meets clean digital product.** The aesthetic channels graffiti culture, trading-card collecting, and modern streaming platforms — vibrant yellows and blacks dominate, with blue and red as action colors. The UI is structured and grid-based but injects personality through layered card shapes and bold typography. It feels like a streetwear-meets-Netflix for video collectibles — approachable, not "crypto-bro."

### Design Rules for MVP Implementation

1. **Yellow is king**: Primary CTAs, banners, nav bar, and highlight elements use `#ffc600`
2. **Black for authority**: Logo, headings, emphasis text use `#080708`
3. **White space is generous**: Off-white background (`#fcfcfc`), clean breathing room
4. **Cards are the core UI element**: Everything revolves around collectible card tiles
5. **Bold typography**: Headings are always bold, display text is extra bold
6. **Minimal border-radius**: 4–8px, never fully round (except avatars)
7. **No gradients**: Flat color blocks only
8. **Layered depth**: Use subtle offset shadows or stacked borders on featured cards
9. **Grid-first**: 12-column grid, responsive down to single column on mobile
10. **Keep it clean**: Despite the subcultural energy, the UI itself is structured and readable
