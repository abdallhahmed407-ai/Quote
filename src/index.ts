import type { Env, ProposalSnapshot } from './types';
import {
  buildSnapshot,
  createSnapshotNote,
  patchDeal,
  readSnapshotNote,
  searchPendingDeals,
} from './hubspot';
import { renderProposal } from './render';
import { createPublicToken, verifyPublicToken } from './security';
import { getProposalTemplate } from './template';

const DEFAULT_PUBLIC_BASE_URL = 'https://quote.abdallhahmed407.workers.dev';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function publicBaseUrl(env: Env, request?: Request): string {
  const configured = String(env.PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL).trim().replace(/\/$/, '');
  if (configured) return configured;
  if (request) return new URL(request.url).origin;
  return DEFAULT_PUBLIC_BASE_URL;
}

function assertConfigured(env: Env): void {
  if (!env.HUBSPOT_ACCESS_TOKEN) throw new Error('HUBSPOT_ACCESS_TOKEN is missing.');
  if (!env.PROPOSAL_SIGNING_SECRET || env.PROPOSAL_SIGNING_SECRET.length < 32) {
    throw new Error('PROPOSAL_SIGNING_SECRET is missing or too short. Use at least 32 random characters.');
  }
}

async function generateOne(env: Env, dealRecord: Record<string, any>, request?: Request): Promise<void> {
  assertConfigured(env);
  const dealId = String(dealRecord.id);
  const root = publicBaseUrl(env, request);
  const nextVersion = (Number(dealRecord.properties?.proposal_version || 0) || 0) + 1;

  await patchDeal(env, dealId, {
    generate_proposal: 'no_action',
    proposal_status: 'Generating',
    proposal_error: '',
  });

  try {
    const snapshot = await buildSnapshot(env, dealId, nextVersion);
    const noteId = await createSnapshotNote(env, snapshot);
    snapshot.noteId = noteId;
    const token = await createPublicToken(
      { n: noteId, d: dealId, v: nextVersion },
      env.PROPOSAL_SIGNING_SECRET,
    );
    const proposalUrl = `${root}/p/${token}`;

    await patchDeal(env, dealId, {
      proposal_status: 'Generated',
      proposal_url: proposalUrl,
      proposal_pdf_url: `${proposalUrl}/pdf`,
      proposal_version: String(nextVersion),
      proposal_generated_at: new Date().toISOString(),
      proposal_error: '',
      generate_proposal: 'no_action',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await patchDeal(env, dealId, {
      proposal_status: 'Failed',
      proposal_error: message.slice(0, 5000),
      generate_proposal: 'no_action',
    });
    throw error;
  }
}

async function processPending(env: Env, request?: Request): Promise<{ processed: number; failed: number }> {
  const pending = await searchPendingDeals(env);
  let processed = 0;
  let failed = 0;
  for (const deal of pending) {
    try {
      await generateOne(env, deal, request);
      processed += 1;
    } catch (error) {
      failed += 1;
      console.error('Proposal generation failed', deal.id, error);
    }
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
  return {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'private, max-age=60',
    'x-robots-tag': 'noindex, nofollow, noarchive',
    'referrer-policy': 'no-referrer',
    'content-security-policy': "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src https://skyagent-artifacts.skywork.ai data:; base-uri 'none'; frame-ancestors 'none'",
  };
}

async function renderFromToken(env: Env, token: string): Promise<{ snapshot: ProposalSnapshot; html: string } | null> {
  const snapshot = await snapshotFromToken(env, token);
  if (!snapshot) return null;
  const proposalTemplate = await getProposalTemplate();
  return {
    snapshot,
    html: renderProposal(snapshot, proposalTemplate),
  };
}

async function handleFetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/' || url.pathname === '/health') {
    const hubspotToken = Boolean(env.HUBSPOT_ACCESS_TOKEN);
    const signingSecret = Boolean(env.PROPOSAL_SIGNING_SECRET && env.PROPOSAL_SIGNING_SECRET.length >= 32);
    return json({
      ok: true,
      service: 'Ojoor Proposal Generator',
      configured: hubspotToken && signingSecret,
      checks: { hubspotToken, signingSecret, adminKey: Boolean(env.ADMIN_KEY) },
      publicBaseUrl: publicBaseUrl(env, request),
      renderer: 'single-source-template',
      time: new Date().toISOString(),
    });
  }

  if (url.pathname === '/admin/run' && request.method === 'POST') {
    if (!env.ADMIN_KEY || request.headers.get('authorization') !== `Bearer ${env.ADMIN_KEY}`) {
      return json({ error: 'Unauthorized' }, 401);
    }
    assertConfigured(env);
    return json(await processPending(env, request));
  }

  const match = url.pathname.match(/^\/p\/([^/]+)(\/pdf)?$/);
  if (!match) return json({ error: 'Not found' }, 404);

  const rendered = await renderFromToken(env, match[1]);
  if (!rendered) return json({ error: 'Invalid proposal link' }, 404);

  if (match[2] === '/pdf') {
    const response = await env.BROWSER.quickAction('pdf', {
      html: rendered.html,
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
    headers.set('content-disposition', `inline; filename="ojoor-proposal-v${rendered.snapshot.version}.pdf"`);
    headers.set('cache-control', 'private, max-age=60');
    return new Response(response.body, { status: response.status, headers });
  }

  return new Response(rendered.html, { headers: htmlHeaders() });
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleFetch(request, env).catch((error) => {
      console.error(error);
      return json({ error: 'Internal server error' }, 500);
    });
  },
  async scheduled(
    _controller: unknown,
    env: Env,
    ctx: { waitUntil(promise: Promise<unknown>): void },
  ): Promise<void> {
    ctx.waitUntil(processPending(env).then((result) => console.log('Cron result', result)));
  },
};
