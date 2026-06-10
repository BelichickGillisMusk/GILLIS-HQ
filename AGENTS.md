# AGENTS.md — Virtual Office Hub

## Cursor Cloud specific instructions

### Product

Single React 19 + TypeScript + Vite SPA (GitHub Spark template). The current entry point is the **Samantha** AI chat assistant in `src/App.tsx`. Additional office-hub components exist under `src/components/` but are not wired into the root app yet.

### Dev server

```bash
npm run dev
```

- Serves on **port 5000** (set by `@github/spark` Vite plugin — not Vite’s default 5173).
- Kill a stuck process: `npm run kill` (`fuser -k 5000/tcp`).

### GitHub Spark runtime (LLM + KV)

The app depends on GitHub Spark proxies during development:

- `/_spark/llm` — powers `spark.llm()` (Samantha chat, agent features)
- `/_spark/kv` — powers `useKV()` persistence (`spark.meta.json` sets `"dbType": "kv"`)

Set **`GITHUB_TOKEN`** in the shell before starting the dev server for full chat and persistence:

```bash
export GITHUB_TOKEN="<token-with-spark-runtime-and-models-access>"
npm run dev
```

Without it, the UI still loads and accepts messages, but LLM replies and KV writes return **401 Unauthorized**.

### Install

```bash
npm install --legacy-peer-deps
```

Peer dependency conflicts between `eslint@9` and `@eslint/js@10` require `--legacy-peer-deps`.

### Lint / test / build

| Command | Status |
|---------|--------|
| `npm run build` | Works (`tsc -b --noCheck && vite build` → `dist/`) |
| `npm run preview` | Serves production build locally |
| `npm run lint` | **Broken** — no `eslint.config.js` in repo (ESLint 9 flat config required) |
| `npm test` | **Not defined** — no test runner or test script |

### Ignore in this repo

- `chicbu-law/` is a stray Cloudflare Worker project; do not treat it as part of Virtual Office Hub (see `CLAUDE.md`).
