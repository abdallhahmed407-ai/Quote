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

function isBlank(value: unknown): boolean {
  return value === undefined || value === null || String(value).trim() === '';
}

function money(value: unknown, currency: string): string {
  return `${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number(value))} ${currency}`;
}

function itemNumbers(item: JsonObject): { quantity: number; unitPrice: number; gross: number; discount: number; net: number; tax: number; periodNet: number } {
  const quantity = Math.max(number(item.quantity), 1);
  const unitPrice = number(item.price);
  const periodGross = number(item.hs_pre_discount_amount) || unitPrice * quantity;
  const itemDiscount = number(item.hs_total_discount || item.discount) || periodGross * (number(item.hs_discount_percentage) / 100);
  const periodNet = number(item.amount) || Math.max(periodGross - itemDiscount, 0);
  const contractNet = isBlank(item.hs_tcv) ? periodNet : number(item.hs_tcv);
  const contractGross = Math.max(periodGross, contractNet + itemDiscount);
  const contractDiscount = Math.max(contractGross - contractNet, 0);
  const tax = number(item.hs_tax_amount);
  return { quantity, unitPrice, gross: contractGross, discount: contractDiscount, net: contractNet, tax, periodNet };
}

function frequencyLabel(value: unknown, language: ProposalLanguage): string {
  const normalized = String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  const labels: Record<string, [string, string]> = {
    daily: ['Daily billing', 'فوترة يومية'],
    weekly: ['Weekly billing', 'فوترة أسبوعية'],
    monthly: ['Monthly billing', 'فوترة شهرية'],
    quarterly: ['Quarterly billing', 'فوترة ربع سنوية'],
    semi_annually: ['Semi-annual billing', 'فوترة نصف سنوية'],
    semiannually: ['Semi-annual billing', 'فوترة نصف سنوية'],
    every_six_months: ['Semi-annual billing', 'فوترة نصف سنوية'],
    annually: ['Annual billing', 'فوترة سنوية'],
    yearly: ['Annual billing', 'فوترة سنوية'],
    biennially: ['Billing every two years', 'فوترة كل سنتين'],
    one_time: ['One-time payment', 'دفعة واحدة'],
    onetime: ['One-time payment', 'دفعة واحدة'],
  };
  const pair = labels[normalized];
  if (pair) return language === 'ar' ? pair[1] : pair[0];
  if (!normalized) return '';
  const readable = normalized.replace(/_/g, ' ');
  return language === 'ar' ? `دورية الفوترة: ${readable}` : `${readable.replace(/\b\w/g, (char) => char.toUpperCase())} billing`;
}

