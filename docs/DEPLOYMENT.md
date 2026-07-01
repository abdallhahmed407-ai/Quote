# Deployment checklist

## 1. Quote module

1. Install Node.js 20 or later and the latest HubSpot CLI.
2. Authenticate the Ojoor portal with `hs account auth`.
3. Upload `quote-module` with `npm run deploy`.
4. Open HubSpot quote template settings.
5. Create a template named exactly **Ojoor Arabic Proposal**.
6. Add the custom module **Ojoor Arabic Proposal**.
7. Remove duplicate standard cover, line-item, terms, and signature modules when the custom full-document module is used.
8. Publish and test against a sandbox/test deal.

## 2. Sales data rules

Before generation, every deal should have:

- one associated company;
- one associated buyer/contact;
- line items, or a positive `amount` fallback;
- accurate company CR, VAT, address, and legal name fields.

## 3. One-click app card (Enterprise)

1. Upload `deal-card` with `hs project upload`.
2. Install the private app and approve its CRM scopes.
3. Customize the Deal record layout.
4. Add **Ojoor Proposal** from the App Card library.
5. Open a test deal and confirm that the card detects the deal without manual ID entry.
6. Click **Generate Proposal** and review the draft quote before publishing.

## 4. Non-Enterprise fallback

The one-click serverless card is optional. Sales can still use the custom template natively:

**Deal -> Add products/line items -> Create quote -> Ojoor Arabic Proposal -> Review -> Publish**
