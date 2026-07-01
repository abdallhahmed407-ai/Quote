import type { ProposalSnapshot } from './types';
import {
  billingLabel, chunks, esc, escLines, ltr, money, num, page, type RenderContext,
} from './render-utils';

export function renderPricingPages(snapshot: ProposalSnapshot, context: RenderContext): string {
  const pricingChunks = chunks(snapshot.lineItems || [], 7);
  return pricingChunks.map((items, pageIndex) => {
    const startIndex = pageIndex * 7;
    const rows = items.map((item, itemIndex) => {
      const quantity = Math.max(num(item.quantity), 1);
      const unitPrice = num(item.price);
      const gross = num(item.hs_pre_discount_amount) || unitPrice * quantity;
      const itemDiscount = num(item.hs_total_discount || item.discount)
        || gross * (num(item.hs_discount_percentage) / 100);
      const net = num(item.amount) || Math.max(gross - itemDiscount, 0);
      const description = item.description === 'Deal amount fallback'
        ? 'اشتراك منصة أجور للموارد البشرية والرواتب'
        : item.description || '';
      const name = item.description === 'Deal amount fallback'
        ? 'اشتراك منصة أجور'
        : item.name || 'خدمة أجور';
      const billing = billingLabel(item.recurringbillingfrequency);
      const sku = item.hs_sku || '';
      const tags = [sku ? `SKU: ${sku}` : '', billing].filter(Boolean)
        .map((tag) => `<span class="item-tag">${esc(tag)}</span>`).join('');
      return `
        <tr>
          <td>${startIndex + itemIndex + 1}</td>
          <td><span class="item-name">${esc(name)}</span>
            ${description ? `<span class="item-description">${escLines(description)}</span>` : ''}
            ${tags ? `<span class="item-tags">${tags}</span>` : ''}</td>
          <td>${ltr(quantity)}</td><td>${ltr(money(unitPrice, context.currency))}</td>
          <td>${ltr(money(itemDiscount, context.currency))}</td>
          <td>${ltr(money(net, context.currency))}</td>
        </tr>`;
    }).join('');

    const isLast = pageIndex === pricingChunks.length - 1;
    const grossTotal = num(snapshot.totals?.subtotal) + num(snapshot.totals?.discount);
    const bottom = isLast ? `
      <div class="pricing-bottom-grid">
        <div class="pricing-note-card"><h3>ملاحظات العرض</h3>
          <p><strong>ممثل أجور:</strong> ${esc(context.ownerName)} — ${esc(context.ownerEmail)}</p>
          <p><strong>ممثل العميل:</strong> ${esc(context.contactName)} — ${esc(context.contactEmail)}</p>
          <p>الأسعار والتفاصيل الواردة أعلاه مرتبطة بالـ Line Items المحفوظة على الصفقة في HubSpot وقت إنشاء هذه النسخة.</p>
        </div>
        <div class="totals-card">
          <div class="total-row"><span>الإجمالي قبل الخصم</span><span>${esc(money(grossTotal, context.currency))}</span></div>
          <div class="total-row"><span>إجمالي الخصم</span><span>${esc(money(num(snapshot.totals?.discount), context.currency))}</span></div>
          <div class="total-row"><span>الإجمالي قبل الضريبة</span><span>${esc(money(num(snapshot.totals?.subtotal), context.currency))}</span></div>
          <div class="total-row"><span>الضريبة</span><span>${esc(money(num(snapshot.totals?.tax), context.currency))}</span></div>
          <div class="total-row grand"><span>الإجمالي النهائي</span><span>${esc(money(num(snapshot.totals?.grandTotal), context.currency))}</span></div>
        </div>
      </div>` : `<div class="pricing-continuation">يتبع عرض السعر التفصيلي في الصفحة التالية.</div>`;

    return page('عرض السعر التفصيلي', `
      <div class="pricing-head"><h1 class="sec-title">عرض السعر التفصيلي</h1>
        <div class="quote-badge"><span>رقم العرض</span><strong>${esc(context.quoteNumber)}</strong></div></div>
      <div class="pricing-meta-grid">
        <div class="pricing-meta-card"><b>العميل</b><span>${esc(context.customerName)}</span></div>
        <div class="pricing-meta-card"><b>التاريخ</b><span class="ltr">${esc(context.createdDate)}</span></div>
        <div class="pricing-meta-card"><b>العملة</b><span class="ltr">${esc(context.currency)}</span></div>
        <div class="pricing-meta-card"><b>الصفحة</b><span class="ltr">${pageIndex + 1} / ${pricingChunks.length}</span></div>
      </div>
      <div class="pricing-table-frame"><table class="pricing-table">
        <thead><tr><th>#</th><th>الخدمة / الباقة</th><th>الكمية</th><th>سعر الوحدة</th><th>الخصم</th><th>الإجمالي</th></tr></thead>
        <tbody>${rows}</tbody></table></div>${bottom}`, 'pricing-page');
  }).join('');
}
