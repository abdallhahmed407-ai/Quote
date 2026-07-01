import type { ProposalSnapshot } from '../types';
import { billingLabel, esc, escLines, ltr, money, num, type RenderContext } from '../render-utils';

export const EXACT_QUOTE_CSS = `
.quote-page .quote-content{padding:30px 50px 82px}
.quote-page .quote-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:16px}
.quote-page .quote-title-row .sec-title{margin-bottom:0}
.quote-page .quote-number{min-width:180px;padding:9px 14px;border:1px solid #D4C8F0;border-radius:10px;background:#FAFAFF;text-align:center}
.quote-page .quote-number small{display:block;color:#7B5EA7;font-size:10px;font-weight:700}
.quote-page .quote-number strong{display:block;color:#1A2B6E;font-size:13px;direction:ltr;unicode-bidi:isolate}
.quote-page .quote-meta{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;margin:0 0 16px}
.quote-page .quote-meta-item{min-height:58px;padding:9px 12px;border:1px solid #E2DCF3;border-radius:9px;background:#F9F8FF}
.quote-page .quote-meta-item b{display:block;color:#7B5EA7;font-size:9.5px}
.quote-page .quote-meta-item span{display:block;margin-top:2px;color:#343448;font-size:11px;font-weight:700;overflow-wrap:anywhere}
.quote-page .quote-table-wrap{overflow:hidden;border:1px solid #D4C8F0;border-radius:10px}
.quote-page .quote-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:10.5px}
.quote-page .quote-table thead{background:#1A2B6E;color:#fff}
.quote-page .quote-table th{padding:9px 6px;font-weight:700;text-align:center}
.quote-page .quote-table td{padding:9px 6px;border-bottom:1px solid #E8E2F5;color:#343448;text-align:center;vertical-align:middle}
.quote-page .quote-table tbody tr:nth-child(even) td{background:#F7F6FF}
.quote-page .quote-table tbody tr:last-child td{border-bottom:0}
.quote-page .quote-table th:nth-child(1),.quote-page .quote-table td:nth-child(1){width:5%}
.quote-page .quote-table th:nth-child(2),.quote-page .quote-table td:nth-child(2){width:37%;text-align:right}
.quote-page .quote-table th:nth-child(3),.quote-page .quote-table td:nth-child(3){width:9%}
.quote-page .quote-table th:nth-child(4),.quote-page .quote-table td:nth-child(4){width:17%}
.quote-page .quote-table th:nth-child(5),.quote-page .quote-table td:nth-child(5){width:14%}
.quote-page .quote-table th:nth-child(6),.quote-page .quote-table td:nth-child(6){width:18%}
.quote-page .quote-item-name{display:block;color:#1A2B6E;font-size:11.5px;font-weight:800;line-height:1.45}
.quote-page .quote-item-description{display:block;margin-top:2px;color:#77778F;font-size:8.7px;line-height:1.45}
.quote-page .quote-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.quote-page .quote-tag{display:inline-block;padding:1px 6px;border-radius:9px;background:#EEE9F8;color:#7B5EA7;font-size:8px;font-weight:700}
.quote-page .quote-bottom{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;align-items:start}
.quote-page .quote-note,.quote-page .quote-totals{overflow:hidden;border:1px solid #D4C8F0;border-radius:10px;background:#FAFAFF}
.quote-page .quote-note{padding:14px 16px}
.quote-page .quote-note h3{margin:0 0 7px;color:#7B5EA7;font-size:14px}
.quote-page .quote-note p{margin:3px 0;color:#343448;font-size:9.7px;line-height:1.65;text-align:right}
.quote-page .quote-total-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;border-bottom:1px solid #E5DFF5;font-size:10.2px}
.quote-page .quote-total-row:last-child{border-bottom:0}
.quote-page .quote-total-row span:last-child{direction:ltr;unicode-bidi:isolate;font-weight:700;color:#1A2B6E}
.quote-page .quote-total-row.grand{background:linear-gradient(135deg,#1A2B6E 0%,#7B5EA7 100%);color:#fff;font-size:11.7px;font-weight:800}
.quote-page .quote-total-row.grand span:last-child{color:#fff}
.quote-page .quote-continue{margin-top:16px;padding:11px 14px;border-right:4px solid #7B5EA7;border-radius:0 8px 8px 0;background:#F7F6FF;color:#55556D;font-size:10.5px}
.quote-page .ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
@media print{.quote-page .quote-table-wrap,.quote-page .quote-bottom,.quote-page .quote-meta{break-inside:avoid;page-break-inside:avoid}}
`;

