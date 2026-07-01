# Ojoor HubSpot Proposal

A HubSpot-native Arabic proposal template designed for the Ojoor sales team and based on the supplied PDF.

## Sales experience

1. Open a HubSpot deal.
2. Confirm the associated company and buyer.
3. Add products / line items, or enter a positive deal amount.
4. Click **Create quote** in HubSpot.
5. Choose **Ojoor Arabic Proposal**.
6. Review and publish the quote.

The sales representative never types a Deal ID. The quote is created from the currently open Deal and remains associated with it.

## Included

- Full Arabic 8-page quote module matching the Ojoor proposal structure.
- Dynamic company, buyer, Deal, pricing, discount, tax, terms, sender, and signer data.
- HubSpot Line Item pricing table.
- Deal amount fallback when a Deal has no Line Items.
- Print/PDF layout and responsive browser layout.
- Deployment and property-mapping documentation.

## Deploy

```bash
cd quote-module
npm install
hs account auth
npm run deploy
```

Then in HubSpot:

1. Open Quote Template settings.
2. Create a template named **Ojoor Arabic Proposal**.
3. Add the custom module **Ojoor Arabic Proposal**.
4. Remove duplicate standard cover, pricing, terms, and signature modules.
5. Publish and test with a sample Deal.

## One-click card

A separate Deal card can later reduce the flow to one **Generate Proposal** button. HubSpot serverless app functions used by that card require the relevant Enterprise capability, so the first production release uses HubSpot's native Create quote action for maximum compatibility.

## Data mapping

See [`docs/PROPERTY_MAPPING.md`](docs/PROPERTY_MAPPING.md) and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
