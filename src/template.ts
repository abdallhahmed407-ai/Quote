type Lang = 'ar' | 'en';

const TEMPLATE_VERSION = '2026-07-09-b2e2941';
const TEMPLATE_BASE_URL = 'https://raw.githubusercontent.com/abdallhahmed407-ai/Quote/main';
const TEMPLATE_PATHS: Record<Lang, string> = {
  ar: 'ojoor_proposal%20(6).html',
  en: 'ojoor_proposal_english%20(2).html',
};

const cache: Partial<Record<Lang, Promise<string>>> = {};

function lang(value?: unknown): Lang {
  const normalized = String(value || '').trim().toLowerCase();
  return ['en', 'eng', 'english', 'إنجليزي', 'انجليزي'].includes(normalized) ? 'en' : 'ar';
}

async function fetchTemplate(selected: Lang): Promise<string> {
  const url = `${TEMPLATE_BASE_URL}/${TEMPLATE_PATHS[selected]}?v=${TEMPLATE_VERSION}`;
  const response = await fetch(url, {
    headers: {
      accept: 'text/html;charset=utf-8,text/plain,*/*',
      'user-agent': 'ojoor-proposal-worker',
    },
    cf: { cacheTtl: 300, cacheEverything: true },
  });
  if (!response.ok) throw new Error(`Template fetch failed: ${response.status} ${url}`);
  return response.text();
}

export function getProposalTemplate(language?: unknown): Promise<string> {
  const selected = lang(language);
  if (!cache[selected]) cache[selected] = fetchTemplate(selected);
  return cache[selected]!;
}
