import type { ProposalSnapshot } from './types';
import { REFERENCE_TEMPLATE } from './reference-template';
import { ADDITIONAL_CSS } from './render-css';
import { renderPricingPages } from './render-pricing';
import { renderTermsPages } from './render-terms';
import { esc, formatDate, type RenderContext } from './render-utils';

const imageRoot = [
  'https://',
  'skyagent-artifacts.skywork.ai/image/',
  'a9641b5f-8555-4a27-a98a-2db128cbab19/',
].join('');

const COVER_IMAGE = imageRoot
  + '9b35318c-9b61-42db-8fd1-6b5aad08305b/'
  + 'prod_agent_a9641b5f-8555-4a27-a98a-2db128cbab19/cover_cityscape_2.png';

const ECOSYSTEM_IMAGE = imageRoot
  + 'a63d728f-0398-45e5-9b7f-ffec098ef739/'
  + 'prod_agent_a9641b5f-8555-4a27-a98a-2db128cbab19/ecosystem_diagram_2.png';

const ACTIVATION_IMAGE = imageRoot
  + '19ebca12-4c99-4a93-ab7f-32d0b82caf15/'
  + 'prod_agent_a9641b5f-8555-4a27-a98a-2db128cbab19/activation_timeline_2.png';

export function renderProposal(snapshot: ProposalSnapshot): string {
  const deal = snapshot.deal || {};
  const company = snapshot.company || {};
  const contact = snapshot.contact || {};
  const owner = snapshot.owner || {};
  const customerName = company.name || deal.legal_name_arabic || deal.legal_name_english
    || deal.dealname || 'اسم العميل';
  const customerAddress = company.billing_address || deal.billing_address || [
    company.address, company.address2, company.city, company.state, company.country, company.zip,
  ].filter(Boolean).join('، ') || 'عنوان المنشأة';
  const context: RenderContext = {
    customerName,
    customerCr: company.cr_number || deal.cr_number || 'رقم السجل التجاري',
    customerVat: company.vat_number || deal.vat_number || 'الرقم الضريبي',
    customerAddress,
    contactName: [contact.firstname, contact.lastname].filter(Boolean).join(' ') || 'اسم ممثل العميل',
    contactEmail: contact.email || 'البريد الإلكتروني',
    ownerName: [owner.firstName, owner.lastName].filter(Boolean).join(' ') || 'ممثل أجور',
    ownerEmail: owner.email || 'البريد الإلكتروني',
    createdDate: formatDate(snapshot.createdAt),
    currency: snapshot.totals?.currency || 'SAR',
    quoteNumber: `OJR-${snapshot.dealId}-V${snapshot.version}`,
  };

  return REFERENCE_TEMPLATE
    .replace('</style>', `${ADDITIONAL_CSS}</style>`)
    .replace('{{CUSTOMER_NAME}}', esc(context.customerName))
    .replace('{{CREATED_DATE}}', esc(context.createdDate))
    .replace('{{COVER_IMAGE}}', COVER_IMAGE)
    .replace('{{ECOSYSTEM_IMAGE}}', ECOSYSTEM_IMAGE)
    .replace('{{ACTIVATION_IMAGE}}', ACTIVATION_IMAGE)
    .replace('{{PRICING_PAGES}}', renderPricingPages(snapshot, context))
    .replace('{{TERMS_PAGES}}', renderTermsPages(context));
}
