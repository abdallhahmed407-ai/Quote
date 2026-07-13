import type { JsonObject, ProposalSnapshot } from './types';

export type ProposalLanguage = 'ar' | 'en';

export interface ProposalContext {
  customerName: string;
  customerCr: string;
  customerVat: string;
  customerAddress: string;
  contactName: string;
  ownerName: string;
  createdDate: string;
  expirationDate: string;
  currency: string;
  quoteNumber: string;
  language?: ProposalLanguage;
}

export interface PricingOutput {
  firstBody: string;
  extraPages: string;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function number(value: unknown): number {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: unknown, currency: string): string {
  return `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number(value))} ${currency}`;
}

function itemNumbers(item: JsonObject): { quantity: number; unitPrice: number; discount: number; net: number; tax: number } {
  const quantity = Math.max(number(item.quantity), 1);
  const unitPrice = number(item.price);
  const gross = number(item.hs_pre_discount_amount) || unitPrice * quantity;
  const discount = number(item.hs_total_discount || item.discount) || gross * (number(item.hs_discount_percentage) / 100);
  const net = number(item.amount) || Math.max(gross - discount, 0);
  const tax = number(item.hs_tax_amount);
  return { quantity, unitPrice, discount, net, tax };
}

function labels(language: ProposalLanguage) {
  if (language === 'en') {
    return {
      title: 'Detailed Price Proposal', customer: 'Prepared For', issueDate: 'Date', currency: 'Currency', quote: 'Quote No.', expiry: 'Expiry Date',
      service: 'Service / Package', qty: 'Qty', unit: 'Unit Price', discount: 'Discount', total: 'Total',
      gross: 'Total Before Discount', totalDiscount: 'Total Discount', beforeTax: 'Total Before Tax', tax: 'VAT / Tax', grand: 'Grand Total', empty: 'No pricing line items have been added.'
    };
  }
  return {
    title: 'عرض السعر التفصيلي', customer: 'مقدم إلى', issueDate: 'التاريخ', currency: 'العملة', quote: 'رقم العرض', expiry: 'تاريخ انتهاء العرض',
    service: 'الخدمة / الباقة', qty: 'الكمية', unit: 'سعر الوحدة', discount: 'الخصم', total: 'الإجمالي',
    gross: 'الإجمالي قبل الخصم', totalDiscount: 'إجمالي الخصم', beforeTax: 'الإجمالي قبل الضريبة', tax: 'الضريبة', grand: 'الإجمالي النهائي', empty: 'لا توجد بنود سعرية مضافة.'
  };
}

export function renderPricing(snapshot: ProposalSnapshot, context: ProposalContext): PricingOutput {
  const language = context.language || 'ar';
  const l = labels(language);
  const items = Array.isArray(snapshot.lineItems) ? snapshot.lineItems : [];
  let subtotal = 0;
  let discount = 0;
  let tax = 0;

  const rows = items.length ? items.map((item, index) => {
    const v = itemNumbers(item);
    subtotal += v.net;
    discount += v.discount;
    tax += v.tax;
    return `<tr><td>${index + 1}</td><td><b>${escapeHtml(item.name || (language === 'ar' ? 'خدمة أجور' : 'Ojoor Service'))}</b>${item.description ? `<small>${escapeHtml(item.description)}</small>` : ''}</td><td>${v.quantity}</td><td>${escapeHtml(money(v.unitPrice, context.currency))}</td><td>${escapeHtml(money(v.discount, context.currency))}</td><td>${escapeHtml(money(v.net, context.currency))}</td></tr>`;
  }).join('') : `<tr><td colspan="6">${escapeHtml(l.empty)}</td></tr>`;

  const gross = subtotal + discount;
  const grand = subtotal + tax;
  const tableStyle = 'width:88%;margin:0 auto;border-radius:10px 10px 0 0;overflow:hidden;';
  const totalsStyle = language === 'ar' ? 'width:44%;margin:22px auto 0 6%;' : 'width:44%;margin:22px 6% 0 auto;';

  const title = `<div class="price-section-title"><span></span><h2>${escapeHtml(l.title)}</h2></div>`;
  const metadata = `<div class="price-meta price-meta-complete">
    <div class="price-card quote-card"><b>${escapeHtml(l.quote)}</b><span>${escapeHtml(context.quoteNumber)}</span></div>
    <div class="price-card expiry-card"><b>${escapeHtml(l.expiry)}</b><span>${escapeHtml(context.expirationDate || '-')}</span></div>
    <div class="price-card customer-card"><b>${escapeHtml(l.customer)}</b><span>${escapeHtml(context.customerName || '-')}</span></div>
    <div class="price-card issue-card"><b>${escapeHtml(l.issueDate)}</b><span>${escapeHtml(context.createdDate || '-')}</span></div>
    <div class="price-card currency-card"><b>${escapeHtml(l.currency)}</b><span>${escapeHtml(context.currency || 'SAR')}</span></div>
  </div>`;

  return {
    firstBody: `<div class="price-box ${language === 'ar' ? 'rtl' : 'ltr'}">${title}${metadata}<table class="price-table" style="${tableStyle}"><thead><tr><th>#</th><th>${escapeHtml(l.service)}</th><th>${escapeHtml(l.qty)}</th><th>${escapeHtml(l.unit)}</th><th>${escapeHtml(l.discount)}</th><th>${escapeHtml(l.total)}</th></tr></thead><tbody>${rows}</tbody></table><div class="price-totals" style="${totalsStyle}"><div><span>${escapeHtml(l.gross)}</span><b>${escapeHtml(money(gross, context.currency))}</b></div><div><span>${escapeHtml(l.totalDiscount)}</span><b>${escapeHtml(money(discount, context.currency))}</b></div><div><span>${escapeHtml(l.beforeTax)}</span><b>${escapeHtml(money(subtotal, context.currency))}</b></div><div><span>${escapeHtml(l.tax)}</span><b>${escapeHtml(money(tax, context.currency))}</b></div><div class="grand"><span>${escapeHtml(l.grand)}</span><b>${escapeHtml(money(grand, context.currency))}</b></div></div></div>`,
    extraPages: '',
  };
}
