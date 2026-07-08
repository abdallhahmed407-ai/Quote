# Ojoor Proposal Generator

Cloudflare Worker that generates HubSpot proposal links as browser-printable HTML.

## Current renderer

Production now uses exact page-image templates:

- Arabic proposal: 11 page images, with packages/features on pages 4 and 5 and detailed pricing on page 6.
- English proposal: 12 page images, with detailed pricing on page 7.
- HubSpot data is rendered as overlays only where values are dynamic.

## Key routes

- `/preview?lang=ar` — Arabic preview.
- `/preview?lang=en` — English preview.
- `/preview/pdf?lang=ar` — Arabic PDF preview.
- `/preview/pdf?lang=en` — English PDF preview.
- `/p/<TOKEN>` — signed live proposal link.

## HubSpot language field

Deal property:

```text
proposal_language
```

Values supported:

```text
Arabic / ar
English / en
```

Missing or unknown values default to Arabic.
