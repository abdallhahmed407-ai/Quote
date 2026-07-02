import type { Env, JsonObject, ProposalSnapshot } from './types';

const API = 'https://api.hubapi.com';

const DEAL_PROPERTIES = [
  'dealname',
  'amount',
  'deal_currency_code',
  'closedate',
  'hubspot_owner_id',
  'billing_address',
  'cr_number',
  'vat_number',
  'legal_name_arabic',
  'legal_name_english',
  'generate_proposal',
  'proposal_status',
  'proposal_url',
  'proposal_pdf_url',
  'proposal_version',
  'proposal_generated_at',
  'proposal_error',
];

const COMPANY_PROPERTIES = [
  'name',
  'cr_number',
  'vat_number',
  'billing_address',
  'address',
  'address2',
  'city',
  'state',
  'country',
  'zip',
  'numberofemployees',
  'phone',
  'website',
];

const CONTACT_PROPERTIES = ['firstname', 'lastname', 'email', 'phone', 'jobtitle'];

const LINE_ITEM_PROPERTIES = [
  'name',
  'description',
  'quantity',
  'price',
  'amount',
  'discount',
  'hs_discount_percentage',
  'hs_total_discount',
  'hs_pre_discount_amount',
  'hs_tax_amount',
  'hs_post_tax_amount',
  'hs_line_item_currency_code',
  'recurringbillingfrequency',
  'hs_sku',
];

