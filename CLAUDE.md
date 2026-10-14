# AadiVed Yoga and Wellness: website build brief (Astro)

You are building the marketing site for **AadiVed Yoga and Wellness**, a women-owned holistic yoga and sound healing studio in Hinjawadi Phase 3, Pune. The homepage design is approved. Build it in Astro exactly as described here, matching `reference/homepage-mockup.dc.html` (open it as text; it is the approved design source with all inline styles, spacing and copy).

Work audit-first: read this whole file and the reference before writing code.

---

## 1. Stack and deploy

- **Astro 5** (latest stable), static output (`output: 'static'`). No React/Vue unless a component truly needs it; the mega menu uses a small vanilla `<script>`.
- Styling: plain CSS with custom properties in `src/styles/global.css` plus scoped `<style>` in components. No Tailwind.
- Fonts: self-host with `@fontsource` packages (`@fontsource/cormorant-garamond` 400/500/600 + italic 400/500, `@fontsource/jost` 300/400/500, `@fontsource/tiro-devanagari-hindi` 400). Do not load Google Fonts from the CDN.
- **Images: WebP only, everywhere.** Every image on the site (logos, photos, OG image, favicons where the format allows) is `.webp`. All source files in `public-assets/` are already WebP. Put them in `src/assets/images/` and render with `astro:assets` `<Image format="webp">` (or `<Picture formats={['webp']}>`). No JPG, PNG or AVIF output, no `<img>` pointing at other formats. Set this globally in `astro.config.mjs` too (`image: { service: { entrypoint: 'astro/assets/services/sharp' } }`, and always pass `format="webp"`). Explicit width/height on every image, `loading="lazy"` below the fold, hero image eager + `fetchpriority="high"`. Any new images added later must be converted to WebP first. Exception: `favicon.ico` / `apple-touch-icon` may be PNG only if a browser strictly needs it; otherwise WebP.
- `@astrojs/sitemap` for sitemap. Site URL placeholder: `https://aadived.com` (confirm before launch).
- Deploy target: **Cloudflare Pages**, build `npm run build`, output `dist`, `NODE_VERSION=20`. Repo goes under the `agencystringhead-wq` GitHub org.
- Git: feature branches + PRs into `main`, no direct commits to main. **No `Co-Authored-By` lines in commit messages.**

## 2. Folder structure

```
src/
  assets/images/        (copy everything from public-assets/ here, see section 9)
  components/
    UtilityBar.astro
    Header.astro          (logo, nav, CTA, mobile toggle)
    MegaMenu.astro        (Yoga & Healing panel)
    AboutDropdown.astro
    MobileNav.astro       (off-canvas / accordion menu for < 960px)
    Hero.astro
    TrustStrip.astro
    NameMeaning.astro
    ServiceCard.astro
    ServicesGrid.astro
    FormatsSplit.astro    (Studio vs Online)
    TeacherIntro.astro
    Steps.astro
    ReviewCard.astro
    Reviews.astro
    InstagramStrip.astro
    FinalCTA.astro
    Footer.astro
    Icon.astro            (inline stroke SVG icons by name)
    SectionHeading.astro  (eyebrow + h2 pattern used everywhere)
  data/
    site.ts               (NAP, phone, socials, hours, nav + mega menu structure)
    services.ts           (6 service cards + slugs)
    reviews.ts            (Google reviews)
  layouts/
    BaseLayout.astro      (head, SEO, schema, UtilityBar, Header, Footer)
  pages/
    index.astro
    (inner pages stubbed, see section 7)
  styles/global.css
```

All business details (phone, address, socials, nav items) live in `src/data/site.ts`. Components never hard-code them.

## 3. Design tokens

```css
:root {
  --olive: #4B5238;        /* brand, buttons, links, icons */
  --olive-deep: #2F3424;   /* utility bar, footer, headings on light */
  --ink: #23261C;          /* main text */
  --text-muted: #4A4E3E;   /* body copy on light grounds */
  --label: #5E634C;        /* eyebrows, captions */
  --ivory: #FBF8F2;        /* header, alternating sections, cards on sand */
  --sand: #F3EEE4;         /* page ground, alternating sections */
  --line: #E2DACB;         /* borders */
  --accent: #C9C6F2;       /* soft lavender, from the brand's Instagram */
  --accent-soft: #C9C6F266;
  --star: #B8862B;
  --footer-text: #DCD7C6;
  --footer-muted: #C9C4B2;

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'Jost', system-ui, sans-serif;
  --font-deva: 'Tiro Devanagari Hindi', serif;

  --container: 1240px;
  --gutter: 40px;          /* 20px under 960px */
  --section-y: 120px;      /* 72px under 768px */
  --radius-card: 22px;
  --radius-pill: 999px;
}
```

