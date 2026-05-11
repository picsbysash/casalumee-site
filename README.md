# Cherry Content — Website

Creative growth studio website. Built as a static site for fast loading, strong SEO/AEO, and a simple "add a photo → commit → live in 60 seconds" workflow.

**Tagline:** Intelligent Strategy. Global Impact.
**Stack:** Plain HTML + CSS + vanilla JS · Netlify hosting · GitHub source · Netlify Forms.

---

## Folder structure

```
cherry-content-site/
├── index.html              # Home (hero, services, work, FAQ, contact)
├── about.html              # About page (founders, story, principles)
├── thank-you.html          # Form-submission landing page
├── robots.txt              # Crawler permissions (incl. AI crawlers)
├── sitemap.xml             # Site index for search engines
├── netlify.toml            # Netlify config (headers, redirects, caching)
├── .gitignore
├── README.md               # ← you are here
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/                 # Logo, favicon, OG image
│   └── favicon.svg
└── images/
    ├── work/               # Drop case-study photos here
    ├── portfolio/          # Drop portfolio photos here
    └── team/               # Drop team photos here
```

---

## Adding photos (the easy workflow)

This is the everyday loop you asked for: **drop a photo → push → live in ~60 seconds**.

### Step 1 — Drop your photos in the right folder

| Use | Folder |
|---|---|
| Case study covers (Work section) | `images/work/` |
| Portfolio shots (Content Architecture panel) | `images/portfolio/` |
| Team photos (About page) | `images/team/` |

**Naming convention:** lowercase, hyphens, no spaces. Example: `pics-by-sash-hero.jpg`, `client-02-cover.webp`.

### Step 2 — Reference the photo in HTML

Open `index.html` (or `about.html`), find the placeholder `<div class="img-slot">…</div>`, and replace it with the image:

```html
<!-- BEFORE -->
<div class="img-slot">Editorial · Slot 01</div>

<!-- AFTER -->
<div class="img-slot filled">
  <img src="/images/portfolio/editorial-01.jpg" alt="Editorial campaign — Brand X, autumn collection" loading="lazy" width="800" height="600">
</div>
```

**SEO tip:** always write a descriptive `alt` attribute. It feeds search engines AND AI engines like ChatGPT and Perplexity.

### Step 3 — Push to GitHub

```bash
cd "~/Documents/Claude/Claude-PBS Automation/cherry-content-site"
git add .
git commit -m "Add: editorial portfolio shots"
git push
```

Netlify watches the repo and auto-deploys in 30–60 seconds.

---

## First-time setup (one-off, ~10 minutes)

### A) Create the GitHub repo

```bash
cd "~/Documents/Claude/Claude-PBS Automation/cherry-content-site"

# Initialise local repo
git init
git add .
git commit -m "Initial: Cherry Content site scaffold"

# Create the repo on GitHub (via web: github.com/new) — call it "cherry-content-site"
# Then connect and push:
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USER/cherry-content-site.git
git push -u origin main
```

### B) Connect Netlify (free tier is fine)

1. Go to **app.netlify.com** → **Add new site** → **Import from Git**.
2. Choose **GitHub**, authorise, pick `cherry-content-site`.
3. Build settings:
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
4. Click **Deploy site**. You get a temporary URL like `cherry-content-xyz.netlify.app`.

### C) Connect your custom domain

