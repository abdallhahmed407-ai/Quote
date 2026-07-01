# HubSpot property mapping

## Deal

| Proposal field | HubSpot internal property |
|---|---|
| Deal / opportunity name | `dealname` |
| Total fallback price | `amount` |
| Currency | `deal_currency_code` |
| Billing address fallback | `billing_address` |
| Commercial registration fallback | `cr_number` |
| VAT fallback | `vat_number` |
| Arabic legal name fallback | `legal_name_arabic` |
| English legal name fallback | `legal_name_english` |

## Associated company

| Proposal field | HubSpot internal property |
|---|---|
| Customer name | `name` |
| Commercial registration | `cr_number` |
| VAT number | `vat_number` |
| Billing address | `billing_address` |
| Address fallback | `address`, `city`, `country`, `zip` |
| Employee count | `numberofemployees` |
| Phone / website | `phone`, `website` |

## Associated contact

The first associated contact is used as the buyer/contact fallback. Use HubSpot association labels later if a dedicated "Proposal signer" contact must be selected.

## Line items

The quote copies these fields from each deal line item:

- `name`
- `description`
- `quantity`
- `price`
- `discount`
- `hs_discount_percentage`
- `hs_line_item_currency_code`
- recurring billing fields
- `hs_sku`
- `hs_product_id`

If a deal has no line items, one fallback line item is created from the deal `amount` so the sales team can still generate a draft.