Type scale:
- Body: Jost 400, 17px, line-height 1.65.
- Eyebrow: Jost 500, 13px, uppercase, letter-spacing 0.22em, `--label`.
- H1: Cormorant 400, `clamp(48px, 6vw, 86px)`, line-height 1.02. One italic word in olive ("roots").
- H2: Cormorant 400, `clamp(36px, 4vw, 56px)`, line-height 1.08.
- H3 (cards): Cormorant 500, 28 to 34px.
- Quotes: Cormorant italic/regular 27 to 28px.

Shapes that define the look (keep them):
- Hero main image: arch, `border-radius: 240px 240px 24px 24px`, 440x560.
- Teacher image: inverted arch, `border-radius: 24px 24px 220px 220px`.
- Mega menu feature card: `border-radius: 180px 180px 18px 18px`.
- Pill buttons. Primary = olive fill, ivory text. Secondary = 1px olive outline.
- Soft lavender circle behind the hero image (`--accent`, 55% opacity).

Section background rhythm (top to bottom): ivory hero, olive trust strip, sand, ivory, sand, ivory, lavender-soft, ivory, sand, olive CTA, olive-deep footer.

## 4. Header + mega menu (most important part)

Modelled on sarasotasmiledesign.com: a utility bar, a tall header and a full-width mega menu.

**Utility bar** (olive-deep, 13.5px): pin icon + "Megapolis Serenity, Hinjawadi Phase 3, Pune", "Studio & online sessions" | phone `+91 82084 69389` (tel link), Instagram `@aadivedwellness`. Hide the secondary items under 960px.

**Header** (ivory, 116px tall, bottom border `--line`, sticky with a slight shadow after scroll):
- Left: full stacked logo `logo-full-olive.webp` at 88px height, linking home. Alt "AadiVed, Mind. Body. Soul". Shrink to ~64px when the header is in its scrolled state.
- Nav: About (dropdown) · Yoga & Healing (mega menu) · Online Classes · Reviews · Journal · Contact.
- Right: "Book a session" pill (links to `/contact/#book`).

**Mega menu "Yoga & Healing"**: full-width panel under the header, ivory, big soft shadow. 4 link columns + 1 feature card:

| Yoga | Mind & Sound | Wellness Programs | Ways to Join |
|---|---|---|---|
| Guided Yoga | Meditation | Hormonal Balance | Studio Sessions, Hinjawadi |
| Yoga for Beginners | Breathwork | Stress Management | Live Online Sessions |
| Experienced Practitioners | Sound Healing | Anxiety Relief | One-on-One Coaching |
| Prenatal Yoga (1:1) | Grounding Practices | Energy Reset | Plans & Pricing |
| Private Sessions | | Build a Daily Practice | All classes → |

Each column heading: 12px uppercase eyebrow with a small olive line icon. Feature card: arched image (`ig-yogaday.webp`) with gradient overlay, "New here?" (Cormorant italic) + "Start with a 1:1 intro session →".

**About dropdown**: links (Our Story & the Name, Meet Anupriya, Credentials (500-hr RYT), The Studio) next to a pull quote: "Aadi" means beginning. "Ved" means knowledge. A return to the roots of wellbeing.

