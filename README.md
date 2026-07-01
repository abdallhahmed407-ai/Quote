# Ojoor Custom Proposal Generator

Cloudflare Worker that generates branded Arabic proposals directly from HubSpot Deals without requiring HubSpot Quotes.

## Sales workflow

1. Open the Deal in HubSpot.
2. Confirm the associated Company and Contact.
3. Add Line Items, or enter a positive Deal Amount.
4. Set **Generate Proposal** to **Generate proposal** or **Generate new version**.
5. Within about one minute, HubSpot updates the Deal with the proposal page, PDF link, version, date, and status.

The sales representative never types a Deal ID. The Worker discovers the current Deal through the HubSpot property trigger.

## Existing Deal properties

The HubSpot portal already contains these properties:

- `generate_proposal`
- `proposal_status`
- `proposal_url`
- `proposal_pdf_url`
- `proposal_version`
- `proposal_generated_at`
- `proposal_error`

## What the Worker does

- Searches every minute for Deals where `generate_proposal` is `generate` or `regenerate`.
- Pulls Deal, Company, Contact, Owner, and Line Item data.
- Uses Deal Amount as a fallback when no Line Items exist.
- Saves an immutable proposal snapshot as a Note associated with the Deal.
- Creates a signed, non-guessable customer link.
- Renders the Arabic proposal in the browser.
- Generates the PDF through Cloudflare Browser Run.
- Updates all proposal properties on the Deal.
- Preserves the previous successful URL if a new generation attempt fails.

## HubSpot Private App scopes

Create a Private App named **Ojoor Proposal Generator** and enable:

### Read and write

- Deals
- Notes

### Read only

- Companies
- Contacts
- Line Items
- Owners

Store the token only as a Cloudflare secret. Never commit it to GitHub.

## Cloudflare setup

The existing Worker name must remain `quote`, matching `wrangler.jsonc`.

Connect this repository to the existing Cloudflare Worker:

1. Open **Workers & Pages → quote → Settings → Builds**.
2. Connect GitHub repository `abdallhahmed407-ai/Quote`.
3. Set the production branch to `main`.
4. Root directory: `/`.
5. Optional build command: `npm run typecheck`.
6. Deploy command: `npx wrangler deploy`.

Under **Settings → Variables and Secrets**, add:

| Name | Type | Required value |
|---|---|---|
| `HUBSPOT_ACCESS_TOKEN` | Secret | HubSpot Private App token |
| `PROPOSAL_SIGNING_SECRET` | Secret | At least 32 random characters |
| `ADMIN_KEY` | Secret | At least 32 random characters for manual tests |
| `PUBLIC_BASE_URL` | Variable | Full Worker URL, without a trailing slash |

Example `PUBLIC_BASE_URL`:

```text
https://quote.<your-workers-subdomain>.workers.dev
```

The Browser Run binding and one-minute Cron Trigger are already defined in `wrangler.jsonc`.

## Health check

Open:

```text
https://<worker-url>/health
```

A ready deployment returns `configured: true`.

## Manual test

After setting a test Deal's `generate_proposal` property, run the processor immediately:

```bash
curl -X POST "https://<worker-url>/admin/run" \
  -H "Authorization: Bearer <ADMIN_KEY>"
```

Otherwise, the Cron Trigger processes it automatically within about one minute.

## Local validation

```bash
npm install
npm run typecheck
npm run dev
```

Browser Run Quick Actions require remote development mode, which is already enabled in `wrangler.jsonc`.
