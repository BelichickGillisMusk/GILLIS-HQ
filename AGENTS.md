# AGENTS.md — Virtual Office Hub

See also [CLAUDE.md](./CLAUDE.md) for repo scope and key files.

## Cursor Cloud specific instructions

### Product overview

Single-page React app (Virtual Office Hub / Samantha AI assistant) built with Vite and GitHub Spark. There is no separate backend service in this repo — persistence and LLM calls go through the Spark runtime injected by `@github/spark`.

### Services

| Service | Port | Command | Required |
|---------|------|---------|----------|
| Vite dev server | **5000** | `npm run dev` | Yes (primary dev workflow) |
| Vite preview (prod build) | 5001 (example) | `npm run preview -- --host 0.0.0.0 --port 5001` | Optional |

Start the dev server in a **tmux** session so it stays running across agent turns:

```bash
SESSION_NAME="vite-dev-server"
tmux -f /exec-daemon/tmux.portal.conf has-session -t "=$SESSION_NAME" 2>/dev/null \
  || tmux -f /exec-daemon/tmux.portal.conf new-session -d -s "$SESSION_NAME" -c "/workspace" -- "${SHELL:-bash}" -l
tmux -f /exec-daemon/tmux.portal.conf send-keys -t "$SESSION_NAME:0.0" 'cd /workspace && npm run dev' C-m
```

Kill anything on port 5000 first if needed: `npm run kill` (uses `fuser -k 5000/tcp`).

### Dependency install caveat

`npm install` requires `--legacy-peer-deps` due to a peer conflict between `@eslint/js@10` and `eslint@9`. The VM update script uses this flag.

### Lint / test / build

| Task | Command | Notes |
|------|---------|-------|
| Lint | `npm run lint` | **Currently fails**: no `eslint.config.js` in repo (ESLint 9 flat config expected) |
| Test | — | No test framework or test files configured |
| Build | `npm run build` | `tsc -b --noCheck && vite build` — succeeds |
| Preview | `npm run preview` | Serves `dist/` locally |

### Spark / LLM behavior outside Spark hosting

The app loads and UI interactions work in this cloud VM, but `spark.llm()` and `useKV()` call `/_spark/*` endpoints. Without Spark platform authentication, the browser console shows **401 Unauthorized** on those routes and Samantha will not receive AI replies. Frontend-only development (layout, components, local UI state) still works.

### Environment variables

No `.env` files in repo. Optional: `PROJECT_ROOT` overrides the Vite `@` alias root (see `vite.config.ts`). Spark API keys are managed by the Spark platform, not this repo.

### Repo hygiene

- Ignore the `chicbu-law/` subdirectory — it is a separate Cloudflare Worker project and out of scope here (see CLAUDE.md).
- Do not commit `.env` files or API keys.
