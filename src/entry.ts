import worker from './index';
import type { Env } from './types';

const APPROVED_IMAGE_ORIGIN = 'https://skyagent-artifacts.skywork.ai';

const PRINT_FIXES = `
<style id="ojoor-print-pagination-fixes">
  @page { size: A4 portrait; margin: 0; }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
  }

  .doc {
    width: 210mm !important;
    max-width: none !important;
    margin: 0 auto !important;
    background: #fff !important;
  }

  .page {
    position: relative !important;
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    margin: 0 !important;
    overflow: hidden !important;
    break-after: page !important;
    page-break-after: always !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  .page:last-child {
    break-after: auto !important;
    page-break-after: auto !important;
  }

  .page-header,
  .page-footer,
  .party-grid,
  .party-card,
  .terms-banner,
  .terms-section,
  .terms-columns,
  .activation-panel,
  .activation-steps,
  .timeline-table,
  .timeline-note,
  .pricing-table-wrap,
  .pricing-table tr,
  .pricing-bottom,
  .totals,
  .sign-grid,
  .signature-card,
  .integration-board,
  .integration-card,
  h1, h2, h3,
  p, li {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  h1, h2, h3 {
    break-after: avoid !important;
    page-break-after: avoid !important;
  }

  p, li {
    orphans: 3;
    widows: 3;
  }

  thead { display: table-header-group !important; }
  tfoot { display: table-footer-group !important; }
  tr { break-inside: avoid !important; page-break-inside: avoid !important; }

  .page-body {
    padding-bottom: 70px !important;
  }

  .terms-page .page-body,
  .terms-continuation .page-body {
    padding-top: 42px !important;
  }

  .terms-section:last-child,
  .activation-summary,
  .activation-summary-title {
    margin-bottom: 0 !important;
  }

  .cover-photo {
    background-position: center center !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
</style>`;

function fixHtml(html: string): string {
  let fixed = html.replace('</head>', `${PRINT_FIXES}</head>`);

  fixed = fixed
    .replace(/استكمال الشروط والأحكام/g, 'الشروط والأحكام')
    .replace(/استكمال الشروط واألحكام/g, 'الشروط والأحكام');

  return fixed;
}

function proposalCsp(): string {
  return [
    "default-src 'none'",
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    'font-src https://fonts.gstatic.com',
    `img-src data: ${APPROVED_IMAGE_ORIGIN}`,
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join('; ');
}

async function renderPdf(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/\/pdf$/, '');

  const htmlResponse = await worker.fetch(new Request(url.toString(), request), env);
  if (!htmlResponse.ok) return htmlResponse;

  const html = fixHtml(await htmlResponse.text());
  const response = await env.BROWSER.quickAction('pdf', {
    html,
    pdfOptions: {
      format: 'a4',
      landscape: false,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    },
  });

  const headers = new Headers(response.headers);
  headers.set('content-type', 'application/pdf');
  headers.set('content-disposition', 'inline; filename="ojoor-proposal.pdf"');
  headers.set('cache-control', 'private, max-age=60');

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (/^\/p\/[^/]+\/pdf$/.test(url.pathname)) {
      return renderPdf(request, env);
    }

    const response = await worker.fetch(request, env);
    if (!response.ok || !/^\/p\/[^/]+$/.test(url.pathname)) return response;

    const headers = new Headers(response.headers);
    headers.set('cache-control', 'private, max-age=60');
    headers.set('content-security-policy', proposalCsp());
    return new Response(fixHtml(await response.text()), {
      status: response.status,
      headers,
    });
  },

  scheduled(controller: unknown, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): void {
    worker.scheduled(controller, env, ctx);
  },
};
