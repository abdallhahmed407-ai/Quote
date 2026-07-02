# Ojoor Proposal Generator

This repository contains the production HubSpot proposal generator deployed to Cloudflare Workers.

## Single source of truth

Only the current renderer is used by production:

- `src/index.ts` — HTTP routes, HubSpot generation flow, HTML preview, and PDF preview.
- `src/hubspot.ts` — HubSpot deals, companies, contacts, line items, and immutable proposal snapshots.
- `src/render.ts` — injects HubSpot values into the approved proposal template.
- `src/pricing.ts` — renders the dynamic line-item invoice and totals.
- `src/template.ts` — restores the approved uploaded HTML template.
- `src/template-bin-01.bin` through `src/template-bin-11.bin` and `src/template-rest.ts` — the current approved template archive.
- `src/security.ts` — creates and validates signed public proposal links.
- `src/types.ts` — shared Worker types.

Old renderer modules such as `render-v2.ts`, `render-v3.ts`, `render-exact.ts`, `reference-template.ts`, and the earlier graphics/CSS modules are not present on `main` and are not part of the deployed build.

Git commit history is retained only for audit and rollback. Previous commits do not execute in production; Cloudflare deploys the latest successful commit on the `main` branch.

## Preview

After deployment:

- HTML preview: `https://quote.abdallhahmed407.workers.dev/preview`
- PDF preview: `https://quote.abdallhahmed407.workers.dev/preview/pdf`
- Health and active renderer details: `https://quote.abdallhahmed407.workers.dev/health`

The preview uses sample customer data but the exact same template, renderer, line-item table, totals logic, and PDF path as real HubSpot proposals.

## Commands

```bash
npm install
npm run typecheck
npm run deploy
```
