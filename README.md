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

## Content

Add a markdown file under `src/content/notes/` with frontmatter:

```md
---
title: Your title
summary: One-line hook
date: 2026-09-20
tags:
  - architecture
---

Body...
```
