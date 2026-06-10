# CLAUDE.md — Chicbu Law Worker

## This repo is ONLY for the Chicbu Law website.

Do **not** add any other projects, workers, or unrelated code here.  
Do **not** add Silverback AI, Operation-Get-Shit-Done, or any other client's code.

---

## What This Repo Contains

A single **Cloudflare Worker** (`worker.js`) that serves the full Chicbu Law website, including:

- Homepage with SEO, LegalService schema, and practice areas
- `/blog` — blog article index
- `/blog/:slug` — individual blog posts
- `/sitemap.xml` — XML sitemap for search engines
- `/robots.txt` — crawl directives

**Deployment:** Cloudflare Workers (not Vercel, not Google Cloud Run)  
**Domain:** chicbulaw.com  
**Account ID:** bafa242dd95d3fdce72540d20accd0a2

---

## How to Update Content

### Update firm info (name, phone, address, attorney name)
Edit the `SITE` constant at the top of `worker.js`.

### Add a blog post
Add a new object to the `BLOG_POSTS` array in `worker.js`:
```js
{
  slug: 'your-post-url-slug',         // URL: /blog/your-post-url-slug
  title: 'Your Post Title',
  date: '2026-05-01',                 // ISO date string
  excerpt: 'Short summary...',
  body: `<p>Full HTML content...</p>`,
  tags: ['Tag One', 'Tag Two'],
}
```
Then push to `main` — GitHub Actions auto-deploys.

### Update the domain
1. Edit the `routes` section in `wrangler.toml` with the real domain
2. Edit `SITE.domain` in `worker.js`
3. Push to `main`

---

## Deployment

Auto-deploys on every push to `main` via GitHub Actions.  
Manual deploy:
```bash
npx wrangler deploy
```
Requires `CLOUDFLARE_API_TOKEN` secret set in repo Settings → Secrets.

---

## Required GitHub Secret

| Secret name             | Where to get it                                        |
|-------------------------|--------------------------------------------------------|
| `CLOUDFLARE_API_TOKEN`  | Cloudflare Dashboard → My Profile → API Tokens        |

The token needs **Workers Scripts: Edit** permissions on the account.

---

## DO NOT

- Do not add a `package.json` or `node_modules` — this worker has zero dependencies
- Do not add Vercel config (`vercel.json`) — this is Cloudflare only
- Do not commit `.env` or API keys — use Cloudflare secrets for sensitive values (`wrangler secret put KEY_NAME`)
- Do not add unrelated projects to this repo