async function request<T>(env: Env, path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.HUBSPOT_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HubSpot ${response.status}: ${body.slice(0, 1200)}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function searchPendingDeals(env: Env): Promise<JsonObject[]> {
  const result = await request<JsonObject>(env, '/crm/v3/objects/deals/search', {
    method: 'POST',
    body: JSON.stringify({
      filterGroups: [{
        filters: [{
          propertyName: 'generate_proposal',
          operator: 'IN',
          values: ['generate', 'regenerate'],
        }],
      }],
      properties: DEAL_PROPERTIES,
      limit: 10,
      sorts: ['hs_lastmodifieddate'],
    }),
  });
  return result.results || [];
}

export async function patchDeal(env: Env, dealId: string, properties: Record<string, string>): Promise<void> {
  await request(env, `/crm/v3/objects/deals/${dealId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  });
}

function associationIds(record: JsonObject, key: string): string[] {
  const associations = record.associations || {};
  const normalizedKey = key.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const matchedKey = Object.keys(associations).find(
    (candidate) => candidate.replace(/[^a-z0-9]/gi, '').toLowerCase() === normalizedKey,
  );
  return (matchedKey ? associations[matchedKey]?.results : []).map((item: JsonObject) => String(item.id));
}

async function readObject(env: Env, objectType: string, objectId: string, properties: string[]): Promise<JsonObject> {
  const query = new URLSearchParams({ properties: properties.join(',') });
  return request<JsonObject>(env, `/crm/v3/objects/${objectType}/${objectId}?${query}`);
}

async function readOwnerSafely(env: Env, ownerId?: string): Promise<JsonObject> {
  if (!ownerId) return {};
  try {
    return await request<JsonObject>(env, `/crm/v3/owners/${ownerId}?idProperty=id`);
  } catch (error) {
    console.warn('Owner lookup skipped; proposal will use blank sender details.', error);
    return {};
  }
}

function number(value: unknown): number {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function buildSnapshot(env: Env, dealId: string, version: number): Promise<ProposalSnapshot> {
  const query = new URLSearchParams({
    properties: DEAL_PROPERTIES.join(','),
    associations: 'companies,contacts,line_items',
  });
  const dealRecord = await request<JsonObject>(env, `/crm/v3/objects/deals/${dealId}?${query}`);
  const companyId = associationIds(dealRecord, 'companies')[0];
  const contactId = associationIds(dealRecord, 'contacts')[0];
  const lineItemIds = associationIds(dealRecord, 'line_items');

  const [companyRecord, contactRecord, lineItemRecords, ownerRecord] = await Promise.all([
    companyId ? readObject(env, 'companies', companyId, COMPANY_PROPERTIES) : Promise.resolve({ properties: {} }),
    contactId ? readObject(env, 'contacts', contactId, CONTACT_PROPERTIES) : Promise.resolve({ properties: {} }),
    Promise.all(lineItemIds.map((id) => readObject(env, 'line_items', id, LINE_ITEM_PROPERTIES))),
    readOwnerSafely(env, dealRecord.properties?.hubspot_owner_id),
  ]);

  const deal = dealRecord.properties || {};
  const company = companyRecord.properties || {};
  const contact = contactRecord.properties || {};
  const lineItems = lineItemRecords.map((record) => ({ id: record.id, ...(record.properties || {}) }));

  if (!company.name && !deal.legal_name_arabic && !deal.legal_name_english && !deal.dealname) {
    throw new Error('Missing customer/company name. Associate a company or complete the Deal legal name.');
  }
  if (lineItems.length === 0 && number(deal.amount) <= 0) {
    throw new Error('Missing pricing. Add Line Items or enter a positive Deal Amount.');
  }

  const currency = deal.deal_currency_code || lineItems[0]?.hs_line_item_currency_code || 'SAR';
  const normalizedItems = lineItems.length ? lineItems : [{
    id: `deal-${dealId}`,
    name: deal.dealname || 'اشتراك منصة أجور',
    description: 'Deal amount fallback',
    quantity: '1',
    price: String(deal.amount || 0),
    amount: String(deal.amount || 0),
    hs_line_item_currency_code: currency,
  }];

  let subtotal = 0;
  let discount = 0;
  let tax = 0;
  for (const item of normalizedItems) {
    const quantity = Math.max(number(item.quantity), 1);
    const gross = number(item.hs_pre_discount_amount) || number(item.price) * quantity;
    const itemDiscount = number(item.hs_total_discount || item.discount)
      || gross * (number(item.hs_discount_percentage) / 100);
    const net = number(item.amount) || Math.max(gross - itemDiscount, 0);
    subtotal += net;
    discount += itemDiscount;
    tax += number(item.hs_tax_amount);
  }

  return {
    schemaVersion: 1,
    dealId,
    version,
    createdAt: new Date().toISOString(),
    deal,
    company,
    contact,
    owner: ownerRecord || {},
    lineItems: normalizedItems,
    totals: {
      subtotal,
      discount,
      tax,
      grandTotal: subtotal + tax,
      currency,
    },
  };
}

function encodeSnapshot(snapshot: ProposalSnapshot): string {
  const bytes = new TextEncoder().encode(JSON.stringify(snapshot));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeSnapshot(value: string): ProposalSnapshot {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as ProposalSnapshot;
}

function snapshotToNoteBody(snapshot: ProposalSnapshot): string {
  const encoded = encodeSnapshot(snapshot);
  return `<p><strong>Ojoor Proposal V${snapshot.version}</strong> - system snapshot. Do not edit.</p><p>OJOOR_SNAPSHOT_V1:${encoded}</p>`;
}

export async function createSnapshotNote(env: Env, snapshot: ProposalSnapshot): Promise<string> {
  const note = await request<JsonObject>(env, '/crm/v3/objects/notes', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        hs_timestamp: snapshot.createdAt,
        hs_note_body: snapshotToNoteBody(snapshot),
        ...(snapshot.deal.hubspot_owner_id ? { hubspot_owner_id: snapshot.deal.hubspot_owner_id } : {}),
      },
      associations: [{
        to: { id: snapshot.dealId },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 214 }],
      }],
    }),
  });
  return String(note.id);
}

export async function readSnapshotNote(env: Env, noteId: string): Promise<ProposalSnapshot> {
  const note = await request<JsonObject>(env, `/crm/v3/objects/notes/${noteId}?properties=hs_note_body`);
  const body = String(note.properties?.hs_note_body || '');
  const match = body.match(/OJOOR_SNAPSHOT_V1:([A-Za-z0-9_-]+)/i);
  if (!match) throw new Error('Proposal snapshot was not found in HubSpot.');
  return decodeSnapshot(match[1]);
}
