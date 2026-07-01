# Ojoor HubSpot Proposal

A HubSpot-native proposal workflow designed for the Ojoor sales team.

## Sales experience

1. Open a HubSpot deal.
2. Confirm the associated company, contact, price or line items.
3. Click **Generate Proposal** in the **Ojoor Proposal** app card.
4. Review the generated HubSpot quote draft and publish it.

The sales rep never types a Deal ID. HubSpot passes the current record ID to the app card automatically.

## Projects

- `quote-module/` - Arabic custom quote module matching the supplied Ojoor PDF design.
- `deal-card/` - optional one-click deal card and private serverless function.

## Important account notes

- The quote module is the core implementation and should be deployed first.
- The app card with a serverless function requires a HubSpot Enterprise subscription for installation.
- If Enterprise is not available, sales can use the native HubSpot flow: **Deal -> Create quote -> Ojoor Arabic Proposal**.
- Keep the quote template name exactly `Ojoor Arabic Proposal`; the app card discovers it by name.
- Quote line items are copied before association so deleting a quote cannot remove the deal's original line items.

## Deploy the quote module

```bash
cd quote-module
npm install
hs account auth
npm run typecheck
npm run deploy
```

In HubSpot, create a quote template named **Ojoor Arabic Proposal**, add the uploaded module as the only main content module, and publish the template.

## Deploy the optional app card

```bash
cd deal-card
npm install --prefix src/app/cards
npm install --prefix src/app/functions
hs account auth
hs project upload
```

Then install the private app and add the **Ojoor Proposal** card to the middle column of the Deal record layout.

## Data mapping

See [`docs/PROPERTY_MAPPING.md`](docs/PROPERTY_MAPPING.md) and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
