import type { ProposalSnapshot } from './types';
import { COVER_IMAGE_DATA_URL } from './assets';
import { ECOSYSTEM_IMAGE_DATA_URL } from './render-graphics';
import { injectActivationGraphic } from './inject-activation';
import { REFERENCE_TEMPLATE } from './reference-template';
import { ADDITIONAL_CSS } from './render-css';
import { renderPricingPages } from './render-pricing';
import { renderTermsPages } from './render-terms';
import { esc, formatDate, type RenderContext } from './render-utils';

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

  const html = REFERENCE_TEMPLATE
    .replace('</style>', `${ADDITIONAL_CSS}</style>`)
    .replace('{{CUSTOMER_NAME}}', esc(context.customerName))
    .replace('{{CREATED_DATE}}', esc(context.createdDate))
    .replace('{{COVER_IMAGE}}', COVER_IMAGE_DATA_URL)
    .replace('{{ECOSYSTEM_IMAGE}}', ECOSYSTEM_IMAGE_DATA_URL)
    .replace('{{PRICING_PAGES}}', renderPricingPages(snapshot, context))
    .replace('{{TERMS_PAGES}}', renderTermsPages(context));

  return injectActivationGraphic(html);
}
