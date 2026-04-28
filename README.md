# 🏗️ MachineryFind

A full-stack heavy equipment marketplace built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

## Features

- **REST API** — `/api/listings` endpoint with query param filtering (category, condition, search, maxPrice)
- **Real-time search** — debounced client-side search with live results
- **Filter chips** — filter by equipment category and condition
- **Responsive grid** — auto-fill card layout that adapts to viewport
- **Dark UI** — custom design system with CSS variables and Google Fonts

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| API | Next.js Route Handlers |
| Fonts | Google Fonts (Bebas Neue, DM Sans, DM Mono) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API

```
GET /api/listings
  ?search=caterpillar    # text search on name, description, location
  ?category=Excavators   # filter by category
  ?condition=Used        # filter by condition
  ?maxPrice=200000       # filter by max price
```

## Project Structure

```
app/
├── api/
│   └── listings/
│       └── route.ts     # REST API with filtering logic
├── page.tsx             # Main listing page (client component)
├── layout.tsx           # Root layout
└── globals.css          # Design tokens + custom styles
```

## Deployment

Ready to deploy on [Vercel](https://vercel.com) — just connect the repo.

---

Built by [Malavika Kashireddy](https://github.com/malavikakashireddy)
