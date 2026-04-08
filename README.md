# Portfolio

My personal portfolio, built with React, TypeScript, and Vite.

Live: [anansaleh.com](https://anansaleh.com)

I did not want this repo to be just another pretty frontend with no real engineering behind it. The goal was simple:

- make the site feel intentional
- keep the codebase clean
- treat the contact flow like a real production feature

## What is in here

- a custom frontend, not a template
- a Three.js hero for the visual identity
- a real contact flow with server-side delivery
- origin checks, rate limiting, honeypot protection, and monitoring
- Vercel deployment with a health endpoint

## Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- GSAP
- Lenis
- Three.js / `@react-three/fiber`
- Vitest
- React Testing Library
- Resend
- Upstash Redis
- Sentry

## Structure

- `src/` for the client app
- `server/` for server-only logic
- `api/` for thin Vercel entrypoints
- `public/` for static assets like `robots.txt`, `sitemap.xml`, and preview assets

The important boundary is this:

- `src/` is app code
- `server/` is server code
- `api/` is just the edge entry layer

That split matters more than adding clever abstractions.

## Running locally

Install dependencies:

```bash
npm install
```

Frontend only:

```bash
npm run dev
```

That is just the client. It does not run `/api/contact`.

If you want the real local contact flow, there is also:

```bash
npm run vercel:dev
```

That is optional tooling. It is not the main local dev path.

If you use it, you need:

- the Vercel CLI available on your machine
- a real `.env.local`
- valid contact env values if you want actual delivery

What it gives you:

- the frontend
- `/api/contact`
- `/api/health`

Production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Quality checks

```bash
npm run lint
npm run test
npm run knip
npm run spellcheck
npm run build
```

## Environment variables

Create `.env.local` with:

```env
ALLOWED_ORIGINS=https://anansaleh.com,https://www.anansaleh.com
RESEND_API_KEY=your_key
RESEND_FROM_EMAIL=Portfolio <contact@send.anansaleh.com>
CONTACT_TO_EMAIL=your_inbox@example.com
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
SENTRY_DSN=https://your-dsn.ingest.sentry.io/project-id
```

Use the same variables in Vercel for deployed environments.

## Contact pipeline

The browser does not send mail directly.

It posts to:

```text
/api/contact
```

From there the server handles:

- payload validation
- origin checks
- honeypot filtering
- Upstash-backed rate limiting
- Resend delivery
- Sentry reporting for real server-side failures

There is also a health endpoint:

```text
/api/health
```

It returns:

```json
{ "ok": true }
```

## Why the repo is shaped this way

I care about consistency more than cleverness.

So the repo tries to follow a few simple rules:

- feature code should live with the feature
- server-only code should stay out of the client
- system logic should use explicit codes, not random string handling
- decorative ideas should be easy to remove if they are not earning their place

## Notes

- this is still a single-page portfolio
- the hero is the heaviest visual part of the app and that tradeoff is intentional
- the contact flow is treated more seriously than most portfolio contact forms

## License

This repository is licensed under the terms of the [LICENSE](./LICENSE) file.
