import type { JsonObject, ProposalSnapshot } from './types';

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
}

export interface PricingOutput {
  firstBody: string;
  extraPages: string;
}

interface NormalizedTotals {
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeLines(value: unknown): string {
  return escapeHtml(value).replace(/\r?\n/g, '<br>');
}

function number(value: unknown): number {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: unknown, currency: string): string {
  const amount = number(value);
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currency}`;
}

function billingLabel(value: unknown): string {
  const normalized = String(value || '').toLowerCase();
  const labels: Record<string, string> = {
    monthly: 'شهري',
    quarterly: 'ربع سنوي',
    per_six_months: 'نصف سنوي',
    annually: 'سنوي',
    yearly: 'سنوي',
  };
  return labels[normalized] || String(value || '');
}

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result.length ? result : [[]];
}

function itemNumbers(item: JsonObject): { quantity: number; unitPrice: number; discount: number; net: number; tax: number } {
  const quantity = Math.max(number(item.quantity), 1);
  const unitPrice = number(item.price);
  const gross = number(item.hs_pre_discount_amount) || unitPrice * quantity;
  const discount = number(item.hs_total_discount || item.discount)
    || gross * (number(item.hs_discount_percentage) / 100);
  const net = number(item.amount) || Math.max(gross - discount, 0);
  const tax = number(item.hs_tax_amount);
  return { quantity, unitPrice, discount, net, tax };
}

function normalizeTotals(snapshot: ProposalSnapshot): NormalizedTotals {
  const items = Array.isArray(snapshot.lineItems) ? snapshot.lineItems : [];
  const calculated = items.reduce<NormalizedTotals>((result, item) => {
    const values = itemNumbers(item);
    result.subtotal += values.net;
    result.discount += values.discount;
    result.tax += values.tax;
    result.grandTotal = result.subtotal + result.tax;
    return result;
  }, { subtotal: 0, discount: 0, tax: 0, grandTotal: 0 });

  const stored = (snapshot as unknown as {
    totals?: Partial<ProposalSnapshot['totals']>;
  }).totals || {};

  const subtotal = stored.subtotal === undefined ? calculated.subtotal : number(stored.subtotal);
  const discount = stored.discount === undefined ? calculated.discount : number(stored.discount);
  const tax = stored.tax === undefined ? calculated.tax : number(stored.tax);
  const grandTotal = stored.grandTotal === undefined ? subtotal + tax : number(stored.grandTotal);

  return { subtotal, discount, tax, grandTotal };
}

function rows(items: JsonObject[], pageOffset: number, currency: string): string {
  if (!items.length) {
    return '<tr><td colspan="6"><div class="pricing-empty">لا توجد بنود سعرية مضافة على الصفقة في HubSpot.</div></td></tr>';
  }

  return items.map((item, index) => {
    const values = itemNumbers(item);
    const name = item.name || 'خدمة أجور';
    const description = item.description || '';
    const tags = [
      item.hs_sku ? `SKU: ${item.hs_sku}` : '',
      billingLabel(item.recurringbillingfrequency),
    ].filter(Boolean).map((tag) => `<span class="pricing-tag">${escapeHtml(tag)}</span>`).join('');

    return `<tr>
      <td>${pageOffset + index + 1}</td>
      <td>
        <span class="pricing-item-name">${escapeHtml(name)}</span>
        ${description ? `<span class="pricing-item-description">${escapeLines(description)}</span>` : ''}
        ${tags ? `<span class="pricing-tags">${tags}</span>` : ''}
      </td>
      <td><span class="pricing-ltr">${values.quantity}</span></td>
      <td><span class="pricing-ltr">${escapeHtml(money(values.unitPrice, currency))}</span></td>
      <td><span class="pricing-ltr">${escapeHtml(money(values.discount, currency))}</span></td>
      <td><span class="pricing-ltr">${escapeHtml(money(values.net, currency))}</span></td>
    </tr>`;
  }).join('');
}

function table(items: JsonObject[], pageOffset: number, currency: string): string {
  return `<div class="pricing-table-wrap">
    <table class="pricing-table">
      <thead><tr>
        <th>#</th>
        <th>الخدمة / الباقة</th>
        <th>الكمية</th>
        <th>سعر الوحدة</th>
        <th>الخصم</th>
        <th>الإجمالي</th>
      </tr></thead>
      <tbody>${rows(items, pageOffset, currency)}</tbody>
    </table>
  </div>`;
}

function heading(context: ProposalContext): string {
  return `<div class="pricing-title-row">
    <h1 class="sec-title">عرض السعر التفصيلي</h1>
    <div class="pricing-reference-grid" style="display:flex;gap:12px;align-items:stretch;direction:rtl">
      <div class="pricing-quote-number" style="min-width:190px">
        <small>رقم العرض</small>
        <strong>${escapeHtml(context.quoteNumber)}</strong>
      </div>
      <div class="pricing-quote-number" style="min-width:190px">
        <small>تاريخ انتهاء العرض</small>
        <strong>${escapeHtml(context.expirationDate || '-')}</strong>
      </div>
    </div>
  </div>
  <div class="pricing-meta">
    <div><b>مقدم إلى</b><span>${escapeHtml(context.customerName || '-')}</span></div>
    <div><b>التاريخ</b><span>${escapeHtml(context.createdDate)}</span></div>
    <div><b>العملة</b><span class="pricing-ltr">${escapeHtml(context.currency)}</span></div>
  </div>`;
}

function totals(snapshot: ProposalSnapshot, context: ProposalContext): string {
  const normalized = normalizeTotals(snapshot);
  const gross = normalized.subtotal + normalized.discount;
  return `<div class="pricing-bottom pricing-bottom-totals-only">
    <div class="pricing-totals" style="width:50%;margin-right:auto">
      <div class="pricing-total-row"><span>الإجمالي قبل الخصم</span><span>${escapeHtml(money(gross, context.currency))}</span></div>
      <div class="pricing-total-row"><span>إجمالي الخصم</span><span>${escapeHtml(money(normalized.discount, context.currency))}</span></div>
      <div class="pricing-total-row"><span>الإجمالي قبل الضريبة</span><span>${escapeHtml(money(normalized.subtotal, context.currency))}</span></div>
      <div class="pricing-total-row"><span>الضريبة</span><span>${escapeHtml(money(normalized.tax, context.currency))}</span></div>
      <div class="pricing-total-row grand"><span>الإجمالي النهائي</span><span>${escapeHtml(money(normalized.grandTotal, context.currency))}</span></div>
    </div>
  </div>`;
}

function extraPage(content: string): string {
  return `<section class="page pricing-extra-page">
    <header class="inner-header">
      <div class="ih-logo">ojoor<small>HR STATION</small></div>
      <span class="ih-title">عرض السعر التفصيلي</span>
    </header>
    <div class="inner-content">${content}</div>
    <footer class="inner-footer">
      <span>منصة أجور للموارد البشرية والرواتب - سري وخاص</span>
      <span class="page-num"></span>
      <span>ojoor.net</span>
    </footer>
  </section>`;
}

export function renderPricing(snapshot: ProposalSnapshot, context: ProposalContext): PricingOutput {
  const items = Array.isArray(snapshot.lineItems) ? snapshot.lineItems : [];
  const groups = chunks(items, 6);
  const firstIsLast = groups.length === 1;
  const firstBody = `${heading(context)}${table(groups[0], 0, context.currency)}${
    firstIsLast ? totals(snapshot, context) : '<div class="pricing-continued">يتبع عرض السعر التفصيلي في الصفحة التالية.</div>'
  }`;

  const extraPages = groups.slice(1).map((group, index) => {
    const isLast = index === groups.length - 2;
    const offset = (index + 1) * 6;
    const content = `${heading(context)}${table(group, offset, context.currency)}${
      isLast ? totals(snapshot, context) : '<div class="pricing-continued">يتبع عرض السعر التفصيلي في الصفحة التالية.</div>'
    }`;
    return extraPage(content);
  }).join('');

  return { firstBody, extraPages };
}
