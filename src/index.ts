import type { Env, ProposalSnapshot } from './types';
import { buildSnapshot, createSnapshotNote, patchDeal, readSnapshotNote, searchPendingDeals } from './hubspot';
import { renderProposal } from './render';
import { createPublicToken, verifyPublicToken } from './security';
import { getProposalTemplate } from './template';

const DEFAULT_PUBLIC_BASE_URL = 'https://quote.abdallhahmed407.workers.dev';
type ProposalLanguage = 'ar' | 'en';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
}

function safeErrorMessage(error: unknown): string {
  return (error instanceof Error ? error.message : String(error)).slice(0, 2000);
}

function publicBaseUrl(env: Env, request?: Request): string {
  const configured = String(env.PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL).trim().replace(/\/$/, '');
  if (configured) return configured;
  if (request) return new URL(request.url).origin;
  return DEFAULT_PUBLIC_BASE_URL;
}

function assertConfigured(env: Env): void {
  if (!env.HUBSPOT_ACCESS_TOKEN) throw new Error('HUBSPOT_ACCESS_TOKEN is missing.');
  if (!env.PROPOSAL_SIGNING_SECRET || env.PROPOSAL_SIGNING_SECRET.length < 32) throw new Error('PROPOSAL_SIGNING_SECRET is missing or too short.');
}

function normalizeProposalLanguage(value: unknown): ProposalLanguage {
  const normalized = String(value || '').trim().toLowerCase();
  return ['english', 'en', 'eng', 'إنجليزي', 'انجليزي'].includes(normalized) ? 'en' : 'ar';
}

function createPreviewSnapshot(language: ProposalLanguage = 'ar'): ProposalSnapshot {
  const isEnglish = language === 'en';
  return {
    schemaVersion: 1,
    dealId: 'PREVIEW',
    version: 1,
    createdAt: new Date().toISOString(),
    deal: {
      dealname: isEnglish ? 'Ojoor Platform Quotation' : 'عرض سعر منصة أجور',
      amount: '66000',
      deal_currency_code: 'SAR',
      legal_name_arabic: 'شركة نموذجية للتقنية',
      legal_name_english: 'Example Technology Company',
      proposal_expiration_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      proposal_language: language,
      billing_address: isEnglish ? 'Riyadh, Kingdom of Saudi Arabia' : 'الرياض، المملكة العربية السعودية',
      cr_number: '1010123456',
      vat_number: '310123456700003',
    },
    company: {
      name: isEnglish ? 'Example Technology Company' : 'شركة نموذجية للتقنية',
      cr_number: '1010123456',
      vat_number: '310123456700003',
      billing_address: isEnglish ? 'Riyadh, Kingdom of Saudi Arabia' : 'الرياض، المملكة العربية السعودية',
      city: isEnglish ? 'Riyadh' : 'الرياض',
      country: isEnglish ? 'Kingdom of Saudi Arabia' : 'المملكة العربية السعودية',
      numberofemployees: '250',
      website: 'example.com',
    },
    contact: {
      firstname: isEnglish ? 'Mohammed' : 'محمد',
      lastname: isEnglish ? 'Ahmed' : 'أحمد',
      email: 'mohamed@example.com',
      phone: '+966 50 000 0000',
      jobtitle: isEnglish ? 'HR Manager' : 'مدير الموارد البشرية',
    },
    owner: { firstName: isEnglish ? 'Abdullah' : 'عبدالله', lastName: isEnglish ? 'Mohamed' : 'محمد', email: 'sales@ojoor.net' },
    lineItems: [
      { id: 'preview-1', name: isEnglish ? 'Annual Subscription to Ojoor Platform' : 'الاشتراك السنوي في منصة أجور', description: isEnglish ? 'HR, payroll, and employee self-service management.' : 'إدارة الموارد البشرية والرواتب والخدمة الذاتية للموظفين.', quantity: '1', price: '60000', hs_pre_discount_amount: '60000', hs_total_discount: '5000', amount: '55000', hs_tax_amount: '8250', hs_line_item_currency_code: 'SAR', recurringbillingfrequency: 'annually', hs_sku: 'OJOOR-ANNUAL' },
      { id: 'preview-2', name: isEnglish ? 'Implementation & Go-Live' : 'التهيئة والإطلاق', description: isEnglish ? 'System setup, data import, training, and go-live support.' : 'إعداد النظام، استيراد البيانات، التدريب، ودعم الإطلاق.', quantity: '1', price: '8000', hs_pre_discount_amount: '8000', amount: '8000', hs_tax_amount: '1200', hs_line_item_currency_code: 'SAR', hs_sku: 'OJOOR-IMPLEMENTATION' },
      { id: 'preview-3', name: isEnglish ? 'Employee Self-Service Add-on' : 'إضافة الخدمة الذاتية للموظفين', description: isEnglish ? 'Employee access to requests, documents, and personal data.' : 'وصول الموظفين إلى الطلبات والمستندات والبيانات الشخصية.', quantity: '250', price: '12', hs_pre_discount_amount: '3000', amount: '3000', hs_tax_amount: '450', hs_line_item_currency_code: 'SAR', recurringbillingfrequency: 'annually', hs_sku: 'OJOOR-ESS' },
    ],
    totals: { subtotal: 66000, discount: 5000, tax: 9900, grandTotal: 75900, currency: 'SAR' },
  };
}

