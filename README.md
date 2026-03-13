# mosaic-landing

## Canonical Pages

- LP: `src/app/page.tsx`
- MOSAIC app: `src/app/apps/mosaic/page.tsx`
- MOSAIC guides: `src/app/apps/mosaic/guides/[id]/page.tsx`
- sprout app: `src/app/apps/sprout/page.tsx`

Do not keep backup LP files such as `index.html.bak` in the repo. The LP source of truth is `src/app/page.tsx`.

## Working Rules

- Keep `main` deployable. If the LP is correct locally, commit it before starting unrelated work.
- Before any new task, run `git status` and confirm there are no forgotten LP changes.
- Before pushing, check `git diff --stat` so only intended files are included.
- If a temporary backup is needed locally, use an ignored filename ending in `.bak`.
- Do not create alternate LP implementations outside `src/app/page.tsx`.

## Local Commands

```bash
npm run dev
npm run build
npm run lint
```

Open `http://localhost:3000` for the LP and `/apps/mosaic`, `/apps/sprout` for the apps.

## Deployment

- Production deploys from `main` via Vercel
- A push to `main` should represent the exact state you want live
