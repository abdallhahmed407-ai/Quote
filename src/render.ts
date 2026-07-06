import type { ProposalSnapshot } from './types';
import { escapeHtml, renderPricing, type ProposalContext } from './pricing';

const RELEASE_MARKER = 'html-browser-print-v8-first-party-ojoor';
const PROPOSAL_TIME_ZONE = 'Asia/Riyadh';
const OJOOR_LEGAL_NAME_AR = 'شركة الرائدة للموارد البشرية — أجور';
const OJOOR_CR_NUMBER = '1010586885';
const OJOOR_VAT_NUMBER = '310712172300003';
const OJOOR_ADDRESS = 'مبنى 8730، حي العليا، مكتب 309، الرمز البريدي 12214، الدور الثالث';

function replaceAll(source: string, marker: string, value: string): string {
  return source.split(marker).join(value);
}

function replaceCidContent(source: string, cid: string, value: string): string {
  const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<(?:span|div)[^>]*data-cid="${escapedCid}"[^>]*>)(.*?)(</(?:span|div)>)`, 's');
  return source.replace(pattern, (_match, opening: string, _content: string, closing: string) =>
    `${opening}${value}${closing}`);
}

function normalizeOjoorStaticDetails(html: string): string {
  return html.replace(/مبنى\s*8758/g, 'مبنى 8730');
}

function formatArabicDate(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('ar-EG-u-ca-gregory-nu-arab', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: PROPOSAL_TIME_ZONE,
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

function removeOldProposalActions(html: string): string {
  return html
    .replace(/<div class="proposal-print-actions">[\s\S]*?<\/div>/g, '')
    .replace(/<script>[\s\S]*?(?:downloadOjoorProposal|printOjoorProposal|patchOjoorFirstPartyDetails)[\s\S]*?<\/script>/g, '');
}

function injectPrintExperience(html: string): string {
  const style = `<meta name="ojoor-release" content="${RELEASE_MARKER}">
  <style>
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

    section.page {
      position: relative !important;
    }

    .ojoor-legal-value-overlay {
      z-index: 25;
      color: #2f3568;
      font-weight: 500;
      line-height: 1.4;
      pointer-events: none;
      white-space: normal;
      box-sizing: border-box;
    }

    .proposal-print-actions {
      width: 210mm;
      max-width: calc(100% - 32px);
      margin: 24px auto 56px;
      padding: 18px;
      display: flex;
      justify-content: center;
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }

    .proposal-print-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 28px rgba(26, 43, 110, 0.28);
    }

    .proposal-print-button:disabled {
      cursor: wait;
      opacity: 0.65;
    }

    @media (max-width: 760px) {
      .pricing-bottom-totals-only .pricing-totals {
        width: 100% !important;
      }

      .pricing-reference-grid {
        flex-direction: column !important;
      }
    }

    @media print {
      @page {
        size: A4;
        margin: 0;
      }

      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
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
    <button class="proposal-print-button" type="button" onclick="printOjoorProposal(this)">طباعة</button>
  </div>
  <script>
    function patchOjoorFirstPartyDetails() {
      var targets = [
        { label: 'السجل التجاري', value: '${OJOOR_CR_NUMBER}', field: 'cr' },
        { label: 'الرقم الضريبي', value: '${OJOOR_VAT_NUMBER}', field: 'vat' }
      ];
      var normalize = function (value) {
        return String(value || '').replace(/\\s+/g, '').trim();
      };
      var textElements = Array.prototype.slice.call(document.querySelectorAll('span, div'))
        .filter(function (element) { return normalize(element.textContent); });
      var heading = textElements.find(function (element) {
        var text = normalize(element.textContent);
        return text.indexOf('الطرفالأول') !== -1 && text.indexOf('أجور') !== -1;
      });
      if (!heading) return;

      var headingRect = heading.getBoundingClientRect();
      var headingCenter = (headingRect.left + headingRect.right) / 2;
      var page = heading.closest('section.page') || document.body;
      var pageRect = page.getBoundingClientRect();

      Array.prototype.slice.call(page.querySelectorAll('.ojoor-legal-value-overlay')).forEach(function (element) {
        element.remove();
      });

      targets.forEach(function (target) {
        var targetLabel = normalize(target.label);
        var best = null;
        var bestScore = Infinity;

        textElements.forEach(function (element) {
          var text = normalize(element.textContent);
          if (text !== targetLabel && text.indexOf(targetLabel) === -1) return;

          var rect = element.getBoundingClientRect();
          if (rect.top < headingRect.bottom - 4) return;

          var center = (rect.left + rect.right) / 2;
          var horizontalScore = Math.abs(center - headingCenter);
          var verticalScore = Math.abs(rect.top - headingRect.top);
          var score = (horizontalScore * 2) + verticalScore;

          if (score < bestScore) {
            best = element;
            bestScore = score;
          }
        });

        if (!best) return;
        var labelRect = best.getBoundingClientRect();
        var computedStyle = window.getComputedStyle(best);
        var overlay = document.createElement('span');
        overlay.className = 'ojoor-legal-value-overlay';
        overlay.setAttribute('data-ojoor-field', target.field);
        overlay.textContent = target.value;
        overlay.style.position = 'absolute';
        overlay.style.left = Math.max(0, (labelRect.right - pageRect.left) - 290) + 'px';
        overlay.style.top = ((labelRect.bottom - pageRect.top) + 12) + 'px';
        overlay.style.width = '290px';
        overlay.style.textAlign = 'right';
        overlay.style.direction = 'ltr';
        overlay.style.unicodeBidi = 'plaintext';
        overlay.style.fontFamily = computedStyle.fontFamily;
        overlay.style.fontSize = computedStyle.fontSize;
        overlay.style.color = computedStyle.color || '#2f3568';
        page.appendChild(overlay);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', patchOjoorFirstPartyDetails, { once: true });
    } else {
      patchOjoorFirstPartyDetails();
    }
    window.addEventListener('load', patchOjoorFirstPartyDetails);

    async function printOjoorProposal(button) {
      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'جاري تجهيز الطباعة...';

      try {
        patchOjoorFirstPartyDetails();
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
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        patchOjoorFirstPartyDetails();
        window.print();
      } finally {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  </script>`;

  const cleanHtml = removeOldProposalActions(html);
  const withStyle = cleanHtml.includes('</head>')
    ? cleanHtml.replace('</head>', `${style}</head>`)
    : `${style}${cleanHtml}`;

  return withStyle.includes('</body>')
    ? withStyle.replace('</body>', `${controls}</body>`)
    : `${withStyle}${controls}`;
}

export function renderProposal(
  snapshot: ProposalSnapshot,
  template: string,
  _downloadPath = '',
): string {
  const deal = snapshot.deal || {};
  const company = snapshot.company || {};
  const contact = snapshot.contact || {};
  const owner = snapshot.owner || {};

  const legalNameArabic = deal.legal_name_arabic || company.name || deal.legal_name_english || deal.dealname || '';
  const customerAddress = company.billing_address || deal.billing_address || [
    company.address,
    company.address2,
    company.city,
    company.state,
    company.country,
    company.zip,
  ].filter(Boolean).join('، ');

  const context: ProposalContext = {
    customerName: legalNameArabic,
    customerCr: company.cr_number || deal.cr_number || '',
    customerVat: company.vat_number || deal.vat_number || '',
    customerAddress,
    contactName: [contact.firstname, contact.lastname].filter(Boolean).join(' '),
    ownerName: [owner.firstName, owner.lastName].filter(Boolean).join(' '),
    createdDate: formatArabicDate(snapshot.createdAt),
    expirationDate: formatArabicDate(deal.proposal_expiration_date),
    currency: snapshot.totals?.currency || 'SAR',
    quoteNumber: `OJR-${snapshot.dealId}-V${snapshot.version}`,
  };

  const pricing = renderPricing(snapshot, context);
  const values: Record<string, string> = {
    '{{CUSTOMER_NAME}}': escapeHtml(context.customerName),
    '{{CUSTOMER_CR}}': escapeHtml(context.customerCr),
    '{{CUSTOMER_VAT}}': escapeHtml(context.customerVat),
    '{{CUSTOMER_ADDRESS}}': escapeHtml(context.customerAddress),
    '{{OJOOR_LEGAL_NAME}}': escapeHtml(OJOOR_LEGAL_NAME_AR),
    '{{OJOOR_CR}}': escapeHtml(OJOOR_CR_NUMBER),
    '{{OJOOR_VAT}}': escapeHtml(OJOOR_VAT_NUMBER),
    '{{OJOOR_ADDRESS}}': escapeHtml(OJOOR_ADDRESS),
    '{{CONTACT_NAME}}': escapeHtml(context.contactName),
    '{{OWNER_NAME}}': escapeHtml(context.ownerName),
    '{{CREATED_DATE}}': escapeHtml(context.createdDate),
    '{{EXPIRATION_DATE}}': escapeHtml(context.expirationDate),
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
    'R-IAxZ': '',
    'nl1wjI': '',
  };

  for (const [cid, value] of Object.entries(cidValues)) html = replaceCidContent(html, cid, value);
  for (const [marker, value] of Object.entries(values)) html = replaceAll(html, marker, value);

  html = html.replace(/\bOGR-/g, 'OJR-');
  html = normalizeOjoorStaticDetails(html);
  return injectPrintExperience(renumberPages(html));
}
