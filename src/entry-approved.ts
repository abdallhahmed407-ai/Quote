import worker from './entry';
import type { Env } from './types';

const PROPOSAL_CSP = [
  "default-src 'none'",
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  'font-src https://fonts.gstatic.com',
  'img-src data: https://skyagent-artifacts.skywork.ai',
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join('; ');

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await worker.fetch(request, env);
    const pathname = new URL(request.url).pathname;

    if (!response.ok || !/^\/p\/[^/]+$/.test(pathname)) return response;

    const headers = new Headers(response.headers);
    headers.set('content-security-policy', PROPOSAL_CSP);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },

  scheduled(controller: unknown, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): void {
    worker.scheduled(controller, env, ctx);
  },
};
