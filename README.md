# Portfolio

Design-forward portfolio site for Anan Saleh, built with React, TypeScript, and Vite.

The project focuses on three things:

- a distinct visual identity
- lightweight but intentional motion
- clean, maintainable frontend structure

## Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- GSAP
- Lenis
- Three.js / `@react-three/fiber`

## Highlights

- Desktop-only lazy-loaded 3D hero with a fallback for smaller screens
- Theme switching with persisted preference
- Scroll-triggered section reveals with reduced-motion support
- Contact form with client-side validation and async submission flow
- Mobile navigation with smooth-scroll locking
- SEO metadata and structured data in `index.html`

## Project Structure

```text
src/
  app/          App shell and global CSS imports
  features/     Page sections and feature-specific logic
  pages/        Top-level page composition
  shared/       Reusable hooks, config, styles, and UI primitives
public/         Static assets
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build
- `npm run preview` serves the built app locally
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
VITE_WEB3FORMS_KEY=your_key
VITE_WEB3FORMS_MAIL_API=your_endpoint
```

Without them, the contact form will not deliver messages correctly.

## Frontend Notes

- Motion is split by purpose:
  - hero intro animation
  - section reveal on scroll
  - footer fade-in
- Reduced-motion handling is centralized in shared motion helpers.
- Smooth scrolling is driven by Lenis and coordinated with GSAP scroll updates.
- The 3D hero is intentionally isolated so it can be optimized or replaced without affecting the rest of the page.

## Current Tradeoffs

- The Three.js hero is the heaviest part of the bundle.
- There is currently no automated test suite.
- This is a single-page portfolio, so most architecture choices optimize for clarity and presentation rather than app-scale complexity.

## Next Improvements

- Reduce the cost of the 3D hero
- Add tests for nav, theme, and contact flows
- Expand project cards into stronger case-study style proof points
- Continue accessibility auditing for keyboard and mobile behavior
