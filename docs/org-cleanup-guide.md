# Organization Cleanup Guide

This guide documents the current state of the BelichickGillisMusk GitHub organization
and the recommended steps to keep projects clean and separated.

---

## The Core Problem

AI coding tools (Claude Code, Copilot, etc.) default to the currently open repository.
If you're working on a Cloudflare Worker and the virtual-office-hub repo happens to be
open, the code lands in the wrong place. The solution is:

1. One project = one repo (never mix projects in the same repo)
2. Every repo has a `CLAUDE.md` that explicitly states what belongs there
3. Open **only the relevant repo** when working on a project

---

## Current Repo Inventory

### ✅ Clean / Single Purpose

| Repo | What It Is | Platform |
|------|-----------|----------|
| `virtual-office-hub` | AI office management app | Spark/cloud |
| `Operation-Get-Shit-Done` | Silverback AI ops homepage | Vercel (Next.js) |
| `silverbackai.agency` | Silverback AI marketing site | Cloudflare / other |
| `AI-Studio-for-Silverback` | Silverback AI post-to-site tool | Various |
| `briefs` | Morning/night meeting briefs | JavaScript |
| `the-unit` | Agent command center / registry | Various |

### ⚠️ Needs Cleanup

| Repo | Problem | Action |
|------|---------|--------|
| `github` | Contains 6+ different Cloudflare Worker projects + a full React app | Split into individual repos (see below) |
| `gia-silverback-claude` | Mixed: Silverback HTML pages + DMC splash + a rent roll HTML doc + ZIP files | Clean out misplaced files; archive or reorganize |
| `BelichickGillisMusk-belichick-margo-jesus` | 8 skills but unclear scope | Review and add CLAUDE.md |
| `Claude-code-chats-and-project-list` | Unclear purpose | Review and add CLAUDE.md or archive |

---

## Step-by-Step: Split the `github` Repo

The `github` repo currently contains these workers that should each be their own repo:

| Worker folder | Suggested repo name | Domain / Purpose |
|---------------|--------------------|----|
| `workers/silverbackai` | `silverbackai-worker` | silverbackai.agency homepage |
| `workers/silverbackai-toolkit` | `silverbackai-toolkit-worker` | AI tools catalog |
| `workers/security-silverbackai` | `security-silverbackai-worker` | Security dashboard |
| `workers/cleantruckcheckstockton` | `cleantruckcheckstockton-worker` | CARB emissions testing |
| `workers/norcalcarbmobile` | `norcalcarbmobile-worker` | NorCal CARB mobile |
| `workers/dmc-properties` | `dmc-properties-worker` | Property management |

### How to split one worker into its own repo (repeat for each):

1. **Create a new GitHub repo** at `https://github.com/new`
   - Name: e.g., `cleantruckcheckstockton-worker`
   - Private or Public (match your current preference)
   - No README, no .gitignore (you'll add files manually)

2. **Copy files** from the `github` repo into the new repo root:
   ```
   workers/cleantruckcheckstockton/worker.js   → worker.js
   workers/cleantruckcheckstockton/wrangler.toml → wrangler.toml
   ```

3. **Copy the GitHub Actions workflow** from `.github/workflows/deploy-stockton-worker.yml`
   into the new repo at `.github/workflows/deploy.yml`.
   Update the `workingDirectory` line — since `worker.js` is now at the root, change it to:
   ```yaml
   workingDirectory: .
   ```
   Or remove the `workingDirectory` line entirely (Wrangler defaults to the current directory).

4. **Add `CLOUDFLARE_API_TOKEN`** secret to the new repo:
   Settings → Secrets and variables → Actions → New repository secret

5. **Add a `CLAUDE.md`** to the new repo root explaining what it is.

6. **Test the deploy** by pushing to `main` or triggering the workflow manually.

7. **After confirming it works**, you can remove that worker from the `github` repo.

---

## Step-by-Step: Create the Chicbu Law Repo

All the code is ready in the `virtual-office-hub` repo under the `chicbu-law/` folder.

1. **Create a new GitHub repo**: `BelichickGillisMusk/chicbu-law`

2. **Copy these files to the new repo root:**
   ```
   chicbu-law/worker.js                         → worker.js
   chicbu-law/wrangler.toml                     → wrangler.toml
   chicbu-law/CLAUDE.md                         → CLAUDE.md
   chicbu-law/README.md                         → README.md
   chicbu-law/.github/workflows/deploy-chicbu-law.yml → .github/workflows/deploy-chicbu-law.yml
   ```

3. **Update firm details** in `worker.js` (search for `← update` comments):
   - Real domain name
   - Phone number
   - Email address
   - Full address
   - Attorney name and bar number

4. **Update the domain** in `wrangler.toml` with the real domain.

5. **Add `CLOUDFLARE_API_TOKEN`** to the new repo's secrets.

6. **Push to `main`** — auto-deploys to Cloudflare Workers.

---

## Adding CLAUDE.md to Existing Repos

Every repo should have a `CLAUDE.md` at the root. Copy and customize this template:

```markdown
# CLAUDE.md — [Repo Name]

## This repo is ONLY for [project name].

Do NOT add [other projects] here.

## What This Repo Contains

[One sentence description]

**Deployment:** [Cloudflare / Vercel / Google Cloud / etc.]
**Domain:** [domain if applicable]

## DO NOT

- Do not add unrelated projects here
- Do not commit .env files or API keys
```

---

## Naming Convention Going Forward

| Type | Pattern | Example |
|------|---------|---------|
| Cloudflare Worker | `[project]-worker` OR just `[domain-slug]` | `cleantruckcheckstockton-worker` |
| React / Next.js app | `[project]-app` | `silverback-ai-studio` |
| Law firm site | `[firm-slug]` | `chicbu-law` |
| Agent / tool | `[name]-agent` | `samantha-agent` |
| Docs / reference | `[topic]-docs` | `claude-project-list` |

---

## Quick Checklist Before Starting Any Coding Session

- [ ] Am I in the correct repo for this project?
- [ ] Does this repo have a `CLAUDE.md` that describes what belongs here?
- [ ] Is the project I want to add consistent with what the `CLAUDE.md` says?

If you answer "no" to any of these, stop and create or switch to the correct repo first.