Behaviour:
- Opens on hover (desktop, with ~120ms close delay so diagonal mouse moves don't close it) AND on click/Enter/Space of the trigger `<button>`.
- `aria-expanded` and `aria-controls` on triggers. Esc closes and returns focus to the trigger. Click outside closes. Only one panel open at a time.
- Under 960px: nav hides, a 46px round hamburger button opens `MobileNav`, a full-height panel where each mega menu column becomes an accordion. Lock body scroll while it is open.
- Respect `prefers-reduced-motion` (no slide/fade).

## 5. Homepage sections (in order, copy is final)

1. **Hero**: eyebrow "Holistic Yoga & Sound Healing · Hinjawadi, Pune". H1 "A return to the *roots* of wellbeing." Paragraph: "Guided yoga, meditation and sound healing, rooted in ancient Indian wisdom and built for modern lives. Ease stress, restore hormonal balance, and find a calm that carries off the mat." Buttons "Book your first session" (primary) and "Explore classes" (secondary, `#classes`). Rating row: 5 gold stars, "**5.0** on Google · Women-led studio · 500-hr Yoga Alliance certified". Right: arched `ig-yogaday.webp` + overlapping small card `ig-sanskrit.webp` with a 6px ivory border.
2. **Trust strip** (olive, 4 items with icons): 500-hr Yoga Alliance certified · Women-owned & women-led · Studio & online sessions · Beginners to experienced.
3. **Name meaning**: big Devanagari "आदि" + "वेद" (Tiro Devanagari, 120px, olive) with labels "Aadi · Beginning" / "Ved · Knowledge". Right: eyebrow "Our name, our way", H2 "Deeply rooted. Gently guided.", paragraph, "Read our story →".
4. **Services** (`id="classes"`): eyebrow "Classes & healing", H2 "Ways we practice together", "View all classes →". 6 cards from `services.ts` (Guided Yoga, Meditation & Breathwork, Sound Healing, Hormonal Balance, Stress & Anxiety Relief, Prenatal Yoga (1:1)), each with a 60px tinted icon circle, title, text, "Learn more →". Grid `repeat(auto-fit, minmax(330px, 1fr))`, gap 24. Card hover lifts 3px.
5. **Formats split**: H2 "In the studio, or from your own mat". Studio card (ivory, needs a real studio photo, use a labelled placeholder until supplied) + Online card (olive, `ig-guided.webp`).
6. **Teacher**: inverted-arch image `ig-mono.webp`. Eyebrow "Meet your teacher", H2 "**Anupriya**", line "Founder · 500-hour Yoga Alliance Registered Practitioner", bio paragraph, pull quote from a review, 3 stats (500 training hours RYT · 5.0 Google rating · 1:1 prenatal & private care).
7. **Steps** (lavender-soft ground): "Three gentle steps": 01 Reach out · 02 Find your fit · 03 Begin, and keep going.
8. **Reviews**: H2 "Loved in Hinjawadi", big "5.0 / Average rating on Google Reviews". 3 cards from `reviews.ts`. Each card: stars, quote, "Verified Google review" + "View on Google →" linking to the review URL. "Read all reviews on Google →" below.
9. **Instagram strip**: H2 "@aadivedwellness", "Follow on Instagram" button, 4 tiles (3:4) linking to the profile.
10. **Final CTA** (`id="book"`, olive, two faint outline circles as decoration): large white logo `logo-full-white.webp` (150px tall), H2 "Begin with *AadiVed.*", paragraph, buttons "Book a session" (ivory) + "Call +91 82084 69389" (outline).
11. **Footer** (see section 6).

Copy all exact text from the reference file. Don't invent new claims, stats or services.

## 6. Big footer

olive-deep ground, 15.5px text.
- Top row: "Calm, delivered gently to your inbox." + sub line, then email field + "Subscribe" pill. Wire the form to a placeholder action for now (JotForm or a Cloudflare Worker later; leave a `TODO`).
- 5 columns: **Brand** (white logo 170px, short blurb, round icon links: Instagram, Google profile, WhatsApp `https://wa.me/918208469389`) · **Yoga** · **Healing & Wellness** · **The Studio** (Our Story, Meet Anupriya, Online Classes, Plans & Pricing, Reviews, Journal, Contact) · **Visit** (address 3 lines, phone, class timings placeholder, "Get directions →" to Google Maps).
- Bottom bar: "© {current year} AadiVed Yoga and Wellness. All rights reserved." · Privacy · Terms · Sitemap · "Website by wwiser" (lowercase).

## 7. Pages and routes

Build the homepage fully. Create the routes below with BaseLayout, a simple page hero (eyebrow + H1 + intro) and a "Content coming soon" block, so the mega menu has no dead links:

```
/about/  /about/anupriya/
/yoga/guided-yoga/  /yoga/beginners/  /yoga/experienced/  /yoga/prenatal/  /yoga/private-sessions/
/healing/meditation/  /healing/breathwork/  /healing/sound-healing/  /healing/grounding/
/programs/hormonal-balance/  /programs/stress-management/  /programs/anxiety-relief/  /programs/energy-reset/  /programs/daily-practice/
/studio/  /online-classes/  /one-on-one/  /pricing/  /classes/
/reviews/  /journal/  /contact/  /privacy/  /terms/
```

Generate the service pages from `services.ts`/`site.ts` with dynamic routes rather than copy-pasting files.

## 8. SEO, schema, accessibility, performance

- Per-page `<title>` and meta description via BaseLayout props. Homepage title: "AadiVed Yoga and Wellness | Yoga & Sound Healing in Hinjawadi, Pune".
- Open Graph + Twitter tags. OG image: build one 1200x630 from the olive logo on `--olive`.
- JSON-LD on the homepage: `HealthClub` (LocalBusiness subtype) with name, address (Megapolis Serenity, Phase 3, Rajiv Gandhi Infotech Park, Hinjawadi, Pune, Maharashtra 411057, IN), telephone `+91-82084-69389`, `sameAs` Instagram, `founder` Person "Anupriya", `aggregateRating` 5.0 / 3 reviews. Also `WebSite` and `BreadcrumbList` on inner pages.
- `lang="en-IN"`. Favicon from `icon-olive.webp` (generate 32/180/512 sizes + SVG-free fallback).
- Accessibility: real `<button>`/`<a>`, visible focus rings (2px olive outline + offset), skip-to-content link, all touch targets ≥ 44px, text contrast ≥ 4.5:1 (the tokens above pass, don't lighten them), decorative SVGs `aria-hidden="true"`, star ratings `role="img" aria-label="5 out of 5 stars"`.
- Performance target: Lighthouse 95+ on mobile. No layout shift from fonts (`font-display: swap` + size-adjusted fallback) or images (explicit dimensions).

## 9. Assets (in `public-assets/`)

| File | Use |
|---|---|
All files are WebP (logos are lossless WebP with transparency).

| File | Use |
|---|---|
| `logo-full-olive.webp` | Header logo (transparent, olive) |
| `logo-full-white.webp` | Final CTA + footer (transparent, white) |
| `icon-olive.webp` / `icon-white.webp` | Meditating figure only: favicon, small marks |
| `logo-original.webp` | Original square logo on olive (OG image base, social) |
| `ig-yogaday.webp` | Hero main arch, mega menu card |
| `ig-sanskrit.webp` | Hero small card |
| `ig-mono.webp` | Teacher section |
| `ig-guided.webp` | Online card, Instagram strip |

**Important:** the `ig-*.webp` files are low-res crops (~280x370) from an Instagram screenshot, used only so the build looks right. Keep the filenames, mark each usage with `// TODO: replace with original high-res photo`, and list them in the README so the client can swap in originals from the Instagram account. A real studio photo is also still needed.

## 10. Content rules

- No em dashes anywhere in copy or titles. Use commas, colons or the middle dot ·.
- No AI filler words (leverage, utilize, comprehensive, robust, delve, seamless, elevate).
- Indian English spelling (practise as verb is fine either way, but keep "colour", "centre" if they appear).
- No made-up statistics, prices, class times or extra yoga styles. Use visible placeholders like `[Class timings to confirm]` and `[Price]`.

## 11. Open items (leave TODOs, don't guess)

- Class timings (Google lists "Open 24 hours", which needs confirming).
- Pricing.
- Real studio photo + high-res Instagram originals.
- Whether the number is on WhatsApp.
- Final domain.
- Newsletter/booking form provider.

## 12. Definition of done

- `npm run build` passes with zero errors and warnings.
- `dist/` contains no .jpg, .jpeg, .png or .avif files (check with a find command).
- The homepage matches the reference at 1440px, 1024px, 768px and 390px widths.
- Mega menu works with mouse, keyboard (Tab, Enter, Esc) and touch.
- Every nav/footer link resolves (no 404s).
- README lists the open items and how to deploy to Cloudflare Pages.
