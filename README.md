# Engineering Profile Website

An engineering profile site built with Next.js + TypeScript. Not a portfolio in the marketing sense — a systems dashboard crossed with technical documentation.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

All personal/placeholder content lives in a single file:

```
src/content/site-content.ts
```

Replace `[PLACEHOLDER: ...]` values with real data. Structural components (API routes, Live System Lab validation logic, design system) are real and working.

## Site Architecture

| Route | Section |
|-------|---------|
| `/` | Home — identity, proof strip, featured systems |
| `/systems` | Full project index |
| `/systems/[id]` | Project summary (recruiter-readable) |
| `/systems/[id]/inspect` | System Inspector — architecture diagram |
| `/engineering-log` | Debugging narratives |
| `/decision-log` | Architecture decision records |
| `/api-playground` | Live API endpoint tester |
| `/live-lab` | Interactive parameter validation demo |
| `/experience` | Role history with linked systems |
| `/stack` | Technologies by layer |
| `/cv` | Interactive CV + PDF export |
| `/credentials` | Certs, badges, links |
| `/now` | Currently building/learning |
| `/contact` | Contact information |
| `/thoughts` | Group-chat guest wall — visitors post thoughts, Josh replies as himself (AI) |
| `/blog` | Engineering notes and long-form thoughts |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List all systems |
| GET | `/api/experience` | Work history |
| GET | `/api/skills` | Stack by layer |
| GET | `/api/systems/:id` | Single system with architecture |
| POST | `/api/lab/validate` | Parameter validation (Live Lab) |
| GET | `/api/thoughts` | List thoughts + Josh's AI replies |
| POST | `/api/thoughts` | Post a thought `{ name, role, text }` |
| POST | `/api/thoughts/:id/react` | Toggle a reaction `{ emoji }` |
| POST | `/api/thoughts/:id/pin` | Toggle pinned on a thought |
| POST | `/api/thoughts/:id/reply` | Generate Josh's AI reply |

> **Thoughts persistence:** Messages are stored in a file-backed JSON store at `data/thoughts.json`. This works on local dev and self-hosted servers. It does **not** persist on stateless/serverless hosting (e.g. Vercel free tier), since the filesystem is ephemeral there.

## Design System

- **Themes:** Dark (default) and light mode via the header toggle. Preference is saved to `localStorage` and respects `prefers-color-scheme` on first visit.
- **Colors:** CSS variables (`--bg`, `--text`, `--border`, etc.) — no hardcoded theme colors in components.
- **Dark:** Black (#0A0A0A), dark grays, white/off-white text.
- **Light:** Zinc palette (#F8F8F8 background, #FFFFFF surfaces, #09090B text).
- **Status colors:** PASSED/WARNING/CRITICAL only — never decorative.
- **Typography:** Inter (prose), JetBrains Mono (code/labels).
- **No gradients, no glassmorphism, no decorative animation.**

## Build

```bash
npm run build
npm start
```
