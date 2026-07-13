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

type DurationParts = {
  years: number;
  months: number;
  weeks: number;
  days: number;
};

type FrequencyKey = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annually' | 'annually' | 'biennially' | 'one_time' | 'custom';

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

function normalizeFrequency(item: JsonObject): FrequencyKey {
  const terms = String(item.hs_recurring_billing_terms || '').trim().toUpperCase();
  const payments = number(item.hs_recurring_billing_number_of_payments);
  if (terms === 'FIXED' && payments === 1) return 'one_time';

  const normalized = String(item.recurringbillingfrequency || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (!normalized) return 'one_time';
  if (normalized === 'daily') return 'daily';
  if (normalized === 'weekly') return 'weekly';
  if (normalized === 'monthly') return 'monthly';
  if (normalized === 'quarterly') return 'quarterly';
  if (['semi_annually', 'semiannually', 'every_six_months'].includes(normalized)) return 'semi_annually';
  if (['annually', 'annual', 'yearly'].includes(normalized)) return 'annually';
  if (['biennially', 'every_two_years'].includes(normalized)) return 'biennially';
  if (['one_time', 'onetime'].includes(normalized)) return 'one_time';
  return 'custom';
}

function frequencyLabel(item: JsonObject, language: ProposalLanguage): string {
  const key = normalizeFrequency(item);
  const labels: Record<FrequencyKey, [string, string]> = {
    daily: ['Daily', 'يوميًا'],
    weekly: ['Weekly', 'أسبوعيًا'],
    monthly: ['Monthly', 'شهريًا'],
    quarterly: ['Quarterly', 'ربع سنوي'],
    semi_annually: ['Semi-annually', 'نصف سنوي'],
    annually: ['Annually', 'سنويًا'],
    biennially: ['Every two years', 'كل سنتين'],
    one_time: ['One-time', 'مرة واحدة'],
    custom: [String(item.recurringbillingfrequency || 'Custom'), String(item.recurringbillingfrequency || 'مخصص')],
  };
  return language === 'ar' ? labels[key][1] : labels[key][0];
}

function frequencyUnit(item: JsonObject, language: ProposalLanguage): string {
  const key = normalizeFrequency(item);
  const labels: Record<FrequencyKey, [string, string]> = {
    daily: ['day', 'يوم'],
    weekly: ['week', 'أسبوع'],
    monthly: ['month', 'شهر'],
    quarterly: ['quarter', 'ربع سنة'],
    semi_annually: ['6 months', '6 أشهر'],
    annually: ['year', 'سنة'],
    biennially: ['2 years', 'سنتين'],
    one_time: ['', ''],
    custom: ['billing period', 'دورة فوترة'],
  };
  return language === 'ar' ? labels[key][1] : labels[key][0];
}

function parseDuration(value: unknown): DurationParts | null {
  const raw = String(value || '').trim().toUpperCase();
  const match = raw.match(/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?$/);
  if (!match) return null;
  return {
    years: number(match[1]),
    months: number(match[2]),
    weeks: number(match[3]),
    days: number(match[4]),
  };
}

function durationLabel(parts: DurationParts, language: ProposalLanguage): string {
  const values: string[] = [];
  const push = (value: number, enSingular: string, arSingular: string, arPlural: string) => {
    if (!value) return;
    if (language === 'ar') values.push(value === 1 ? arSingular : `${value} ${arPlural}`);
    else values.push(`${value} ${enSingular}${value === 1 ? '' : 's'}`);
  };
  push(parts.years, 'year', 'سنة واحدة', 'سنوات');
  push(parts.months, 'month', 'شهر واحد', 'شهرًا');
  push(parts.weeks, 'week', 'أسبوع واحد', 'أسابيع');
  push(parts.days, 'day', 'يوم واحد', 'أيام');
  return values.join(language === 'ar' ? ' و' : ' and ');
}

function derivedBillingCount(item: JsonObject, periodNet: number): number {
  const contractTotal = number(item.hs_tcv);
  if (contractTotal > 0 && periodNet > 0) {
    const ratio = contractTotal / periodNet;
    const rounded = Math.round(ratio);
    if (rounded >= 1 && Math.abs(ratio - rounded) < 0.01) return rounded;
  }

  const explicitPayments = number(item.hs_recurring_billing_number_of_payments);
  if (explicitPayments >= 1) return Math.round(explicitPayments);
  return 0;
}

function durationFromCount(item: JsonObject, count: number): DurationParts | null {
  if (count < 1) return null;
  const key = normalizeFrequency(item);
  if (key === 'daily') return { years: 0, months: 0, weeks: 0, days: count };
  if (key === 'weekly') return { years: 0, months: 0, weeks: count, days: 0 };
  if (key === 'monthly') return { years: 0, months: count, weeks: 0, days: 0 };
  if (key === 'quarterly') return { years: 0, months: count * 3, weeks: 0, days: 0 };
  if (key === 'semi_annually') return { years: 0, months: count * 6, weeks: 0, days: 0 };
  if (key === 'annually') return { years: count, months: 0, weeks: 0, days: 0 };
  if (key === 'biennially') return { years: count * 2, months: 0, weeks: 0, days: 0 };
  return null;
}

function contractTerm(item: JsonObject, periodNet: number, language: ProposalLanguage): string {
  if (normalizeFrequency(item) === 'one_time') return '';
  const explicit = parseDuration(item.hs_recurring_billing_period);
  if (explicit) return durationLabel(explicit, language);
  const count = derivedBillingCount(item, periodNet);
  const derived = durationFromCount(item, count);
  return derived ? durationLabel(derived, language) : '';
}

function contractMultiplier(item: JsonObject, periodNet: number): number {
  const contractTotal = number(item.hs_tcv);
  if (contractTotal > 0 && periodNet > 0) {
    const ratio = contractTotal / periodNet;
    if (Number.isFinite(ratio) && ratio > 0) return ratio;
  }

  const explicitPayments = number(item.hs_recurring_billing_number_of_payments);
  if (explicitPayments >= 1) return explicitPayments;

  const duration = parseDuration(item.hs_recurring_billing_period);
  const key = normalizeFrequency(item);
  if (!duration || key === 'one_time') return 1;
  const totalMonths = duration.years * 12 + duration.months;
  if (key === 'monthly' && totalMonths > 0) return totalMonths;
  if (key === 'quarterly' && totalMonths > 0) return totalMonths / 3;
  if (key === 'semi_annually' && totalMonths > 0) return totalMonths / 6;
  if (key === 'annually' && totalMonths > 0) return totalMonths / 12;
  if (key === 'biennially' && totalMonths > 0) return totalMonths / 24;
  if (key === 'weekly' && duration.weeks > 0) return duration.weeks;
  if (key === 'daily' && duration.days > 0) return duration.days;
  return 1;
}

function itemNumbers(item: JsonObject): { quantity: number; unitPrice: number; gross: number; discount: number; net: number; tax: number; periodNet: number } {
  const quantity = Math.max(number(item.quantity), 1);
  const unitPrice = number(item.price);
  const periodGross = number(item.hs_pre_discount_amount) || unitPrice * quantity;
  const periodDiscount = number(item.hs_total_discount || item.discount) || periodGross * (number(item.hs_discount_percentage) / 100);
  const periodNet = number(item.amount) || Math.max(periodGross - periodDiscount, 0);
  const multiplier = contractMultiplier(item, periodNet);
  const contractNet = isBlank(item.hs_tcv) ? periodNet * multiplier : number(item.hs_tcv);
  const contractGross = Math.max(periodGross * multiplier, contractNet);
  const contractDiscount = Math.max(contractGross - contractNet, periodDiscount * multiplier, 0);
  const tax = number(item.hs_tax_amount);
  return { quantity, unitPrice, gross: contractGross, discount: contractDiscount, net: contractNet, tax, periodNet };
}

function labels(language: ProposalLanguage) {
  if (language === 'en') {
    return {
      quote: 'Quote No.', expiry: 'Expiry Date',
      service: 'Products & Services', billing: 'Billing Frequency', qty: 'Quantity', unit: 'Unit Price', total: 'Contract Price',
      gross: 'Contract subtotal before discount', totalDiscount: 'Total discount', beforeTax: 'Contract subtotal', tax: 'VAT / Tax', grand: 'Total Contract Value',
      discount: 'Discount', forTerm: 'for', empty: 'No pricing line items have been added.'
    };
  }
  return {
    quote: 'رقم العرض', expiry: 'تاريخ انتهاء العرض',
    service: 'المنتجات والخدمات', billing: 'دورية الفوترة', qty: 'الكمية', unit: 'سعر الوحدة', total: 'قيمة العقد',
    gross: 'إجمالي العقد قبل الخصم', totalDiscount: 'إجمالي الخصم', beforeTax: 'إجمالي العقد قبل الضريبة', tax: 'الضريبة', grand: 'إجمالي قيمة العقد',
    discount: 'خصم', forTerm: 'لمدة', empty: 'لا توجد بنود سعرية مضافة.'
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

  const rows = items.length ? items.map((item) => {
    const v = itemNumbers(item);
    gross += v.gross;
    subtotal += v.net;
    discount += v.discount;
    tax += v.tax;

    const frequency = frequencyLabel(item, language);
    const unit = frequencyUnit(item, language);
    const term = contractTerm(item, v.periodNet, language);
    const unitSuffix = unit ? (language === 'ar' ? `لكل ${unit}` : `/ ${unit}`) : '';
    const termLine = term ? `${l.forTerm} ${term}` : '';
    const discountLine = v.discount > 0
      ? `<span style="display:inline-block;margin-top:6px;padding:3px 8px;border-radius:999px;background:#f1ecfb;color:#6d4fa0;font-size:9px;font-weight:800;white-space:nowrap;">${escapeHtml(l.discount)} ${escapeHtml(money(v.discount, context.currency))}</span>`
      : '';
    const description = item.description
      ? `<small style="display:block;margin-top:5px;color:#6d7280;line-height:1.35;">${escapeHtml(item.description)}</small>`
      : '';

    return `<tr>
      <td style="width:31%;"><b style="display:block;color:#172b73;">${escapeHtml(item.name || (language === 'ar' ? 'خدمة أجور' : 'Ojoor Service'))}</b>${description}</td>
      <td style="width:16%;"><b style="display:block;color:#172b73;">${escapeHtml(frequency)}</b>${term ? `<small style="display:block;margin-top:5px;color:#7b5ea7;font-weight:700;">${escapeHtml(term)}</small>` : ''}</td>
      <td style="width:10%;text-align:center;">${v.quantity}</td>
      <td style="width:20%;"><b style="display:block;white-space:nowrap;color:#172b73;">${escapeHtml(money(v.unitPrice, context.currency))}</b>${unitSuffix ? `<small style="display:block;margin-top:4px;color:#6d7280;">${escapeHtml(unitSuffix)}</small>` : ''}</td>
      <td style="width:23%;"><b style="display:block;white-space:nowrap;color:#172b73;">${escapeHtml(money(v.net, context.currency))}</b>${termLine ? `<small style="display:block;margin-top:4px;color:#6d7280;">${escapeHtml(termLine)}</small>` : ''}${discountLine}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="5">${escapeHtml(l.empty)}</td></tr>`;

  const grand = subtotal + tax;
  const tableStyle = 'width:88%;margin:0 auto;border-radius:12px 12px 0 0;overflow:hidden;table-layout:fixed;';
  const totalsStyle = language === 'ar' ? 'width:44%;margin:22px auto 0 6%;' : 'width:44%;margin:22px 6% 0 auto;';
  const metaStyle = 'width:88%;margin:0 auto 18px;display:grid;grid-template-columns:1fr 1fr;gap:16px;';
  const metadata = `<div class="price-meta" style="${metaStyle}"><div><b>${escapeHtml(l.quote)}</b><span>${escapeHtml(context.quoteNumber)}</span></div><div><b>${escapeHtml(l.expiry)}</b><span>${escapeHtml(context.expirationDate || '-')}</span></div></div>`;

  return {
    firstBody: `<div class="price-box ${language === 'ar' ? 'rtl' : 'ltr'}">${metadata}<table class="price-table" style="${tableStyle}"><thead><tr><th>${escapeHtml(l.service)}</th><th>${escapeHtml(l.billing)}</th><th style="text-align:center;">${escapeHtml(l.qty)}</th><th>${escapeHtml(l.unit)}</th><th>${escapeHtml(l.total)}</th></tr></thead><tbody>${rows}</tbody></table><div class="price-totals" style="${totalsStyle}"><div><span>${escapeHtml(l.gross)}</span><b>${escapeHtml(money(gross, context.currency))}</b></div><div><span>${escapeHtml(l.totalDiscount)}</span><b>${escapeHtml(money(discount, context.currency))}</b></div><div><span>${escapeHtml(l.beforeTax)}</span><b>${escapeHtml(money(subtotal, context.currency))}</b></div><div><span>${escapeHtml(l.tax)}</span><b>${escapeHtml(money(tax, context.currency))}</b></div><div class="grand"><span>${escapeHtml(l.grand)}</span><b>${escapeHtml(money(grand, context.currency))}</b></div></div></div>`,
    extraPages: '',
  };
}