1. In Netlify: **Domain settings → Add custom domain** → `cherrycontent.com.au` (or whatever you've registered).
2. Netlify will give you DNS instructions — point your domain's nameservers (or A/CNAME records) to Netlify.
3. Netlify auto-provisions a free SSL certificate.

### D) Enable Netlify Forms (route submissions to BOTH founders)

The form is already wired in `index.html` (the `data-netlify="true"` attribute). Netlify can't accept multiple notification recipients via HTML — they have to be configured in the dashboard after first deploy:

1. Push at least one test submission through the live form so Netlify registers it.
2. Netlify dashboard → **Forms** → click the `contact` form.
3. **Settings & usage → Form notifications → Add notification → Email notification**.
4. Recipient email: `sashank@cherrycontent.com.au` → **Save**.
5. Click **Add notification** again → repeat for `valentina@cherrycontent.com.au`.
6. (Optional) Add a Slack/Outgoing webhook as a third notification for instant pings.

Both addresses will now receive an email every time the form is submitted. You can also configure a custom email template and subject line from the same panel.

**Tip:** while you wait for DNS propagation on a new domain, you can use the temporary `*.netlify.app` URL Netlify gives you to send the test submission.

---

## SEO + AEO checklist (already done)

- ✅ Semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ✅ Single `<h1>` per page, sensible heading hierarchy
- ✅ Meta description, OG tags, Twitter card on every page
- ✅ JSON-LD structured data: `Organization`, `LocalBusiness`, `WebSite`, `Service`, `FAQPage`, `AboutPage`, `Person`
- ✅ FAQ section with `FAQPage` schema — eligible for AI answer-engine citations and Google rich results
- ✅ `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended (AEO)
- ✅ `sitemap.xml` submitted via robots.txt
- ✅ Canonical URLs on every page
- ✅ Mobile-first responsive, fast (no framework, no JS dependencies)
- ✅ Lazy-loading hint on image template
- ✅ Reduced-motion respected via media query

### Post-launch SEO actions (do these once)

1. Verify the site in **Google Search Console** → submit `sitemap.xml`.
2. Verify in **Bing Webmaster Tools** → submit `sitemap.xml`.
3. Add a **Google Business Profile** (City: Melbourne) and link `cherrycontent.com.au`.
4. Replace placeholder Instagram / LinkedIn URLs in the `Organization` schema in `index.html`.
5. Add a real `og-image.jpg` (1200×630px) to `/assets/` — currently referenced but not yet present.
6. Set up Google Analytics 4 (the GA4 service account from PBS can be reused).

---

## Things to update before going live

A search across `index.html` and `about.html` will surface these placeholders:

| Placeholder | Replace with |
|---|---|
| `cherrycontent.com.au` | Your real domain (currently the assumed one) |
| `sashank@cherrycontent.com.au` / `valentina@cherrycontent.com.au` | ✓ Already set — update if needed |
| `+61` (in LocalBusiness schema) | Real phone number |
| Instagram / LinkedIn URLs in JSON-LD | Real social URLs |
| `Client 02`, `Client 03` in Work section | Real case studies as they come live |
| `og-image.jpg` in `/assets/` | Real 1200×630 share image |
| Founder photos in About page (`.avatar` divs) | Real headshots in `/images/team/` |

---

## Local preview

To preview before pushing:

```bash
cd "~/Documents/Claude/Claude-PBS Automation/cherry-content-site"
python3 -m http.server 8080
# then open http://localhost:8080
```

Or just double-click `index.html` (most things will work; the contact form needs Netlify).

---

## Brand assets (placeholder)

The current favicon and the visual gradients use the brand palette:

| Token | Hex | Use |
|---|---|---|
| `--cherry` | `#7B1F2C` | Primary (logo body, CTAs, accents) |
| `--cherry-deep` | `#5E1622` | Button hover, depth |
| `--forest` | `#1F7A3A` | Secondary accent (leaf, success states) |
| `--ink` | `#0A0A0A` | Body copy, dark sections |
| `--paper` | `#FFFFFF` | Default background |
| `--paper-alt` | `#F5F1EC` | Alternating sections |

When the real logo files arrive, drop them into `/assets/` as:
- `logo.svg` (primary, full-colour)
- `logo-white.svg` (for dark backgrounds)
- `favicon.svg` and `favicon-32.png`
- `apple-touch-icon.png` (180×180)

Then update `<a class="nav-logo">` and the footer to `<img src="/assets/logo.svg" alt="Cherry Content">` if you want to swap the text mark for the real logo.

---

## Support

Maintained by Cherry Content. Edits via Claude / Cursor / VS Code — same Git workflow.