function pluralizedDuration(value: number, unit: string, language: ProposalLanguage): string {
  if (language === 'ar') {
    const labels: Record<string, string> = {
      day: value === 1 ? 'يوم واحد' : `${value} أيام`,
      week: value === 1 ? 'أسبوع واحد' : `${value} أسابيع`,
      month: value === 1 ? 'شهر واحد' : `${value} شهرًا`,
      year: value === 1 ? 'سنة واحدة' : `${value} سنوات`,
    };
    return labels[unit] || `${value} ${unit}`;
  }
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

function parseTerm(value: unknown, language: ProposalLanguage): string {
  const raw = String(value || '').trim().toUpperCase();
  if (!raw) return '';
  const match = raw.match(/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?$/);
  if (!match) return '';
  const years = number(match[1]);
  const months = number(match[2]);
  const weeks = number(match[3]);
  const days = number(match[4]);
  const parts: string[] = [];
  if (years) parts.push(pluralizedDuration(years, 'year', language));
  if (months) parts.push(pluralizedDuration(months, 'month', language));
  if (weeks) parts.push(pluralizedDuration(weeks, 'week', language));
  if (days) parts.push(pluralizedDuration(days, 'day', language));
  if (!parts.length) return '';
  return language === 'ar' ? `مدة العقد ${parts.join(' و')}` : `${parts.join(' and ')} term`;
}

function derivedBillingCount(item: JsonObject, periodNet: number): number {
  const explicitPayments = number(item.hs_recurring_billing_number_of_payments);
  if (explicitPayments > 1) return Math.round(explicitPayments);
  const contractTotal = number(item.hs_tcv);
  if (contractTotal <= 0 || periodNet <= 0) return 0;
  const ratio = contractTotal / periodNet;
  const rounded = Math.round(ratio);
  return rounded > 1 && Math.abs(ratio - rounded) < 0.01 ? rounded : 0;
}

function billingSummary(item: JsonObject, periodNet: number, language: ProposalLanguage): string {
  const frequency = frequencyLabel(item.recurringbillingfrequency, language);
  const term = parseTerm(item.hs_recurring_billing_period, language);
  const count = derivedBillingCount(item, periodNet);
  const parts: string[] = [];

  if (frequency) parts.push(frequency);
  if (term) {
    parts.push(term);
  } else if (count > 1) {
    const normalizedFrequency = String(item.recurringbillingfrequency || '').trim().toLowerCase();
    if (normalizedFrequency === 'monthly') {
      parts.push(language === 'ar' ? `مدة العقد ${pluralizedDuration(count, 'month', language)}` : `${count}-month term`);
    } else {
      parts.push(language === 'ar' ? `${count} دفعات` : `${count} billing periods`);
    }
  }

  return parts.join(language === 'ar' ? ' · ' : ' · ');
}

function labels(language: ProposalLanguage) {
  if (language === 'en') {
    return {
      quote: 'Quote No.', expiry: 'Expiry Date',
      service: 'Service / Package', qty: 'Qty', unit: 'Unit Price', discount: 'Discount', total: 'Total',
      gross: 'Total Before Discount', totalDiscount: 'Total Discount', beforeTax: 'Total Before Tax', tax: 'VAT / Tax', grand: 'Grand Total', empty: 'No pricing line items have been added.'
    };
  }
  return {
    quote: 'رقم العرض', expiry: 'تاريخ انتهاء العرض',
    service: 'الخدمة / الباقة', qty: 'الكمية', unit: 'سعر الوحدة', discount: 'الخصم', total: 'الإجمالي',
    gross: 'الإجمالي قبل الخصم', totalDiscount: 'إجمالي الخصم', beforeTax: 'الإجمالي قبل الضريبة', tax: 'الضريبة', grand: 'الإجمالي النهائي', empty: 'لا توجد بنود سعرية مضافة.'
  };
}

export function renderPricing(snapshot: ProposalSnapshot, context: ProposalContext): PricingOutput {
  const language = context.language || 'ar';
  const l = labels(language);
  const items = Array.isArray(snapshot.lineItems) ? snapshot.lineItems : [];
  let gross = 0;
  let subtotal = 0;
  let discount = 0;
  let tax = 0;

  const rows = items.length ? items.map((item, index) => {
    const v = itemNumbers(item);
    gross += v.gross;
    subtotal += v.net;
    discount += v.discount;
    tax += v.tax;
    const billing = billingSummary(item, v.periodNet, language);
    const details = [
      billing ? `<small class="billing-note" style="color:#7b5ea7;font-weight:700;margin-top:4px;">${escapeHtml(billing)}</small>` : '',
      item.description ? `<small>${escapeHtml(item.description)}</small>` : '',
    ].join('');
    return `<tr><td>${index + 1}</td><td><b>${escapeHtml(item.name || (language === 'ar' ? 'خدمة أجور' : 'Ojoor Service'))}</b>${details}</td><td>${v.quantity}</td><td>${escapeHtml(money(v.unitPrice, context.currency))}</td><td>${escapeHtml(money(v.discount, context.currency))}</td><td>${escapeHtml(money(v.net, context.currency))}</td></tr>`;
  }).join('') : `<tr><td colspan="6">${escapeHtml(l.empty)}</td></tr>`;

  const grand = subtotal + tax;
  const tableStyle = 'width:88%;margin:0 auto;border-radius:10px 10px 0 0;overflow:hidden;';
  const totalsStyle = language === 'ar' ? 'width:44%;margin:22px auto 0 6%;' : 'width:44%;margin:22px 6% 0 auto;';
  const metaStyle = 'width:88%;margin:0 auto 22px;display:grid;grid-template-columns:1fr 1fr;gap:16px;';
  const metadata = `<div class="price-meta" style="${metaStyle}"><div><b>${escapeHtml(l.quote)}</b><span>${escapeHtml(context.quoteNumber)}</span></div><div><b>${escapeHtml(l.expiry)}</b><span>${escapeHtml(context.expirationDate || '-')}</span></div></div>`;

  return {
    firstBody: `<div class="price-box ${language === 'ar' ? 'rtl' : 'ltr'}">${metadata}<table class="price-table" style="${tableStyle}"><thead><tr><th>#</th><th>${escapeHtml(l.service)}</th><th>${escapeHtml(l.qty)}</th><th>${escapeHtml(l.unit)}</th><th>${escapeHtml(l.discount)}</th><th>${escapeHtml(l.total)}</th></tr></thead><tbody>${rows}</tbody></table><div class="price-totals" style="${totalsStyle}"><div><span>${escapeHtml(l.gross)}</span><b>${escapeHtml(money(gross, context.currency))}</b></div><div><span>${escapeHtml(l.totalDiscount)}</span><b>${escapeHtml(money(discount, context.currency))}</b></div><div><span>${escapeHtml(l.beforeTax)}</span><b>${escapeHtml(money(subtotal, context.currency))}</b></div><div><span>${escapeHtml(l.tax)}</span><b>${escapeHtml(money(tax, context.currency))}</b></div><div class="grand"><span>${escapeHtml(l.grand)}</span><b>${escapeHtml(money(grand, context.currency))}</b></div></div></div>`,
    extraPages: '',
  };
}
