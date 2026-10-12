# EngContinuum

Public notes and studio site for [engcontinuum.com](https://engcontinuum.com).

## Stack

- SvelteKit (SSR / Vercel adapter)
- mdsvex for notes in `src/content/notes`

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Dashboard

Private analytics at `/dashboard` (username `admin` by default).

Tracks page views and article dwell time. Locally, stats are stored under `data/`. On Vercel, set Upstash Redis env vars for durable storage:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Optional overrides: `DASHBOARD_USER`, `DASHBOARD_PASSWORD`, `DASHBOARD_SESSION_SECRET`.

## Content

Add a markdown file under `src/content/notes/` with frontmatter:

```md
---
title: Your title
summary: One-line hook
date: 2026-09-20
category: notes # notes | practice
tags:
  - architecture
---

Body...
```

Categories:

- `notes` — architecture judgment across the continuum
- `practice` — Vibe Coding workflows and AI-assisted delivery