const chunk = <T>(items: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result.length ? result : [[]];
};

export function renderExactPricingPages(snapshot: ProposalSnapshot, context: RenderContext): string {
  const groups = chunk(snapshot.lineItems || [], 7);
  const grossTotal = num(snapshot.totals?.subtotal) + num(snapshot.totals?.discount);

  return groups.map((items, pageIndex) => {
    const isLast = pageIndex === groups.length - 1;
    const rows = items.length ? items.map((item, itemIndex) => {
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
      const tags = [
        item.hs_sku ? `SKU: ${item.hs_sku}` : '',
        billingLabel(item.recurringbillingfrequency),
      ].filter(Boolean).map((tag) => `<span class="quote-tag">${esc(tag)}</span>`).join('');

      return `<tr>
        <td>${pageIndex * 7 + itemIndex + 1}</td>
        <td><span class="quote-item-name">${esc(name)}</span>${description ? `<span class="quote-item-description">${escLines(description)}</span>` : ''}${tags ? `<span class="quote-tags">${tags}</span>` : ''}</td>
        <td>${ltr(quantity)}</td>
        <td>${ltr(money(unitPrice, context.currency))}</td>
        <td>${ltr(money(itemDiscount, context.currency))}</td>
        <td>${ltr(money(net, context.currency))}</td>
      </tr>`;
    }).join('') : `<tr><td colspan="6" style="padding:42px 12px;color:#777799;text-align:center">لا توجد بنود سعرية مضافة على الصفقة في HubSpot.</td></tr>`;

    const bottom = isLast ? `<div class="quote-bottom">
      <div class="quote-note"><h3>ملاحظات العرض</h3>
        <p><strong>ممثل أجور:</strong> ${esc(context.ownerName || '—')}</p>
        <p><strong>ممثل العميل:</strong> ${esc(context.contactName || '—')}</p>
        <p>الأسعار والتفاصيل مرتبطة بالـ Line Items المحفوظة على الصفقة وقت إنشاء هذه النسخة.</p>
      </div>
      <div class="quote-totals">
        <div class="quote-total-row"><span>الإجمالي قبل الخصم</span><span>${esc(money(grossTotal, context.currency))}</span></div>
        <div class="quote-total-row"><span>إجمالي الخصم</span><span>${esc(money(num(snapshot.totals?.discount), context.currency))}</span></div>
        <div class="quote-total-row"><span>الإجمالي قبل الضريبة</span><span>${esc(money(num(snapshot.totals?.subtotal), context.currency))}</span></div>
        <div class="quote-total-row"><span>الضريبة</span><span>${esc(money(num(snapshot.totals?.tax), context.currency))}</span></div>
        <div class="quote-total-row grand"><span>الإجمالي النهائي</span><span>${esc(money(num(snapshot.totals?.grandTotal), context.currency))}</span></div>
      </div>
    </div>` : `<div class="quote-continue">يتبع عرض السعر التفصيلي في الصفحة التالية.</div>`;

    return `<section class="page quote-page">
      <header class="inner-header"><div class="ih-logo">ojoor<small>HR STATION</small></div><span class="ih-title">عرض السعر التفصيلي</span></header>
      <div class="quote-content">
        <div class="quote-title-row"><h1 class="sec-title">عرض السعر التفصيلي</h1><div class="quote-number"><small>رقم العرض</small><strong>${esc(context.quoteNumber)}</strong></div></div>
        <div class="quote-meta">
          <div class="quote-meta-item"><b>العميل</b><span>${esc(context.customerName || '—')}</span></div>
          <div class="quote-meta-item"><b>التاريخ</b><span class="ltr">${esc(context.createdDate)}</span></div>
          <div class="quote-meta-item"><b>العملة</b><span class="ltr">${esc(context.currency)}</span></div>
        </div>
        <div class="quote-table-wrap"><table class="quote-table">
          <thead><tr><th>#</th><th>الخدمة / الباقة</th><th>الكمية</th><th>سعر الوحدة</th><th>الخصم</th><th>الإجمالي</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
        ${bottom}
      </div>
      <footer class="inner-footer"><span>منصة أجور للموارد البشرية والرواتب — سري وخاص</span><span class="page-num"></span><span>ojoor.net</span></footer>
    </section>`;
  }).join('');
}