async function generateOne(env: Env, dealRecord: Record<string, any>, request?: Request): Promise<void> {
  assertConfigured(env);
  const dealId = String(dealRecord.id);
  const root = publicBaseUrl(env, request);
  const nextVersion = (Number(dealRecord.properties?.proposal_version || 0) || 0) + 1;
  await patchDeal(env, dealId, { generate_proposal: 'no_action', proposal_status: 'Generating', proposal_error: '' });
  try {
    const snapshot = await buildSnapshot(env, dealId, nextVersion);
    const noteId = await createSnapshotNote(env, snapshot);
    snapshot.noteId = noteId;
    const token = await createPublicToken({ n: noteId, d: dealId, v: nextVersion }, env.PROPOSAL_SIGNING_SECRET);
    const proposalUrl = `${root}/p/${token}`;
    await patchDeal(env, dealId, { proposal_status: 'Generated', proposal_url: proposalUrl, proposal_pdf_url: `${proposalUrl}/pdf`, proposal_version: String(nextVersion), proposal_generated_at: new Date().toISOString(), proposal_error: '', generate_proposal: 'no_action' });
  } catch (error) {
    await patchDeal(env, dealId, { proposal_status: 'Failed', proposal_error: safeErrorMessage(error).slice(0, 5000), generate_proposal: 'no_action' });
    throw error;
  }
}

async function processPending(env: Env, request?: Request): Promise<{ processed: number; failed: number }> {
  const pending = await searchPendingDeals(env);
  let processed = 0;
  let failed = 0;
  for (const deal of pending) {
    try { await generateOne(env, deal, request); processed += 1; }
    catch (error) { failed += 1; console.error('Proposal generation failed', deal.id, safeErrorMessage(error)); }
  }
  return { processed, failed };
}

async function snapshotFromToken(env: Env, token: string): Promise<ProposalSnapshot | null> {
  assertConfigured(env);
  const payload = await verifyPublicToken(token, env.PROPOSAL_SIGNING_SECRET);
  if (!payload?.n || !payload?.d || !payload?.v) return null;
  const snapshot = await readSnapshotNote(env, String(payload.n));
  if (snapshot.dealId !== String(payload.d) || snapshot.version !== Number(payload.v)) return null;
  return snapshot;
}

