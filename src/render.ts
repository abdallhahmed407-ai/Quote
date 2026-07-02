import type { ProposalSnapshot } from './types';
import { escapeHtml, renderPricing, type ProposalContext } from './pricing';

function replaceAll(source: string, marker: string, value: string): string {
  return source.split(marker).join(value);
}

function replaceCidContent(source: string, cid: string, value: string): string {
  const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<(?:span|div)[^>]*data-cid="${escapedCid}"[^>]*>)(.*?)(</(?:span|div)>)`, 's');
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

function injectPrintExperience(html: string): string {
  const style = `<style>
    .pricing-bottom-totals-only {
      display: flex !important;
      direction: ltr !important;
      justify-content: flex-start !important;
      grid-template-columns: none !important;
    }

    .pricing-bottom-totals-only .pricing-totals {
      width: 50% !important;
      margin: 0 !important;
      direction: rtl !important;
    }

    .proposal-print-actions {
      width: 210mm;
      max-width: calc(100% - 32px);
      margin: 24px auto 56px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      box-sizing: border-box;
      direction: rtl;
      font-family: inherit;
    }

    .proposal-print-button {
      min-width: 240px;
      border: 0;
      border-radius: 12px;
      padding: 14px 24px;
      color: #fff;
      background: linear-gradient(135deg, #1a2b6e 0%, #7b5ea7 100%);
      box-shadow: 0 10px 24px rgba(26, 43, 110, 0.22);
      font: inherit;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
    }

    .proposal-print-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 28px rgba(26, 43, 110, 0.28);
    }

    .proposal-print-button:disabled {
      cursor: wait;
      opacity: 0.65;
    }

    .proposal-print-help {
      margin: 0;
      color: #69677c;
      font-size: 12px;
      text-align: center;
    }

    @media (max-width: 760px) {
      .pricing-bottom-totals-only .pricing-totals {
        width: 100% !important;
      }
    }

    @media print {
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }

      .proposal-print-actions {
        display: none !important;
      }

      section.page {
        margin: 0 !important;
        box-shadow: none !important;
        break-after: page !important;
        page-break-after: always !important;
      }

      section.page:last-of-type {
        break-after: auto !important;
        page-break-after: auto !important;
      }
    }
  </style>`;

  const controls = `<div class="proposal-print-actions">
    <button class="proposal-print-button" type="button" onclick="printOjoorProposal(this)">طباعة العرض بالألوان</button>
    <p class="proposal-print-help">سيتم استخدام نفس تصميم وألوان العرض الظاهر أمامك.</p>
  </div>
  <script>
    async function printOjoorProposal(button) {
      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'جاري تجهيز الطباعة...';

      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        const pendingImages = Array.from(document.images)
          .filter((image) => !image.complete)
          .map((image) => new Promise((resolve) => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          }));

        await Promise.all(pendingImages);
        await new Promise((resolve) => setTimeout(resolve, 250));
        window.print();
      } finally {
        window.setTimeout(() => {
          button.disabled = false;
          button.textContent = originalText;
        }, 600);
      }
    }
  </script>`;

  const withStyle = html.includes('</head>')
    ? html.replace('</head>', `${style}</head>`)
    : `${style}${html}`;

  return withStyle.includes('</body>')
    ? withStyle.replace('</body>', `${controls}</body>`)
    : `${withStyle}${controls}`;
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
    'kODtr_': '',
    'j42ryV': '',
    'R-IAxZ': '',
    'nl1wjI': '',
  };

  for (const [cid, value] of Object.entries(cidValues)) html = replaceCidContent(html, cid, value);
  for (const [marker, value] of Object.entries(values)) html = replaceAll(html, marker, value);
  return injectPrintExperience(renumberPages(html));
}
