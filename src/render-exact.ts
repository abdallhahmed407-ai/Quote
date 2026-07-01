import type { ProposalSnapshot } from './types';
import { EXACT_PROPOSAL_TEMPLATE } from './exact/template';
import { EXACT_QUOTE_CSS, renderExactPricingPages } from './exact/pricing';
import { esc, formatDate, type RenderContext } from './render-utils';

const assetRoot = [
  'https:/',
  '/skyagent-artifacts.skywork.ai/image/',
  'a9641b5f-8555-4a27-a98a-2db128cbab19/',
].join('');

const coverImage = assetRoot
  + '9b35318c-9b61-42db-8fd1-6b5aad08305b/'
  + 'prod_agent_a9641b5f-8555-4a27-a98a-2db128cbab19/cover_cityscape_2.png';

const ecosystemImage = assetRoot
  + 'a63d728f-0398-45e5-9b7f-ffec098ef739/'
  + 'prod_agent_a9641b5f-8555-4a27-a98a-2db128cbab19/ecosystem_diagram_2.png';

const activationImage = assetRoot
  + '19ebca12-4c99-4a93-ab7f-32d0b82caf15/'
  + 'prod_agent_a9641b5f-8555-4a27-a98a-2db128cbab19/activation_timeline_2.png';

const replaceAll = (source: string, marker: string, value: string): string =>
  source.split(marker).join(value);

function renumberPages(html: string): string {
  const totalPages = (html.match(/<section class="page(?:\s|\")/g) || []).length;
  let pageNumber = 2;
  return html.replace(/<span class="page-num">[^<]*<\/span>/g, () =>
    `<span class="page-num">${pageNumber++} / ${totalPages}</span>`);
}

export function renderProposal(snapshot: ProposalSnapshot): string {
  const deal = snapshot.deal || {};
  const company = snapshot.company || {};
  const contact = snapshot.contact || {};
  const owner = snapshot.owner || {};

  const customerName = company.name || deal.legal_name_arabic || deal.legal_name_english
    || deal.dealname || '';
  const customerAddress = company.billing_address || deal.billing_address || [
    company.address,
    company.address2,
    company.city,
    company.state,
    company.country,
    company.zip,
  ].filter(Boolean).join('، ');

  const context: RenderContext = {
    customerName,
    customerCr: company.cr_number || deal.cr_number || '',
    customerVat: company.vat_number || deal.vat_number || '',
    customerAddress,
    contactName: [contact.firstname, contact.lastname].filter(Boolean).join(' '),
    contactEmail: contact.email || '',
    ownerName: [owner.firstName, owner.lastName].filter(Boolean).join(' '),
    ownerEmail: owner.email || '',
    createdDate: formatDate(snapshot.createdAt),
    currency: snapshot.totals?.currency || 'SAR',
    quoteNumber: `OJR-${snapshot.dealId}-V${snapshot.version}`,
  };

  let html = EXACT_PROPOSAL_TEMPLATE
    .replace('</style>', `${EXACT_QUOTE_CSS}</style>`)
    .replace('{{PRICING_PAGE}}', renderExactPricingPages(snapshot, context));

  const values: Record<string, string> = {
    '{{CUSTOMER_NAME}}': esc(context.customerName),
    '{{CUSTOMER_CR}}': esc(context.customerCr),
    '{{CUSTOMER_VAT}}': esc(context.customerVat),
    '{{CUSTOMER_ADDRESS}}': esc(context.customerAddress),
    '{{CONTACT_NAME}}': esc(context.contactName),
    '{{OWNER_NAME}}': esc(context.ownerName),
    '{{CREATED_DATE}}': esc(context.createdDate),
    '{{COVER_IMAGE}}': coverImage,
    '{{ECOSYSTEM_IMAGE}}': ecosystemImage,
    '{{ACTIVATION_IMAGE}}': activationImage,
  };

  for (const [marker, value] of Object.entries(values)) html = replaceAll(html, marker, value);
  return renumberPages(html);
}
