import type { ProposalSnapshot } from './types';
import { escapeHtml, renderPricing, type ProposalContext } from './pricing';

function replaceAll(source: string, marker: string, value: string): string {
  return source.split(marker).join(value);
}

function replaceCidContent(source: string, cid: string, value: string): string {
  const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<(?:span|div)[^>]*data-cid=\"${escapedCid}\"[^>]*>)(.*?)(</(?:span|div)>)`, 's');
  return source.replace(pattern, (_match, opening: string, _content: string, closing: string) =>
    `${opening}${value}${closing}`);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function renumberPages(html: string): string {
  const total = (html.match(/<section class="page(?:\s|\")/g) || []).length;
  let current = 2;
  return html.replace(/<span class="page-num">[^<]*<\/span>/g, () => {
    const number = current++;
    return `<span class="page-num">${number} / ${total}</span>`;
  });
}

export function renderProposal(snapshot: ProposalSnapshot, template: string): string {
  const deal = snapshot.deal || {};
  const company = snapshot.company || {};
  const contact = snapshot.contact || {};
  const owner = snapshot.owner || {};

  const customerName = company.name || deal.legal_name_arabic || deal.legal_name_english || deal.dealname || '';
  const customerAddress = company.billing_address || deal.billing_address || [
    company.address,
    company.address2,
    company.city,
    company.state,
    company.country,
    company.zip,
  ].filter(Boolean).join('، ');

  const context: ProposalContext = {
    customerName,
    customerCr: company.cr_number || deal.cr_number || '',
    customerVat: company.vat_number || deal.vat_number || '',
    customerAddress,
    contactName: [contact.firstname, contact.lastname].filter(Boolean).join(' '),
    ownerName: [owner.firstName, owner.lastName].filter(Boolean).join(' '),
    createdDate: formatDate(snapshot.createdAt),
    currency: snapshot.totals?.currency || 'SAR',
    quoteNumber: `OJR-${snapshot.dealId}-V${snapshot.version}`,
  };

  const pricing = renderPricing(snapshot, context);
  const values: Record<string, string> = {
    '{{CUSTOMER_NAME}}': escapeHtml(context.customerName),
    '{{CUSTOMER_CR}}': escapeHtml(context.customerCr),
    '{{CUSTOMER_VAT}}': escapeHtml(context.customerVat),
    '{{CUSTOMER_ADDRESS}}': escapeHtml(context.customerAddress),
    '{{CONTACT_NAME}}': escapeHtml(context.contactName),
    '{{OWNER_NAME}}': escapeHtml(context.ownerName),
    '{{CREATED_DATE}}': escapeHtml(context.createdDate),
    '{{PRICING_BODY}}': pricing.firstBody,
    '{{EXTRA_PRICING_PAGES}}': pricing.extraPages,
  };

  let html = template;
  const cidValues: Record<string, string> = {
    '2WqGGa': values['{{CUSTOMER_NAME}}'],
    'x2nAbT': values['{{CREATED_DATE}}'],
    'jZvbMg': values['{{CUSTOMER_NAME}}'],
    'bnGZN1': values['{{CUSTOMER_CR}}'],
    'Gpnfdu': values['{{CUSTOMER_VAT}}'],
    'VzkAyN': values['{{CUSTOMER_ADDRESS}}'],
    'kODtr_': values['{{OWNER_NAME}}'],
    'j42ryV': values['{{CREATED_DATE}}'],
    'R-IAxZ': values['{{CONTACT_NAME}}'],
    'nl1wjI': values['{{CREATED_DATE}}'],
  };

  for (const [cid, value] of Object.entries(cidValues)) html = replaceCidContent(html, cid, value);
  for (const [marker, value] of Object.entries(values)) html = replaceAll(html, marker, value);
  return renumberPages(html);
}
