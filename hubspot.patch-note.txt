import type { ProposalSnapshot } from './types';
import { escapeHtml, renderPricing, type ProposalContext, type ProposalLanguage } from './pricing';

const PROPOSAL_TIME_ZONE = 'Asia/Riyadh';
const OJOOR_LEGAL_NAME_AR = 'شركة الرائدة للموارد البشرية — أجور';
const OJOOR_LEGAL_NAME_EN = 'Al Raedah Human Resources Company — Ojoor';
const OJOOR_CR_NUMBER = '1010586885';
const OJOOR_VAT_NUMBER = '310712172300003';
const OJOOR_ADDRESS_AR = 'مبنى 8730، حي العليا، مكتب 309، الرمز البريدي 12214، الدور الثالث';
const OJOOR_ADDRESS_EN = 'Building No. 8730, Al Olaya District, Office No. 309, Postal Code 12214, Third Floor';

function replaceAll(source: string, marker: string, value: string): string {
  return source.split(marker).join(value);
}

function normalizeProposalLanguage(value: unknown): ProposalLanguage {
  const normalized = String(value || '').trim().toLowerCase();
  if (['english', 'en', 'eng', 'إنجليزي', 'انجليزي'].includes(normalized)) return 'en';
  return 'ar';
}

function formatProposalDate(value: unknown, language: ProposalLanguage): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  if (language === 'en') {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: PROPOSAL_TIME_ZONE }).format(date);
  }
  return new Intl.DateTimeFormat('ar-EG-u-ca-gregory-nu-arab', { day: 'numeric', month: 'long', year: 'numeric', timeZone: PROPOSAL_TIME_ZONE }).format(date);
}

function joinAddress(parts: unknown[], separator: string): string {
  return parts.map((part) => String(part || '').trim()).filter(Boolean).join(separator);
}

export function renderProposal(snapshot: ProposalSnapshot, template: string, _downloadPath = ''): string {
  const deal = snapshot.deal || {};
  const company = snapshot.company || {};
  const contact = snapshot.contact || {};
  const owner = snapshot.owner || {};
  const language = normalizeProposalLanguage(deal.proposal_language);

  const customerName = language === 'en'
    ? deal.legal_name_english || company.name || deal.legal_name_arabic || deal.dealname || ''
    : deal.legal_name_arabic || company.name || deal.legal_name_english || deal.dealname || '';
  const customerAddress = company.billing_address || deal.billing_address || joinAddress([company.address, company.address2, company.city, company.state, company.country, company.zip], language === 'en' ? ', ' : '، ');

  const context: ProposalContext = {
    customerName,
    customerCr: company.cr_number || deal.cr_number || '',
    customerVat: company.vat_number || deal.vat_number || '',
    customerAddress,
    contactName: [contact.firstname, contact.lastname].filter(Boolean).join(' '),
    ownerName: [owner.firstName, owner.lastName].filter(Boolean).join(' '),
    createdDate: formatProposalDate(snapshot.createdAt, language),
    expirationDate: formatProposalDate(deal.proposal_expiration_date, language),
    currency: snapshot.totals?.currency || 'SAR',
    quoteNumber: `OJR-${snapshot.dealId}-V${snapshot.version}`,
    language,
  };

  const pricing = renderPricing(snapshot, context);
  const values: Record<string, string> = {
    '{{CUSTOMER_NAME}}': escapeHtml(context.customerName),
    '{{CUSTOMER_CR}}': escapeHtml(context.customerCr || (language === 'ar' ? 'رقم السجل التجاري' : 'Commercial Registration No.')),
    '{{CUSTOMER_VAT}}': escapeHtml(context.customerVat || (language === 'ar' ? 'الرقم الضريبي' : 'Tax Number')),
    '{{CUSTOMER_ADDRESS}}': escapeHtml(context.customerAddress || (language === 'ar' ? 'عنوان المنشأة' : 'Company Address')),
    '{{OJOOR_LEGAL_NAME}}': escapeHtml(language === 'en' ? OJOOR_LEGAL_NAME_EN : OJOOR_LEGAL_NAME_AR),
    '{{OJOOR_CR}}': escapeHtml(OJOOR_CR_NUMBER),
    '{{OJOOR_VAT}}': escapeHtml(OJOOR_VAT_NUMBER),
    '{{OJOOR_ADDRESS}}': escapeHtml(language === 'en' ? OJOOR_ADDRESS_EN : OJOOR_ADDRESS_AR),
    '{{CONTACT_NAME}}': escapeHtml(context.contactName),
    '{{OWNER_NAME}}': escapeHtml(context.ownerName),
    '{{CREATED_DATE}}': escapeHtml(context.createdDate),
    '{{EXPIRATION_DATE}}': escapeHtml(context.expirationDate),
    '{{PRICING_BODY}}': pricing.firstBody,
    '{{EXTRA_PRICING_PAGES}}': pricing.extraPages,
  };

  let html = template;
  for (const [marker, value] of Object.entries(values)) html = replaceAll(html, marker, value);
  return html.replace(/\bOGR-/g, 'OJR-');
}
