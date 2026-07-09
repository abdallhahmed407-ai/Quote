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

function replaceCidContent(source: string, cid: string, value: string): string {
  const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<([A-Za-z][\\w:-]*)\\b[^>]*\\bdata-cid=["']${escapedCid}["'][^>]*>)([\\s\\S]*?)(<\\/\\2>)`, 'g');
  return source.replace(pattern, (_match, opening: string, _tag: string, _content: string, closing: string) => `${opening}${value}${closing}`);
}

function replaceCidOuter(source: string, cid: string, value: string): string {
  const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<([A-Za-z][\\w:-]*)\\b[^>]*\\bdata-cid=["']${escapedCid}["'][^>]*>[\\s\\S]*?<\\/\\1>`, 'g');
  return source.replace(pattern, value);
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

function injectDynamicStyles(html: string): string {
  const style = `<style id="ojoor-dynamic-hubspot-styles">
    .page-num{font-size:10px;color:#9999BB;font-weight:600;direction:ltr;unicode-bidi:isolate;min-width:64px;text-align:center;display:inline-block}
    .dynamic-pricing-body{display:block!important;align-items:initial!important;justify-content:initial!important;text-align:initial!important;padding-top:0!important;margin-top:0!important;min-height:auto!important;height:auto!important;background:transparent!important;transform:translateY(5px)!important;transform-origin:top center!important}.dynamic-pricing-body .price-box{margin-top:0!important}
    .price-box{font-family:Cairo,Arial,Tahoma,sans-serif;color:#172b73;font-size:12px;line-height:1.45;width:100%;direction:inherit}.price-box.rtl{direction:rtl;text-align:right}.price-box.ltr{direction:ltr;text-align:left}.price-meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:0 0 22px}.price-meta div{background:#f4f1fb;border:1px solid #ded8ee;border-radius:10px;padding:13px 16px}.price-meta b{display:block;color:#7b5ea7;margin-bottom:4px;font-size:12px}.price-meta span{direction:ltr;unicode-bidi:plaintext;color:#172b73}.price-table{width:100%;border-collapse:collapse;font-size:12px}.price-table th{background:#1f347f;color:#fff;padding:11px 13px;text-align:inherit;font-weight:700}.price-table td{border-bottom:1px solid #e1ddec;padding:11px 13px;vertical-align:top}.price-table tr:nth-child(even) td{background:#f6f3fb}.price-table small{display:block;color:#666;font-size:10px;margin-top:3px}.price-totals{width:310px;margin-top:22px;margin-inline-start:auto;border:1px solid #ded8ee;border-radius:10px;overflow:hidden;font-size:12px}.price-totals div{display:flex;justify-content:space-between;gap:12px;padding:10px 13px;border-bottom:1px solid #eee}.price-totals .grand{background:#1f347f;color:#fff;font-weight:800}.price-box.rtl .price-totals{margin-right:0;margin-left:auto}.price-box.ltr .price-totals{margin-left:auto;margin-right:0}
    .sig-line-row .sl-dots,.pf .ef,.pf .pf-value,.cover-card .cc-value,.cover-card .ef-light{white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important}.cover-card .cc-value,.cover-card .ef-light,[data-cid="QX2Xfb"],[data-cid="HfpEDS"],[data-cid="MzWWQN"],[data-cid="2WqGGa"]{font-size:18px!important;line-height:1.08!important;max-height:44px!important;overflow:hidden!important;text-align:center!important;display:flex!important;align-items:center!important;justify-content:center!important;padding-inline:8px!important}.cover-card [data-cid="K7Bu6y"],.cover-card [data-cid="UqDNGq"],[data-cid="qJ3WHc"],[data-cid="x2nAbT"]{font-size:18px!important;line-height:1.08!important;text-align:center!important}.sigs-row .sl-dots{font-weight:700;color:#26324c;line-height:1.15}.party-card .pf-value,.party-card .ef{font-weight:700;color:#26324c;line-height:1.2}.party-card .pf-value{min-height:22px}.party-card .pf-value .ef{display:inline!important}.inner-content{page-break-inside:avoid}.page{page-break-after:always;break-after:page;overflow:hidden}.page:last-of-type{page-break-after:auto;break-after:auto}html[lang="en"] .sigs-row .sl-dots{transform:translateY(-17px)}
    @media print{@page{size:A4;margin:0}html,body{margin:0!important;background:#fff!important}.page{margin:0!important;box-shadow:none!important}}
  </style>`;
  return html.includes('</head>') ? html.replace('</head>', `${style}</head>`) : `${style}${html}`;
}

function injectPageNumbers(html: string): string {
  if (html.includes('class="page-num"') || html.includes("class='page-num'")) return html;
  const sectionCount = (html.match(/<section class="page(?:\s|")/g) || []).length || (html.match(/<section\b/g) || []).length;
  if (!sectionCount) return html;
  let current = 2;
  return html.replace(
    /(<footer class="inner-footer"[^>]*>\s*<span[^>]*>[\s\S]*?<\/span>)[\s\S]*?(<span[^>]*>\s*ojoor\.net\s*<\/span>\s*<\/footer>)/g,
    (_match, first: string, last: string) => `${first}<span class="page-num">${current++} / ${sectionCount}</span>${last}`,
  );
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

  let html = injectPageNumbers(injectDynamicStyles(template));

  const cidValues: Record<string, string> = language === 'en'
    ? {
      QX2Xfb: values['{{CUSTOMER_NAME}}'], HfpEDS: values['{{CUSTOMER_NAME}}'],
      K7Bu6y: values['{{CREATED_DATE}}'], UqDNGq: values['{{CREATED_DATE}}'],
      BA5R34: values['{{CUSTOMER_NAME}}'], '-86fZo': values['{{CUSTOMER_NAME}}'],
      ogxdcs: values['{{CUSTOMER_CR}}'], gTQRu5: values['{{CUSTOMER_CR}}'],
      sJOAK8: values['{{CUSTOMER_VAT}}'], ivvYPk: values['{{CUSTOMER_VAT}}'],
      '2RObk5': values['{{CUSTOMER_ADDRESS}}'], Q2jzR7: values['{{CUSTOMER_ADDRESS}}'],
      ynPTB: values['{{OWNER_NAME}}'], 'ynPTB-': values['{{OWNER_NAME}}'],
      ZTFgC: values['{{CREATED_DATE}}'], 'ZTFgC-': values['{{CREATED_DATE}}'],
      iRqSBF: '', Qcvb8K: '', Au8d6g: '', LrQYZ5: '',
    }
    : {
      MzWWQN: values['{{CUSTOMER_NAME}}'], '2WqGGa': values['{{CUSTOMER_NAME}}'],
      qJ3WHc: values['{{CREATED_DATE}}'], x2nAbT: values['{{CREATED_DATE}}'],
      xB8K53: values['{{CUSTOMER_NAME}}'], jZvbMg: values['{{CUSTOMER_NAME}}'],
      mlVSEo: values['{{CUSTOMER_CR}}'], bnGZN1: values['{{CUSTOMER_CR}}'],
      teEWVO: values['{{CUSTOMER_VAT}}'], Gpnfdu: values['{{CUSTOMER_VAT}}'],
      NpEsFj: values['{{CUSTOMER_ADDRESS}}'], VzkAyN: values['{{CUSTOMER_ADDRESS}}'],
      kODtr_: values['{{OWNER_NAME}}'], j42ryV: values['{{CREATED_DATE}}'],
      '6xAF3a': '', 'R-IAxZ': '', nl1wjI: '', Ie8gsS: '',
    };

  for (const [cid, value] of Object.entries(cidValues)) html = replaceCidContent(html, cid, value);
  html = replaceCidOuter(html, language === 'en' ? 'DE4VvI' : 'a24TUK', `<div class="empty-body dynamic-pricing-body">${pricing.firstBody}</div>`);
  for (const [marker, value] of Object.entries(values)) html = replaceAll(html, marker, value);
  return html
    .replace(/\bOGR-/g, 'OJR-')
    .replace(/مبنى\s*8758/g, 'مبنى 8730')
    .replace(/Building\s*No\.?\s*8758/gi, 'Building No. 8730')
    .replace(/BuildingNo\.?\s*8758/gi, 'Building No. 8730')
    .replace(/Building\s*No\.?\s*8730/gi, 'Building No. 8730')
    .replace(/BuildingNo\.?\s*8730/gi, 'Building No. 8730');
}
