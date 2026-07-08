import arabicTemplate from '../ojoor_proposal (6).html';
import englishTemplate from '../ojoor_proposal_english (2).html';

type Lang = 'ar' | 'en';

function lang(value?: unknown): Lang {
  const normalized = String(value || '').trim().toLowerCase();
  return ['en', 'eng', 'english', 'إنجليزي', 'انجليزي'].includes(normalized) ? 'en' : 'ar';
}

export function getProposalTemplate(language?: unknown): Promise<string> {
  return Promise.resolve(lang(language) === 'en' ? englishTemplate : arabicTemplate);
}
