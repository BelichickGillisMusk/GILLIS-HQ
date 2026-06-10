# CLAUDE.md — Virtual Office Hub

## This repo is ONLY for the Virtual Office Hub application.

Do **not** add Cloudflare Workers, law firm sites, or any other client projects here.  
Do **not** add Silverback AI content, Chicbu Law content, or Operation-Get-Shit-Done content.

---

## What This Repo Contains

A React + TypeScript + Vite application: an intelligent AI office management system with smart task delegation, agent coordination, cost tracking, and cross-department collaboration.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui  
**Deployment:** Spark / cloud agent environment  
**NOT deployed to:** Cloudflare, Vercel, or Google Cloud

---

## Development

```bash
npm install --legacy-peer-deps
npm run dev      # local dev server (port 5000)
npm run build    # production build
```

### GitHub Spark auth (`GITHUB_TOKEN`)

Samantha chat and `useKV` persistence call GitHub Spark proxies during `npm run dev`. Without a token, the UI loads but LLM/KV requests return **401**.

**Local setup**

1. Copy `.env.example` → `.env.local`
2. Set `GITHUB_TOKEN` to a PAT with Spark runtime + GitHub Models access
3. Run `npm run dev` — Vite loads `.env.local` automatically

**Cursor Cloud agents**

Add a secret named exactly **`GITHUB_TOKEN`** in the agent environment (not a custom name like `Samantha`). The Spark Vite plugin only reads `GITHUB_TOKEN`.

**GitHub repository (Actions / shared dev)**

Repo admins: **Settings → Secrets and variables → Actions → New repository secret** → name `GITHUB_TOKEN`, paste the same PAT. Use it in workflows with `${{ secrets.GITHUB_TOKEN }}` or expose to Codespaces if your org supports that.

Do **not** commit tokens to this repo. `.env` and `.env.local` are gitignored.

---

## Key Files

```
src/
├── App.tsx                  ← root component
├── components/
│   ├── AgentChat.tsx        ← agent conversation interface
│   ├── AgentDetailPanel.tsx ← agent details and workload
│   ├── HRDashboard.tsx      ← HR department view
│   ├── LotionPanel.tsx      ← unified project dashboard
│   ├── OfficeScene.tsx      ← main office layout
│   ├── TeamManagement.tsx   ← team and agent management
│   └── ...
```

---

## DO NOT

- Do not add Cloudflare Worker files (`worker.js`, `wrangler.toml`) here
- Do not add Vercel config (`vercel.json`) here
- Do not add other client or project code here
- Do not commit `.env` files or API keys

---

## Related Repos in the Organization

Each project has its own dedicated repo:

| Repo | Purpose | Platform |
|------|---------|----------|
| `BelichickGillisMusk/chicbu-law` | Chicbu Law website | Cloudflare Workers |
| `BelichickGillisMusk/github` | Silverback AI workers monorepo | Cloudflare Workers |
| `BelichickGillisMusk/silverbackai.agency` | Silverback AI site | Cloudflare / other |
| `BelichickGillisMusk/Operation-Get-Shit-Done` | Silverback ops homepage | Vercel (Next.js) |
| `BelichickGillisMusk/the-unit` | Agent command center | Various |
