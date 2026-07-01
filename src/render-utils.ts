export interface RenderContext {
  customerName: string;
  customerCr: string;
  customerVat: string;
  customerAddress: string;
  contactName: string;
  contactEmail: string;
  ownerName: string;
  ownerEmail: string;
  createdDate: string;
  currency: string;
  quoteNumber: string;
}

export const esc = (value: unknown): string => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export const escLines = (value: unknown): string => esc(value).replace(/\r?\n/g, '<br>');
export const num = (value: unknown): number => Number(value || 0) || 0;

export const formatDate = (value: unknown): string => {
  const parsed = new Date(String(value || ''));
  return Number.isNaN(parsed.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Riyadh',
      }).format(parsed);
};

export const money = (value: number, currency: string): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${currency || 'SAR''}`;
};

export const ltr = (value: unknown, className = ''): string =>
  `<span class="ltr ${className}">${esc(value)}</span>`;

export const chunks = <T>(items: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result.length ? result : [[]];
};

const pageHeader = (title: string): string => `
  <header class="inner-header">
    <div class="ih-logo">ojoor<small>HR STATION</small></div>
    <span class="ih-title">${esc(title)}</span>
  </header>`;

const pageFooter = `
  <footer class="inner-footer">
    <span>منصة أجور للموارد البشرية والرواتب — سري وخاص</span>
    <span class="ltr">ojoor.net</span>
  </footer>`;

export const page = (title: string, body: string, className = ''): string => `
<section class="page ${className}">
  ${pageHeader(title)}
  <div class="inner-content">${body}</div>
  ${pageFooter}
</section>`;

export const partyField = (label: string, value: string, dynamic = false): string => `
  <div class="pf">
    <span class="pf-label">${esc(label)}</span>
    <span class="pf-value${dynamic ? ' dynamic-field' : ''}">${value || '&nbsp;'}</span>
  </div>`;

export const orderedList = (items: string[]): string =>
  `<ol class="terms-list">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ol>`;

export const billingLabel = (value: unknown): string => {
  const normalized = String(value || '').toLowerCase();
  const labels: Record<string, string> = {
    monthly: 'شهري', quarterly: 'ربع سنوي', semi_annually: 'نصف سنوي',
    semiannually: 'نصف سنوي', annually: 'سنوي', yearly: 'سنوي',
    one_time: 'دفعة واحدة', onetime: 'دفعة واحدة',
  };
  return labels[normalized] || String(value || '');
};
