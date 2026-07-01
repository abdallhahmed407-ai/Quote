import type { ProposalSnapshot } from './types';
import { REFERENCE_TEMPLATE } from './reference-template';
import { ORIGINAL_DYNAMIC_CSS } from './render-original-css';
import { renderOriginalTermsPages } from './render-original-terms';
import { renderPricingPages } from './render-pricing';
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

export function renderProposal(snapshot: ProposalSnapshot): string {
  const deal = snapshot.deal || {};
  const company = snapshot.company || {};
  const contact = snapshot.contact || {};
  const owner = snapshot.owner || {};
  const customerName = company.name || deal.legal_name_arabic || deal.legal_name_english
    || deal.dealname || '';
  const customerAddress = company.billing_address || deal.billing_address || [
    company.address, company.address2, company.city, company.state, company.country, company.zip,
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

  return REFERENCE_TEMPLATE
    .replace('</style>', `${ORIGINAL_DYNAMIC_CSS}</style>`)
    .replace('{{CUSTOMER_NAME}}', esc(context.customerName))
    .replace('{{CREATED_DATE}}', esc(context.createdDate))
    .replace('{{COVER_IMAGE}}', coverImage)
    .replace('{{ECOSYSTEM_IMAGE}}', ecosystemImage)
    .replace('{{ACTIVATION_IMAGE}}', activationImage)
    .replace('{{PRICING_PAGES}}', renderPricingPages(snapshot, context))
    .replace('{{TERMS_PAGES}}', renderOriginalTermsPages(context));
}
