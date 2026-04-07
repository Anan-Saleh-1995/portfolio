# Portfolio

Design-forward portfolio site for Anan Saleh, built with React, TypeScript, and Vite.

This repo is intentionally small in surface area, but it treats frontend quality seriously: typed content, accessible interaction patterns, a measured motion system, and a distinct visual identity anchored by a desktop-only Three.js hero.

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

## What This Repo Optimizes For

- A portfolio that looks deliberate rather than template-generated
- Clear feature ownership and maintainable folder boundaries
- Typed content access through a lightweight i18n-ready content layer
- Accessibility and keyboard behavior that hold up under review
- A strong first impression without turning the whole repo into animation glue

## Architecture Notes

- Content is routed through `getHomeContent()` and validated by shared content types in `src/shared/content/home.types.ts`.
- The repo stays English-only for now, but the typed content/i18n scaffolding remains in place so future locales can be added without another structural refactor.
- Contact delivery is handled through a Vercel serverless function at `api/contact.ts`, backed by Resend so the API key stays server-side.
- Motion is split by purpose:
  - hero intro animation
  - section reveal on scroll
  - smooth-scroll coordination
- The Three.js hero is intentionally isolated behind a lazy-loaded boundary so the rest of the app stays simple and the expensive part is easy to reason about.

## Accessibility Notes

- Private project cards in Forge are rendered as non-interactive content, not disabled links.
- The contact purpose input uses a native `<select>` to keep keyboard and screen-reader behavior predictable.
- Mobile navigation closes on Escape and locks background scrolling while open.
- Reduced-motion handling is respected in section reveals and smooth-scroll behavior, and the hero falls back to a static version when motion should be reduced.

## Testing Approach

- Small unit tests stay colocated with the feature logic they protect.
- Pure helper behavior is tested close to the helper itself.
- Lightweight component tests cover the interaction flows most likely to regress:
  - contact validation
  - contact success/reset
  - theme helpers
  - mobile nav open/close

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

To test the contact form end-to-end with the serverless route locally, use:

```bash
npx vercel dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm run test
```

## Available Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build
- `npm run preview` serves the built app locally
- `npm run test` runs the Vitest suite
- `npm run lint` runs ESLint
- `npm run format` formats source files with Prettier
- `npm run format:check` checks formatting without writing changes
- `npm run spellcheck` runs cspell
- `npm run mdlint` runs markdownlint
- `npm run knip` checks for unused files and exports
- `npm run build:analyze` builds with bundle analysis output

## Environment Variables

The contact form expects the following variables in `.env.local`:

```env
RESEND_API_KEY=your_key
RESEND_FROM_EMAIL=Portfolio <contact@send.anansaleh.com>
CONTACT_TO_EMAIL=anansaleh18@gmail.com
```

Without them, the contact form UI still renders, but message delivery will fail.

## Current Tradeoffs

- The Three.js hero is still the heaviest part of the bundle. That cost is currently accepted because it carries a large part of the site identity.
- This is a one-page portfolio, so the architecture is intentionally lighter than a product app.
- Additional locales such as Japanese or Hebrew are planned, but they are intentionally not exposed until the copy quality is strong enough to publish.

## Public Repo Checklist

Before making the repo public, verify:

- no secrets are committed
- README claims still match the code
- contact env vars are documented
- links and metadata assets are still valid
- tests, lint, and build all pass