function htmlHeaders(): HeadersInit {
  return { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow, noarchive', 'referrer-policy': 'no-referrer', 'content-security-policy': "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; base-uri 'none'; frame-ancestors 'none'" };
}

async function renderSnapshot(snapshot: ProposalSnapshot, downloadPath = '/preview/pdf?download=1'): Promise<{ snapshot: ProposalSnapshot; html: string }> {
  let proposalTemplate: string;
  try { proposalTemplate = await getProposalTemplate(snapshot.deal?.proposal_language); }
  catch (error) { throw new Error(`TEMPLATE_LOAD_FAILED: ${safeErrorMessage(error)}`); }
  try { return { snapshot, html: renderProposal(snapshot, proposalTemplate, downloadPath) }; }
  catch (error) { throw new Error(`PROPOSAL_RENDER_FAILED: ${safeErrorMessage(error)}`); }
}

async function renderFromToken(env: Env, token: string): Promise<{ snapshot: ProposalSnapshot; html: string } | null> {
  let snapshot: ProposalSnapshot | null;
  try { snapshot = await snapshotFromToken(env, token); }
  catch (error) { throw new Error(`SNAPSHOT_LOAD_FAILED: ${safeErrorMessage(error)}`); }
  if (!snapshot) return null;
  return renderSnapshot(snapshot, `/p/${token}/pdf?download=1`);
}

async function renderPdf(env: Env, rendered: { snapshot: ProposalSnapshot; html: string }, filename: string, forceDownload = false): Promise<Response> {
  const response = await env.BROWSER.quickAction('pdf', { html: rendered.html, emulateMediaType: 'screen', waitForTimeout: 750, pdfOptions: { format: 'a4', landscape: false, printBackground: true, preferCSSPageSize: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } } });
  const pdfBytes = await response.arrayBuffer();
  const pdfSignature = new TextDecoder().decode(pdfBytes.slice(0, 5));
  if (!response.ok || pdfBytes.byteLength < 5 || pdfSignature !== '%PDF-') throw new Error(`PDF_RENDER_FAILED: status=${response.status}; bytes=${pdfBytes.byteLength}`);
  return new Response(pdfBytes, { status: 200, headers: { 'content-type': 'application/pdf', 'content-disposition': `${forceDownload ? 'attachment' : 'inline'}; filename="${filename}"`, 'content-length': String(pdfBytes.byteLength), 'cache-control': 'private, no-store, max-age=0', 'x-content-type-options': 'nosniff' } });
}

async function handleFetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/' || url.pathname === '/health') {
    const root = publicBaseUrl(env, request);
    const hubspotToken = Boolean(env.HUBSPOT_ACCESS_TOKEN);
    const signingSecret = Boolean(env.PROPOSAL_SIGNING_SECRET && env.PROPOSAL_SIGNING_SECRET.length >= 32);
    return json({ ok: true, service: 'Ojoor Proposal Generator', configured: hubspotToken && signingSecret, checks: { hubspotToken, signingSecret, adminKey: Boolean(env.ADMIN_KEY) }, publicBaseUrl: root, renderer: 'exact-image-overlay-template', previewUrl: `${root}/preview`, previewArabicUrl: `${root}/preview?lang=ar`, previewEnglishUrl: `${root}/preview?lang=en`, previewPdfUrl: `${root}/preview/pdf`, time: new Date().toISOString() });
  }
  if (url.pathname === '/preview' || url.pathname === '/preview/pdf') {
    const shouldDownload = url.searchParams.has('download');
    const language = normalizeProposalLanguage(url.searchParams.get('lang'));
    if (url.pathname === '/preview' && shouldDownload) return Response.redirect(`${url.origin}/preview/pdf?lang=${language}&download=1`, 302);
    const rendered = await renderSnapshot(createPreviewSnapshot(language), `/preview/pdf?lang=${language}&download=1`);
    if (url.pathname === '/preview/pdf') return renderPdf(env, rendered, `Ojoor-Proposal-PREVIEW-${language.toUpperCase()}-V1.pdf`, shouldDownload);
    return new Response(rendered.html, { headers: htmlHeaders() });
  }
  if (url.pathname === '/admin/run' && request.method === 'POST') {
    if (!env.ADMIN_KEY || request.headers.get('authorization') !== `Bearer ${env.ADMIN_KEY}`) return json({ error: 'Unauthorized' }, 401);
    assertConfigured(env);
    return json(await processPending(env, request));
  }
  const match = url.pathname.match(/^\/p\/([^/]+)(\/pdf)?$/);
  if (!match) return json({ error: 'Not found' }, 404);
  const shouldDownload = url.searchParams.has('download');
  if (!match[2] && shouldDownload) return Response.redirect(`${url.origin}${url.pathname}/pdf?download=1`, 302);
  const rendered = await renderFromToken(env, match[1]);
  if (!rendered) return json({ error: 'Invalid proposal link' }, 404);
  if (match[2] === '/pdf') return renderPdf(env, rendered, `Ojoor-Proposal-OJR-${rendered.snapshot.dealId}-V${rendered.snapshot.version}.pdf`, shouldDownload);
  return new Response(rendered.html, { headers: htmlHeaders() });
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    const requestId = crypto.randomUUID();
    const url = new URL(request.url);
    return handleFetch(request, env).catch((error) => json({ error: 'Internal server error', requestId, ...(url.searchParams.get('debug') === '1' ? { details: safeErrorMessage(error) } : {}) }, 500));
  },
  async scheduled(_controller: unknown, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<void> {
    ctx.waitUntil(processPending(env).then((result) => console.log('Cron result', result)));
  },
};
