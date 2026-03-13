# AGENTS.md

## Project overview
This is a Next.js project comprising a Landing Page (LP) and two micro-apps: **MOSAIC** and **sprout**.
- **LP**: The main entry point explaining the services.
- **MOSAIC**: An income portfolio design service.
- **sprout**: A career phase diagnostic tool.
These apps are integrated within the same Next.js repository.

## Tech stack
- **Next.js**: 16.1.6
- **TypeScript**: 5.x
- **App Router**: Used for all pages and APIs
- **Vercel**: Deployment platform
- **GA4**: Integrated via `@next/third-parties/google`

## Directory structure (important parts only)
- `src/app/page.tsx`: LP (Top page)
- `src/app/apps/mosaic/`: MOSAIC application
- `src/app/apps/sprout/`: sprout application
- `src/components/`: Common UI components
- `src/data/`: Static data and logic (e.g., `guideData.ts`)
- `src/app/api/`: API routes (e.g., `/api/calculate`, `/api/sprout`)
- `src/app/layout.tsx`: Root layout (contains GA4 setup)

## Commands
- `npm install`: Install dependencies
- `npm run dev`: Start local development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint

## GA setup
- **Location**: `src/app/layout.tsx`
- **Measurement ID**: `G-9E670842Z7` (Hardcoded in `RootLayout`)
- **Helper**: Currently no dedicated analytics helper file. Tracking is done via the `GoogleAnalytics` component.

## Constraints
- **Do not change UI**: Keep existing designs intact.
- **Do not refactor**: Focus only on the requested changes.
- **Add tracking only**: The primary task is adding event tracking.
- **Keep build passing**: Ensure `npm run build` succeeds.
- **No type errors**: Ensure all TS types are correct.

## Deployment
- **Method**: Automatic deployment via Vercel on `git push` to the main branch.

## Environment notes
- No critical `.env` variables required for tracking tasks.

## Verification
- **Local**: `npm run dev` and check browser console.
- **Build**: `npm run build` to verify no breaking changes.
- **GA Realtime**: Verify events in GA4 Realtime dashboard after deployment.

## Important files for tracking tasks
- `src/app/page.tsx`: LP (contains CTA buttons)
- `src/app/apps/mosaic/page.tsx`: MOSAIC engine (Start, Quiz, Result)
- `src/app/apps/sprout/page.tsx`: sprout engine (Start, Quiz, Result)
- `src/components/GuidePage.tsx`: MOSAIC individual guide pages
- `src/app/layout.tsx`: Site-wide elements
