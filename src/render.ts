import type { ProposalSnapshot } from './types';
import { COVER_IMAGE_DATA_URL } from './assets';

const esc = (value: unknown): string => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const num = (value: unknown): number => Number(value || 0) || 0;

const date = (value: unknown): string => {
  const parsed = new Date(String(value || ''));
  return Number.isNaN(parsed.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Riyadh',
      }).format(parsed);
};

const money = (value: number, currency: string): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${currency || 'SAR'}`;
};

const ltr = (value: unknown, extraClass = '') => `<span class="ltr ${extraClass}">${esc(value)}</span>`;

const logo = (inverse = false) => `
  <div class="brand ${inverse ? 'brand-inverse' : ''}" aria-label="Ojoor HR Station">
    <strong>ojoor</strong>
    <span>HR STATION&nbsp;&nbsp;|&nbsp;&nbsp;محطة الموارد البشرية</span>
  </div>`;

const header = (label: string) => `
  <header class="page-header">
    <div class="header-label">${esc(label)}</div>
    ${logo(true)}
  </header>`;

const footer = `
  <footer class="page-footer">
    <span class="ltr">ojoor.net</span>
    <span>منصة أجور للموارد البشرية والرواتب — سري وخاص</span>
  </footer>`;

const pageTitle = (title: string) => `<h1 class="page-title">${esc(title)}</h1>`;

const icon = (name: string): string => {
  const common = 'viewBox="0 0 48 48" aria-hidden="true" focusable="false"';
  const icons: Record<string, string> = {
    government: `<svg ${common}><path d="M7 18h34M10 18l14-9 14 9M11 38h26M14 18v17M22 18v17M30 18v17M38 18v17"/></svg>`,
    calculator: `<svg ${common}><rect x="10" y="6" width="28" height="36" rx="4"/><rect x="15" y="11" width="18" height="7" rx="1"/><path d="M16 24h4m6 0h4m-14 7h4m6 0h4m-14 7h4m6 0h4"/></svg>`,
    fingerprint: `<svg ${common}><path d="M15 31c0-7 2-15 9-15 7 0 9 8 9 15M10 30c0-11 5-20 14-20s14 9 14 20M20 36c2-4 2-10 4-10s2 6 4 10M13 38c5-4 5-15 11-15 6 0 6 11 11 15"/></svg>`,
    talent: `<svg ${common}><circle cx="17" cy="16" r="5"/><circle cx="31" cy="16" r="5"/><circle cx="24" cy="29" r="6"/><path d="M7 39c1-7 5-11 10-11m14 0c5 0 9 4 10 11M14 31c-4 1-7 4-8 8m28-8c4 1 7 4 8 8"/></svg>`,
    bell: `<svg ${common}><path d="M13 34h22l-3-5V20c0-6-3-10-8-10s-8 4-8 10v9l-3 5z"/><path d="M20 38c1 3 2 4 4 4s3-1 4-4"/></svg>`,
    mobile: `<svg ${common}><rect x="14" y="5" width="20" height="38" rx="4"/><path d="M20 10h8M22 38h4"/></svg>`,
    api: `<svg ${common}><circle cx="24" cy="24" r="6"/><circle cx="10" cy="14" r="4"/><circle cx="38" cy="14" r="4"/><circle cx="10" cy="34" r="4"/><circle cx="38" cy="34" r="4"/><path d="M14 16l5 5m15-5l-5 5M14 32l5-5m15 5l-5-5"/></svg>`,
    handshake: `<svg ${common}><path d="M6 23l9-9 7 4 6-4 14 10-8 12-8-4-7 5-13-14z"/><path d="M16 25l8 6m-4-10l11 8"/></svg>`,
    database: `<svg ${common}><ellipse cx="24" cy="10" rx="13" ry="5"/><path d="M11 10v11c0 3 6 5 13 5s13-2 13-5V10M11 21v11c0 3 6 5 13 5s13-2 13-5V21"/></svg>`,
    gear: `<svg ${common}><circle cx="24" cy="24" r="7"/><path d="M24 6v6m0 24v6M6 24h6m24 0h6M11 11l5 5m16 16l5 5M37 11l-5 5M16 32l-5 5"/></svg>`,
    link: `<svg ${common}><path d="M19 29l-4 4a7 7 0 01-10-10l7-7a7 7 0 019-1M29 19l4-4a7 7 0 0110 10l-7 7a7 7 0 01-9 1M16 32l16-16"/></svg>`,
    check: `<svg ${common}><circle cx="24" cy="24" r="17"/><path d="M15 24l6 6 13-14"/></svg>`,
    training: `<svg ${common}><circle cx="13" cy="14" r="5"/><path d="M5 39v-8c0-5 3-8 8-8s8 3 8 8v8M25 9h17v24H25zM29 15h9m-9 6h9"/></svg>`,
    rocket: `<svg ${common}><path d="M26 6c8 2 13 7 16 16l-12 12-11-5-5-11L26 6z"/><path d="M16 27l-7 2-3 9 9-3 2-7M28 20l-8 8M31 13l4 4"/></svg>`,
  };
  return icons[name] || icons.check;
};

const partyRow = (label: string, value: string, dynamic = false) => `
  <div class="party-row">
    <span class="party-label">${esc(label)}</span>
    <span class="party-value ${dynamic ? 'dynamic-value' : ''}">${value}</span>
  </div>`;

const obligationList = (items: string[]) => `<ol>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ol>`;

export function renderProposal(snapshot: ProposalSnapshot): string {
  const deal = snapshot.deal;
  const company = snapshot.company;
  const contact = snapshot.contact;
  const owner = snapshot.owner || {};

  const customerName = company.name || deal.legal_name_arabic || deal.legal_name_english || deal.dealname || 'اسم العميل';
  const customerCr = company.cr_number || deal.cr_number || 'رقم السجل التجاري';
  const customerVat = company.vat_number || deal.vat_number || 'الرقم الضريبي';
  const customerAddress = company.billing_address || deal.billing_address || [
    company.address,
    company.address2,
    company.city,
    company.state,
    company.country,
    company.zip,
  ].filter(Boolean).join('، ') || 'عنوان المنشأة';

  const contactName = [contact.firstname, contact.lastname].filter(Boolean).join(' ') || 'اسم ممثل العميل';
  const contactEmail = contact.email || 'البريد الإلكتروني';
  const ownerName = [owner.firstName, owner.lastName].filter(Boolean).join(' ') || 'ممثل أجور';
  const ownerEmail = owner.email || 'البريد الإلكتروني';
  const createdDate = date(snapshot.createdAt);
  const currency = snapshot.totals.currency || 'SAR';

  const rows = snapshot.lineItems.map((item, index) => {
    const quantity = Math.max(num(item.quantity), 1);
    const unitPrice = num(item.price);
    const gross = num(item.hs_pre_discount_amount) || unitPrice * quantity;
    const discount = num(item.hs_total_discount || item.discount) || gross * (num(item.hs_discount_percentage) / 100);
    const net = num(item.amount) || Math.max(gross - discount, 0);
    const description = item.description === 'Deal amount fallback'
      ? 'اشتراك منصة أجور للموارد البشرية والرواتب'
      : item.description || '';
    const name = item.description === 'Deal amount fallback'
      ? 'اشتراك منصة أجور'
      : item.name || 'خدمة أجور';

    return `
      <tr>
        <td class="cell-index">${index + 1}</td>
        <td class="cell-service">
          <strong>${esc(name)}</strong>
          ${description ? `<small>${esc(description)}</small>` : ''}
        </td>
        <td>${ltr(quantity)}</td>
        <td>${ltr(money(unitPrice, currency), 'money')}</td>
        <td>${ltr(money(discount, currency), 'money')}</td>
        <td>${ltr(money(net, currency), 'money')}</td>
      </tr>`;
  }).join('');

  const goals = [
    'أتمتة عمليات الموارد البشرية والرواتب',
    'تقليل الأخطاء التشغيلية والمالية',
    'ضمان دقة الرواتب والامتثال للأنظمة',
    'تحسين تجربة الموظفين ورفع مستوى الشفافية',
    'تمكين الإدارة من اتخاذ قرارات أسرع مبنية على البيانات',
  ];

  const integrations = [
    { no: 1, title: 'الأنظمة الحكومية', icon: 'government', items: ['GOSI', 'Muqeem — قريبًا', 'Mudad — قريبًا'], className: 'card-gov' },
    { no: 2, title: 'أنظمة المحاسبة ERP', icon: 'calculator', items: ['Odoo', 'QuickBooks', 'ERP Systems'], className: 'card-erp' },
    { no: 3, title: 'أجهزة الحضور والبصمة', icon: 'fingerprint', items: ['ZKTeco', 'Biometric Devices', 'RFID / NFC'], className: 'card-attendance' },
    { no: 4, title: 'قنوات التوظيف واستقطاب المواهب', icon: 'talent', items: ['LinkedIn', 'X', 'Career Portal'], className: 'card-talent' },
    { no: 5, title: 'الإشعارات وسير العمل', icon: 'bell', items: ['SMTP', 'Email', 'Workflow Alerts'], className: 'card-alerts' },
    { no: 6, title: 'تطبيق الجوال والخدمة الذاتية', icon: 'mobile', items: ['iOS App', 'Android App', 'Employee Self-Service'], className: 'card-mobile' },
    { no: 7, title: 'تكاملات مخصصة وقابلة للتوسع', icon: 'api', items: ['API', 'Custom Integrations', 'Future Connectors'], className: 'card-api' },
  ];

  const activationSteps = [
    { no: 1, title: 'مرحلة البداية', icon: 'handshake', body: 'فهم احتياجات المنشأة والهيكل التنظيمي' },
    { no: 2, title: 'جمع البيانات', icon: 'database', body: 'تجهيز بيانات الموظفين والعقود والرواتب' },
    { no: 3, title: 'إعداد النظام', icon: 'gear', body: 'ضبط الحساب والصلاحيات والحضور والإجازات' },
    { no: 4, title: 'التكاملات', icon: 'link', body: 'ربط الأنظمة الخارجية والأجهزة المطلوبة' },
    { no: 5, title: 'التجربة والاختبار', icon: 'check', body: 'اختبار البيانات والموافقات والرواتب والتقارير' },
    { no: 6, title: 'التدريب', icon: 'training', body: 'تدريب مسؤول النظام والفرق الرئيسية' },
    { no: 7, title: 'الإطلاق الفعلي', icon: 'rocket', body: 'تفعيل وصول الموظفين والخدمة الذاتية' },
  ];

  const firstPartyObligations = [
    'يلتزم الطرف الأول بتقديم هذه الشروط والأحكام، والملحق، والعرض الفني.',
    'يلتزم الطرف الأول بالالتزام التام بالخدمات المقدمة من النظام.',
    'يتحرى الطرف الأول دقتها، بما لا يتعارض مع أنظمة المملكة العربية السعودية.',
    'ينوب موافقة الطرف الثاني، ولا يجوز استخدامها أو نشرها إلا بموافقة الطرف الثاني.',
    'يلتزم الطرف الأول بتزويد الطرف الثاني بالعروض والملاحق.',
    'يلتزم الطرف الأول بحماية البيانات الخاصة بالطرف الثاني.',
    'يلتزم بالدعم الفني المطلوب بما في ذلك الرد على الاستفسارات.',
    'المحافظة على الملكية الفكرية الخاصة بالطرف الثاني.',
    'الالتزام بالنظام المعمول به وجميع القوانين والإجراءات ذات العلاقة.',
  ];

  const secondPartyObligations = [
    'الالتزام بالأنظمة الخاصة بالطرف الأول.',
    'عدم استخدام أي من هذه الخدمات أو شراء الخدمات أو الوصول للمنتج دون أن تسبق موافقة رسمية.',
    'عدم عرض منصة أجور أو أي أمر أو عنصر إلى أي طرف آخر غير ما نصت عليه الاتفاقية.',
    'عدم مشاركة أي تفاصيل أو أدوات تخص خدمات الطرف الأول أو تصويرها أو نشرها أو إتاحتها للغير دون موافقة الطرف الأول.',
    'يتحمل الطرف الثاني المسؤولية عن أي تصرف يقوم به مستخدم أو عميل أو موظف خالف التعليمات المقدمة.',
    'لا يجوز للطرف الثاني بأي حال التنازل عن كل أو جزء من الالتزامات دون موافقة كتابية.',
    'عدم نشر أو إعادة نسخ بيانات عن المنصة على أي من حسابات شبكات التواصل الاجتماعي دون موافقة أو إذن مسبق مكتوب.',
    'المرونة وسرعة التجاوب مع متطلبات العمل والالتزام بالتوجيهات الفنية للطرف الأول.',
    'تحمل المسؤولية عن أي أضرار تنجم عن سوء استخدام الخدمة.',
  ];

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>عرض سعر أجور — ${esc(customerName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root { --blue:#213b82; --blue-dark:#152f73; --purple:#7c55a4; --ink:#1c2b56; --body:#3c4257; --paper:#fff; --soft:#f7f5fc; --line:#d8d4e6; --footer:#f6f4fb; }
    * { box-sizing:border-box; }
    html,body { margin:0; padding:0; background:#ececf2; color:var(--body); font-family:'Cairo',Tahoma,Arial,sans-serif; }
    body { line-height:1.75; }
    .doc { width:min(100%,1000px); margin:0 auto; background:#fff; }
    .page { position:relative; width:100%; min-height:1414px; overflow:hidden; background:var(--paper); page-break-after:always; break-after:page; }
    .page:last-child { page-break-after:auto; break-after:auto; }
    .page-header { height:92px; padding:0 62px; display:flex; align-items:center; justify-content:space-between; color:#fff; background:linear-gradient(95deg,var(--blue-dark),var(--purple)); }
    .header-label { font-size:20px; font-weight:700; }
    .page-body { padding:52px 62px 80px; }
    .page-footer { position:absolute; left:0; right:0; bottom:0; height:42px; padding:0 62px; display:flex; align-items:center; justify-content:space-between; background:var(--footer); border-top:1px solid #dedbe9; color:#9ca1b2; font-size:11px; }
    .brand { display:flex; flex-direction:column; align-items:center; line-height:1; }
    .brand strong { color:var(--blue-dark); font:800 56px/.85 Arial,sans-serif; letter-spacing:-5px; }
    .brand span { margin-top:11px; color:var(--purple); font-size:9px; letter-spacing:4px; white-space:nowrap; }
    .brand-inverse strong { color:#fff; font-size:34px; letter-spacing:-3px; }
    .brand-inverse span { color:#e9def7; margin-top:7px; font-size:7px; letter-spacing:3px; }
    .page-title { margin:0 0 30px; padding-right:17px; border-right:7px solid var(--purple); color:var(--blue-dark); font-size:38px; font-weight:800; line-height:1.25; }
    .lead { margin:0 0 28px; color:#454b60; font-size:18px; line-height:2.05; text-align:right; }
    .section-title { margin:30px 0 12px; color:var(--purple); font-size:26px; font-weight:700; }
    .ltr { direction:ltr; unicode-bidi:isolate; display:inline-block; }
    .money { white-space:nowrap; }
    .cover { background:#f8f6ff; }
    .cover-top { height:566px; padding:55px 76px 0; text-align:center; background:linear-gradient(180deg,#fbfaff 0%,#f7f4fe 100%); }
    .cover-top .brand strong { font-size:60px; }
    .cover-rule { height:5px; margin:52px 0 41px; border-radius:99px; background:linear-gradient(90deg,var(--blue-dark),#ae89cf); }
    .cover-title { width:48%; margin:0 auto 38px; padding:17px 24px 21px; color:#fff; background:linear-gradient(100deg,var(--blue-dark),var(--purple)); border-radius:65px; box-shadow:0 18px 32px rgba(44,48,113,.2); font-size:46px; font-weight:800; }
    .cover-cards { display:flex; justify-content:center; gap:28px; direction:rtl; }
    .cover-card { width:290px; min-height:130px; padding:20px 26px; display:flex; flex-direction:column; justify-content:center; color:#fff; background:#223d84; border-radius:18px; box-shadow:0 12px 24px rgba(29,46,104,.18); }
    .cover-card span { color:#b9a8d9; font-size:15px; }
    .cover-card strong { margin-top:8px; padding:0 8px 7px; border-bottom:2px dashed #a99ac8; font-size:22px; font-weight:600; overflow-wrap:anywhere; }
    .cover-photo { position:absolute; top:566px; left:0; right:0; bottom:91px; background-image:linear-gradient(180deg,rgba(16,28,61,.06),rgba(8,16,34,.38)),url('${COVER_IMAGE_DATA_URL}'); background-size:cover; background-position:center center; }
    .cover-bottom { position:absolute; left:0; right:0; bottom:0; height:91px; padding:0 55px; display:grid; grid-template-columns:1fr 1fr 1.55fr; align-items:center; gap:22px; color:#fff; background:#213b82; }
    .cover-contact { display:grid; grid-template-columns:1fr 42px; align-items:center; gap:10px; min-width:0; }
    .cover-contact-copy { min-width:0; text-align:center; }
    .cover-contact-copy b { display:block; color:#baa7d8; font-size:12px; font-weight:500; }
    .cover-contact-copy span { display:block; padding-bottom:3px; border-bottom:2px dashed #b8aad2; font-size:13px; white-space:nowrap; }
    .cover-contact.address .cover-contact-copy span { white-space:normal; line-height:1.4; }
    .cover-badge { width:40px; height:40px; display:grid; place-items:center; border-radius:50%; background:#8b62ad; font-weight:700; }
    .goals-box { margin:30px 0 35px; padding:9px 38px; background:#faf9fd; border:1px solid #d8d4e4; border-radius:18px; }
    .goal-row { position:relative; padding:15px 32px 15px 0; border-bottom:1px solid #dedbe8; color:#1e2c57; font-weight:600; }
    .goal-row:last-child { border-bottom:0; }
    .goal-row::before { content:''; position:absolute; right:0; top:25px; width:8px; height:8px; border-radius:50%; background:var(--purple); }
    .executive-copy { margin:0; font-size:15px; line-height:2.1; }
    .integration-intro { margin-bottom:26px; font-size:17px; line-height:2; }
    .integration-board { position:relative; height:760px; padding:72px 40px 58px; background:#fdfcfe; border:1px solid #d9d6e6; border-radius:20px; }
    .integration-board-title { position:absolute; top:16px; left:0; right:0; color:var(--blue-dark); font-size:35px; font-weight:800; text-align:center; }
    .integration-board-title::before,.integration-board-title::after { content:''; display:inline-block; width:70px; height:2px; margin:0 18px 10px; background:var(--purple); vertical-align:middle; }
    .integration-core { position:absolute; top:290px; left:50%; width:230px; height:235px; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; justify-content:center; background:#fff; border:8px solid #f3f1f7; border-radius:70px; box-shadow:0 12px 24px rgba(31,46,94,.14); text-align:center; z-index:3; }
    .integration-core strong { color:var(--blue-dark); font-size:50px; letter-spacing:-3px; }
    .integration-core span { color:var(--purple); font-size:15px; font-weight:700; }
    .integration-card { position:absolute; width:240px; overflow:hidden; background:#fff; border:1px solid #e1deea; border-radius:20px; box-shadow:0 10px 22px rgba(34,46,93,.13); z-index:2; }
    .integration-card-head { min-height:70px; padding:10px 12px; display:grid; grid-template-columns:42px 1fr 50px; align-items:center; gap:6px; color:#fff; background:linear-gradient(100deg,var(--blue-dark),var(--purple)); }
    .integration-number { width:34px; height:34px; display:grid; place-items:center; border:2px solid rgba(255,255,255,.8); border-radius:50%; font-weight:700; }
    .integration-card-head b { font-size:14px; line-height:1.35; text-align:center; }
    .integration-icon { width:50px; height:50px; display:grid; place-items:center; border-radius:50%; background:#fff; color:var(--blue-dark); }
    .integration-icon svg { width:32px; height:32px; fill:none; stroke:currentColor; stroke-width:2.2; stroke-linecap:round; stroke-linejoin:round; }
    .integration-list { margin:0; padding:8px 18px 10px; list-style:none; direction:ltr; text-align:left; }
    .integration-list li { position:relative; padding:6px 18px 6px 0; border-bottom:1px solid #ece9f1; color:#26385e; font-size:12px; }
    .integration-list li:last-child { border-bottom:0; }
    .integration-list li::after { content:''; position:absolute; right:0; top:14px; width:6px; height:6px; border-radius:50%; background:var(--purple); }
    .card-gov { top:96px; right:75px; }.card-api { top:96px; left:75px; }.card-erp { top:296px; right:34px; }.card-mobile { top:296px; left:34px; }.card-attendance { top:510px; right:62px; }.card-alerts { top:510px; left:62px; }.card-talent { top:553px; left:50%; transform:translateX(-50%); width:235px; }
    .connector { position:absolute; z-index:1; border-top:3px dotted #7d5aa2; transform-origin:left center; opacity:.85; }
    .connector.c1 { top:260px; right:250px; width:155px; transform:rotate(38deg); }.connector.c2 { top:260px; left:250px; width:155px; transform:rotate(142deg); }.connector.c3 { top:405px; right:245px; width:120px; transform:rotate(12deg); }.connector.c4 { top:405px; left:245px; width:120px; transform:rotate(168deg); }.connector.c5 { top:545px; right:250px; width:150px; transform:rotate(-35deg); }.connector.c6 { top:545px; left:250px; width:150px; transform:rotate(215deg); }.connector.c7 { top:521px; left:50%; width:110px; transform:translateX(-50%) rotate(90deg); }
    .integration-note { position:absolute; left:90px; right:90px; bottom:20px; padding:9px 18px; border:1px dashed #8464a7; border-radius:12px; color:var(--blue-dark); text-align:center; font-weight:600; font-size:13px; }
    .integration-summary { margin-top:22px; color:#6a6e7e; font-size:14px; font-style:italic; }
    .pricing-top { display:flex; align-items:flex-start; justify-content:space-between; gap:32px; }.pricing-subtitle { margin:-12px 0 25px; color:var(--purple); font-size:25px; font-weight:700; }.pricing-meta { min-width:180px; padding:14px 18px; background:#faf9fd; border:1px solid #d8d4e4; border-radius:15px; text-align:center; }.pricing-meta span { display:block; color:var(--purple); font-size:12px; }.pricing-meta strong { display:block; color:var(--blue-dark); font-size:17px; }
    .pricing-table-wrap { overflow:hidden; margin-top:24px; border:1px solid #dad6e6; border-radius:16px; }.pricing-table { width:100%; border-collapse:collapse; table-layout:fixed; font-size:13px; }.pricing-table thead { color:#fff; background:#213b82; }.pricing-table th,.pricing-table td { padding:14px 8px; text-align:center; vertical-align:middle; }.pricing-table th:nth-child(1),.pricing-table td:nth-child(1) { width:5%; }.pricing-table th:nth-child(2),.pricing-table td:nth-child(2) { width:35%; text-align:right; }.pricing-table th:nth-child(3),.pricing-table td:nth-child(3) { width:10%; }.pricing-table th:nth-child(4),.pricing-table td:nth-child(4) { width:17%; }.pricing-table th:nth-child(5),.pricing-table td:nth-child(5) { width:15%; }.pricing-table th:nth-child(6),.pricing-table td:nth-child(6) { width:18%; }.pricing-table tbody tr { border-bottom:1px solid #ebe8f2; }.pricing-table tbody tr:nth-child(even) { background:#faf9fd; }.cell-service strong { display:block; color:var(--blue-dark); font-size:14px; }.cell-service small { display:block; margin-top:3px; color:#727688; font-size:10px; line-height:1.5; }
    .pricing-bottom { display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:start; margin-top:34px; }.pricing-note { padding:24px; background:#faf9fd; border:1px solid #e1deea; border-radius:16px; }.pricing-note h3 { margin:0 0 12px; color:var(--purple); font-size:21px; }.pricing-note p { margin:7px 0; font-size:13px; }.totals { overflow:hidden; border:1px solid #d8d4e4; border-radius:16px; }.total-row { padding:13px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; border-bottom:1px solid #e7e3ef; }.total-row:last-child { border-bottom:0; }.total-row strong { color:var(--blue-dark); }.total-row.grand { color:#fff; background:linear-gradient(95deg,var(--blue-dark),var(--purple)); }.total-row.grand strong { color:#fff; }
    .activation-panel { padding:30px 24px 24px; background:#fdfcfe; border:1px solid #d9d6e6; border-radius:18px; }.activation-panel-title { margin:0 0 8px; color:var(--blue-dark); font-size:34px; font-weight:800; text-align:center; }.activation-panel-subtitle { margin:0 0 26px; text-align:center; font-size:16px; }.activation-steps { position:relative; display:grid; grid-template-columns:repeat(7,1fr); gap:8px; direction:rtl; }.activation-steps::after { content:''; position:absolute; top:105px; right:5%; left:5%; height:2px; background:#8d6ab0; z-index:0; }.activation-step { position:relative; z-index:1; text-align:center; }.activation-step svg { width:38px; height:38px; fill:none; stroke:var(--blue-dark); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }.activation-step h3 { min-height:46px; margin:5px 0 8px; color:var(--blue-dark); font-size:12px; }.step-number { width:55px; height:55px; margin:0 auto 12px; display:grid; place-items:center; color:#fff; background:linear-gradient(145deg,var(--blue-dark),var(--purple)); border:5px solid #fff; border-radius:50%; box-shadow:0 5px 12px rgba(34,43,89,.18); font-size:20px; font-weight:700; }.activation-step p { margin:0; color:#343a50; font-size:9.5px; line-height:1.65; }.timeline-title { margin:33px 0 12px; color:var(--purple); font-size:26px; }.timeline-copy { margin:0 0 16px; font-size:14px; line-height:1.9; }.timeline-table { width:100%; border-collapse:collapse; border:1px solid #ddd9e8; border-radius:12px; overflow:hidden; }.timeline-table th { padding:12px; color:#fff; background:#213b82; }.timeline-table td { padding:11px 14px; border-bottom:1px solid #e8e5ef; font-size:13px; }.timeline-table tbody tr:nth-child(even) { background:#f8f6fc; }.timeline-table td:first-child { width:24%; color:var(--purple); font-weight:700; text-align:center; }.timeline-note { margin-top:14px; padding:13px 18px; background:#f4f1fa; border-right:5px solid var(--purple); border-radius:8px; font-size:12px; }.activation-summary-title { margin:24px 0 8px; color:var(--purple); font-size:24px; }.activation-summary { margin:0; font-size:13px; line-height:2; }
    .party-grid { display:grid; grid-template-columns:1fr 1fr; gap:25px; }.party-card { padding:24px 25px; background:#fcfbfe; border:1px solid #d9d5e5; border-radius:18px; }.party-card h2 { margin:0 0 18px; padding-bottom:11px; border-bottom:3px solid var(--purple); color:var(--blue-dark); font-size:20px; text-align:center; }.party-row { padding:8px 0; border-bottom:1px solid #dcd8e7; }.party-row:last-child { border-bottom:0; }.party-label { display:block; color:var(--purple); font-size:12px; font-weight:700; }.party-value { display:block; margin-top:2px; color:#303a59; font-size:13px; overflow-wrap:anywhere; }.dynamic-value { padding-bottom:3px; border-bottom:2px dashed #aaa0c2; }.terms-banner { margin:28px 0 20px; padding:10px 20px; background:#f2eff9; border-radius:8px; color:var(--blue-dark); font-size:22px; font-weight:700; }.terms-section { margin-bottom:20px; }.terms-section h3 { margin:0 0 8px; color:var(--purple); font-size:18px; }.terms-section ol { margin:0; padding-right:22px; }.terms-section li { margin-bottom:7px; font-size:12px; line-height:1.75; }.terms-columns { display:grid; grid-template-columns:1fr 1fr; gap:28px; }.terms-block { padding:20px 22px; background:#fbfaff; border:1px solid #ded9e9; border-radius:15px; }.terms-block h2 { margin:0 0 12px; color:var(--purple); font-size:22px; }.terms-block ol { margin:0; padding-right:21px; }.terms-block li { margin-bottom:8px; font-size:11.5px; line-height:1.7; }.refund-box { margin-top:20px; padding:18px 20px; background:#f4f1fa; border-right:5px solid var(--purple); border-radius:9px; font-size:12px; line-height:1.85; }
    .signature-grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; margin-top:38px; }.signature-card { min-height:340px; padding:26px 28px; background:#fcfbfe; border:1px solid #d7d2e3; border-radius:18px; }.signature-card h2 { margin:0 0 22px; padding-bottom:13px; border-bottom:3px solid var(--purple); color:var(--blue-dark); font-size:22px; text-align:center; }.signature-field { margin-bottom:22px; }.signature-field label { display:block; color:var(--purple); font-size:13px; font-weight:700; }.signature-field span { display:block; min-height:35px; padding:5px 0; border-bottom:2px dashed #b4acc6; color:#303a59; font-size:14px; overflow-wrap:anywhere; }.signature-line { height:70px; border-bottom:2px dashed #b4acc6; }.signature-note { margin-top:42px; padding:20px; background:#f4f1fa; border:1px solid #ddd8e8; border-radius:12px; text-align:center; font-size:14px; }
    @media print { @page { size:A4; margin:0; } html,body { background:#fff; } .doc { width:210mm; max-width:none; } .page { width:210mm; height:297mm; min-height:297mm; } * { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
  </style>
</head>
<body><main class="doc">
<section class="page cover"><div class="cover-top">${logo(false)}<div class="cover-rule"></div><div class="cover-title">عرض سعر</div><div class="cover-cards"><div class="cover-card"><span>مقدم إلى</span><strong>${esc(customerName)}</strong></div><div class="cover-card"><span>التاريخ</span><strong>${ltr(createdDate)}</strong></div></div></div><div class="cover-photo"></div><div class="cover-bottom"><div class="cover-contact"><div class="cover-contact-copy"><b>الجوال</b><span class="ltr">+966 56 443 2194</span></div><div class="cover-badge">ت</div></div><div class="cover-contact"><div class="cover-contact-copy"><b>الموقع الإلكتروني</b><span class="ltr">www.ojoor.net</span></div><div class="cover-badge">و</div></div><div class="cover-contact address"><div class="cover-contact-copy"><b>العنوان</b><span>مبنى 8758، حي العليا، مكتب 309، الرمز البريدي 12214</span></div><div class="cover-badge">ع</div></div></div></section>
<section class="page">${header('الملخص التنفيذي')}<div class="page-body">${pageTitle('الملخص التنفيذي')}<p class="lead">يوضح هذا العرض كيف يمكن لمنصة أجور للموارد البشرية والرواتب أن تساعد المنشآت في المملكة العربية السعودية على تطوير عمليات الموارد البشرية والمالية من خلال نظام سحابي متكامل، مدعوم بالذكاء الاصطناعي، يربط بين إدارة الموظفين، الحضور، الرواتب، الإجازات، الأداء، النفقات، والتقارير في منصة واحدة، مع توضيح أن المستند عبارة عن عرض سعر مقدم لعميل محدد.</p><p class="executive-copy">تهدف منصة أجور إلى تمكين المنشآت من تحقيق الأهداف التالية:</p><div class="goals-box">${goals.map((goal)=>`<div class="goal-row">${esc(goal)}</div>`).join('')}</div><h2 class="section-title">نبذة عن أجور</h2><p class="executive-copy">وُلدت أجور من حاجة حقيقية واجهتها كثير من المنشآت: أنظمة موارد بشرية ورواتب معقدة، غير مرنة، تزيد العبء اليومي بدلًا من أن تقلله. ومن هنا جاءت فكرة بناء منصة سعودية أكثر بساطة وذكاءً، تساعد الشركات على إدارة موظفيها ورواتبها وعملياتها اليومية من مكان واحد.</p><p class="executive-copy">تجمع أجور بين وحدات الموارد البشرية الأساسية: الرواتب، الحضور والانصراف، الإجازات، التوظيف، الأداء، التعلم، النفقات، تطبيق الجوال، الخدمة الذاتية للموظفين، والتكاملات مع الأنظمة والمنصات الحكومية. تمنح فرق الموارد البشرية والمالية تجربة عمل أكثر وضوحًا وسرعة.</p><p class="executive-copy">القيمة الحقيقية لأجور لا تقتصر على أتمتة المهام، بل في تحويل الموارد البشرية من أعمال تشغيلية متكررة إلى منظومة أكثر كفاءة. تساعد المنشآت على تقليل الأخطاء، تحسين تجربة الموظف، دعم الامتثال، واتخاذ قرارات أفضل مع نمو الأعمال.</p></div>${footer}</section>
<section class="page">${header('منظومة التكاملات')}<div class="page-body">${pageTitle('منظومة أجور والتكاملات')}<p class="integration-intro">أجور ليست مجرد نظام للموارد البشرية والرواتب، بل منظومة متكاملة تربط الموارد البشرية، الرواتب، المالية، المنصات الحكومية، أنظمة المحاسبة، قنوات التوظيف، أجهزة الحضور، وخدمات الموظفين في منصة مركزية واحدة.</p><div class="integration-board"><div class="integration-board-title">منظومة أجور والتكاملات</div><div class="connector c1"></div><div class="connector c2"></div><div class="connector c3"></div><div class="connector c4"></div><div class="connector c5"></div><div class="connector c6"></div><div class="connector c7"></div><div class="integration-core"><strong>أجور</strong><span>منصة موحدة للموارد البشرية<br>والرواتب والتشغيل اليومي</span></div>${integrations.map((g)=>`<article class="integration-card ${g.className}"><div class="integration-card-head"><span class="integration-number">${g.no}</span><b>${esc(g.title)}</b><span class="integration-icon">${icon(g.icon)}</span></div><ul class="integration-list">${g.items.map((i)=>`<li>${esc(i)}</li>`).join('')}</ul></article>`).join('')}<div class="integration-note">منصة واحدة تربط بيانات الموظفين والحضور والرواتب والنفقات والموافقات والأنظمة الخارجية</div></div><p class="integration-summary">منصة واحدة تربط بيانات الموظفين والحضور والرواتب والنفقات والموافقات والأنظمة الخارجية لتقليل العمل اليدوي ورفع كفاءة التشغيل.</p></div>${footer}</section>
<section class="page">${header('عرض السعر التفصيلي')}<div class="page-body"><div class="pricing-top"><div>${pageTitle('عرض السعر التفصيلي')}<div class="pricing-subtitle">${esc(customerName)}</div></div><div class="pricing-meta"><span>تاريخ العرض</span><strong>${ltr(createdDate)}</strong></div></div><div class="pricing-table-wrap"><table class="pricing-table"><thead><tr><th>#</th><th>الخدمة / الباقة</th><th>الكمية</th><th>سعر الوحدة</th><th>الخصم</th><th>الإجمالي</th></tr></thead><tbody>${rows}</tbody></table></div><div class="pricing-bottom"><div class="pricing-note"><h3>تفاصيل الاشتراك</h3><p>تُسحب الباقات والأسعار والكميات والخصومات مباشرة من Line Items المرتبطة بالصفقة.</p><p>في حال عدم وجود Line Items، يستخدم النظام مبلغ الصفقة كاشتراك واحد.</p><p>العملة: ${ltr(currency)}</p></div><div class="totals"><div class="total-row"><span>الإجمالي قبل الضريبة</span><strong>${ltr(money(snapshot.totals.subtotal,currency),'money')}</strong></div><div class="total-row"><span>إجمالي الخصم</span><strong>${ltr(money(snapshot.totals.discount,currency),'money')}</strong></div><div class="total-row"><span>الضريبة</span><strong>${ltr(money(snapshot.totals.tax,currency),'money')}</strong></div><div class="total-row grand"><span>الإجمالي النهائي</span><strong>${ltr(money(snapshot.totals.grandTotal,currency),'money')}</strong></div></div></div></div>${footer}</section>
<section class="page">${header('خطوات التفعيل')}<div class="page-body">${pageTitle('رحلة تفعيل نظام أجور')}<p class="lead">خطوات منظمة لضمان جاهزية النظام قبل الإطلاق</p><div class="activation-panel"><h2 class="activation-panel-title">رحلة تفعيل نظام أجور</h2><p class="activation-panel-subtitle">خطوات منظمة لضمان جاهزية النظام قبل الإطلاق</p><div class="activation-steps">${activationSteps.map((s)=>`<article class="activation-step">${icon(s.icon)}<h3>${esc(s.title)}</h3><div class="step-number">${s.no}</div><p>${esc(s.body)}</p></article>`).join('')}</div></div><h2 class="timeline-title">الجدول الزمني المقترح للتفعيل</h2><p class="timeline-copy">يعتمد الجدول الزمني على حجم المنشأة، عدد الموظفين، جاهزية البيانات، وعدد الوحدات المطلوب تفعيلها. عادةً تمر رحلة التفعيل بالمراحل التالية:</p><table class="timeline-table"><thead><tr><th>المرحلة الزمنية</th><th>المحتوى والأنشطة</th></tr></thead><tbody><tr><td>الأسبوع الأول</td><td>اجتماع البداية، جمع المتطلبات، وتجهيز البيانات</td></tr><tr><td>الأسبوع الثاني</td><td>إعداد النظام، رفع البيانات، وضبط السياسات</td></tr><tr><td>الأسبوع الثالث</td><td>اختبار العمليات، مراجعة الإعدادات، والتكاملات المطلوبة</td></tr><tr><td>الأسبوع الرابع</td><td>التدريب، الإطلاق الفعلي، والمتابعة بعد الإطلاق</td></tr></tbody></table><div class="timeline-note">قد يتم تقليل أو تمديد المدة حسب نطاق المشروع، جاهزية البيانات، وعدد التكاملات المطلوبة.</div><h2 class="activation-summary-title">خلاصة رحلة التفعيل</h2><p class="activation-summary">تم تصميم رحلة تفعيل أجور لتكون واضحة، عملية، وقابلة للقياس، بحيث تنتقل المنشأة من مرحلة الإعداد إلى الاستخدام الفعلي بثقة، مع ضمان جاهزية البيانات، وضوح الصلاحيات، تدريب المستخدمين، واستقرار العمليات بعد الإطلاق.</p></div>${footer}</section>
<section class="page">${header('الشروط والأحكام')}<div class="page-body">${pageTitle('الشروط والأحكام')}<div class="party-grid"><article class="party-card"><h2>الطرف الأول (أجور)</h2>${partyRow('الاسم','شركة الرائدة للموارد البشرية — أجور')}${partyRow('السجل التجاري','')}${partyRow('الرقم الضريبي','')}${partyRow('العنوان','مبنى 8758، حي العليا، مكتب 309، الرمز البريدي 12214، الدور الثالث')}</article><article class="party-card"><h2>الطرف الثاني (العميل)</h2>${partyRow('الاسم',esc(customerName),true)}${partyRow('السجل التجاري',esc(customerCr),true)}${partyRow('الرقم الضريبي',esc(customerVat),true)}${partyRow('العنوان',esc(customerAddress),true)}</article></div><div class="terms-banner">الالتزامات</div><section class="terms-section"><h3>الطرف الأول:</h3>${obligationList(firstPartyObligations)}</section><section class="terms-section"><h3>الطرف الثاني:</h3><ol><li>${esc(secondPartyObligations[0])}</li></ol></section></div>${footer}</section>
<section class="page">${header('الشروط والأحكام')}<div class="page-body">${pageTitle('استكمال الشروط والأحكام')}<section class="terms-section"><h3>التزامات الطرف الثاني:</h3>${obligationList(secondPartyObligations.slice(1))}</section><div class="terms-columns"><section class="terms-block"><h2>الالتزامات المالية</h2><ol><li>يبدأ العقد ميلاديًا حسب عدد الحسابات الأدنى المتفق أو المرسل له في الباقة المختارة. وللطرف الأول حق تعديل الأسعار وإبلاغ الطرف الثاني قبل 90 يومًا من تاريخ بداية الاشتراك.</li><li>يجب سداد الدفعة قبل بدء تنفيذ الاشتراك من قبل الطرف الأول.</li><li>يتم احتساب اشتراك الخدمة لمدة سنة اعتبارًا من إرسال بلاغ بدء الاشتراك، وتكون مدة التجديد وفق العرض المتفق عليه.</li><li>يحق للطرف الأول إيقاف الخدمة وإبلاغ الطرف الثاني كتابيًا بعد إرسال مطالبات رسمية بالفواتير الإلكترونية المستحقة في حال عدم السداد.</li></ol></section><section class="terms-block"><h2>أحكام عامة</h2><ol><li>تخضع هذه الشروط والأحكام لأحكام الأنظمة السعودية.</li><li>أي خلاف قد ينشأ في شأن تطبيق هذه الشروط والأحكام أو تفسيرها أو تنفيذها، يلتزم الطرفان بمحاولة حله وديًا.</li><li>في حالة عدم القدرة على حل النزاع وديًا، يحق لأي طرف التقدم للجهات المختصة.</li><li>يحق للطرف الأول إيقاف الخدمات في حال تأخر العميل بسداد الفواتير المستحقة.</li><li>في حال تطلب الأمر الرجوع إلى أي جهة خارجية أو قانونية، تكون التكاليف المترتبة على ذلك على الطرف المتسبب.</li></ol></section></div><div class="refund-box"><strong>إنهاء الخدمة والاسترداد:</strong><br>يحق للعميل طلب استرجاع المبلغ فقط في حال لم يقم بأي استخدام للنظام أو تفعيل أي خدمة داخل النظام، ويكون طلب الاسترجاع خاضعًا لمراجعة الطرف الأول.</div></div>${footer}</section>
<section class="page">${header('الاعتماد والتوقيع')}<div class="page-body">${pageTitle('اعتماد عرض السعر')}<p class="lead">بتوقيع الطرفين أدناه، يقر كل طرف بمراجعته للعرض ونطاق الخدمة والأسعار والشروط المرفقة.</p><div class="signature-grid"><article class="signature-card"><h2>توقيع الطرف الأول</h2><div class="signature-field"><label>الاسم:</label><span>${esc(ownerName)}</span></div><div class="signature-field"><label>البريد:</label><span class="ltr">${esc(ownerEmail)}</span></div><div class="signature-field"><label>التاريخ:</label><span class="ltr">${esc(createdDate)}</span></div><div class="signature-field"><label>التوقيع:</label><div class="signature-line"></div></div></article><article class="signature-card"><h2>توقيع الطرف الثاني</h2><div class="signature-field"><label>الاسم:</label><span>${esc(contactName)}</span></div><div class="signature-field"><label>البريد:</label><span class="ltr">${esc(contactEmail)}</span></div><div class="signature-field"><label>التاريخ:</label><span class="ltr">${esc(createdDate)}</span></div><div class="signature-field"><label>التوقيع:</label><div class="signature-line"></div></div></article></div><div class="signature-note">يمثل هذا العرض مع نطاق العمل والأسعار والشروط وثيقة واحدة عند اعتماده.</div></div>${footer}</section>
</main></body></html>`;
}
