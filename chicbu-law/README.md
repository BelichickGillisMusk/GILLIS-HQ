# Chicbu Law — Cloudflare Worker

Professional law firm website deployed as a Cloudflare Worker.  
Zero dependencies · Full SEO · LegalService schema · Blog included.

---

## Quick Start (5 Steps)

### Step 1 — Create a new GitHub repo

Create a **new, empty, public or private repo** at:  
`https://github.com/BelichickGillisMusk/chicbu-law`

Then copy the contents of this `chicbu-law/` folder into the **root** of that new repo.

> ⚠️ The `.github/workflows/` folder must be at the repository root, not inside another folder.

---

### Step 2 — Fill in the firm details

Open `worker.js` and update the `SITE` constant near the top:

```js
const SITE = {
  name: 'Chicbu Law',              // ← firm name
  domain: 'chicbulaw.com',         // ← real domain
  phone: '(555) 000-0000',         // ← real phone
  email: 'contact@chicbulaw.com',  // ← real email
  address: { ... },                // ← real address
  attorney: { name: '...', ... },  // ← attorney name and bar number
  ...
};
```

---

### Step 3 — Set the domain in wrangler.toml

Open `wrangler.toml` and update the routes:

```toml
routes = [
  { pattern = "chicbulaw.com",     custom_domain = true },
  { pattern = "www.chicbulaw.com", custom_domain = true }
]
```

Your domain must already be on Cloudflare (orange-cloud). If it was recently moved to Cloudflare, give DNS up to 24 hours to propagate.

---

### Step 4 — Add the Cloudflare API token to GitHub

1. Go to [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Create a token with **Workers Scripts: Edit** permission for your account
3. In the new GitHub repo, go to **Settings → Secrets and variables → Actions**
4. Add a secret named `CLOUDFLARE_API_TOKEN` with the token value

---

### Step 5 — Push and deploy

```bash
git add .
git commit -m "Initial Chicbu Law worker"
git push origin main
```

GitHub Actions will automatically deploy to Cloudflare Workers on every push to `main`.  
You can also trigger a manual deploy from the **Actions** tab.

---

## Pages Included

| Route | Description |
|-------|-------------|
| `/` | Homepage: hero, practice areas, attorney bio, blog preview, contact |
| `/blog` | Blog article index |
| `/blog/:slug` | Individual blog post |
| `/sitemap.xml` | XML sitemap (auto-includes all blog posts) |
| `/robots.txt` | Search engine crawl directives |

---

## SEO & Schema

Each page includes:
- Unique `<title>` and `<meta description>`
- Open Graph and Twitter Card tags
- Canonical URL
- `LegalService` JSON-LD schema on the homepage (attorney, address, practice areas)
- `Article` JSON-LD schema on each blog post

---

## Adding Blog Posts

Open `worker.js` and add an entry to `BLOG_POSTS`:

```js
{
  slug: 'url-friendly-slug',
  title: 'Article Title',
  date: '2026-05-01',
  excerpt: 'Short summary shown on the blog index and in meta descriptions.',
  body: `
    <p>Full article content as HTML.</p>
    <h2>Section Heading</h2>
    <p>More content...</p>
  `,
  tags: ['Practice Area', 'Topic'],
}
```

Push to `main` — the worker auto-deploys and the new post appears at `/blog/url-friendly-slug`. The sitemap updates automatically.

---

## Manual Deploy (No GitHub Actions)

```bash
cd chicbu-law
npx wrangler deploy
```

Requires [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed and authenticated:
```bash
npx wrangler login
```

---

## Project Structure

```
chicbu-law/
├── worker.js                          ← entire site (router + pages + styles)
├── wrangler.toml                      ← Cloudflare Worker config
├── CLAUDE.md                          ← AI coding assistant guard rails
├── README.md                          ← this file
└── .github/
    └── workflows/
        └── deploy-chicbu-law.yml      ← auto-deploy on push to main
```
