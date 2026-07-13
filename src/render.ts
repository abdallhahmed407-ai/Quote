import type { ProposalSnapshot } from './types';
import { escapeHtml, renderPricing, type ProposalContext, type ProposalLanguage } from './pricing';
import { OJOOR_HR_STATION_LOGO_DATA_URL } from './logo';

const PROPOSAL_TIME_ZONE = 'Asia/Riyadh';
const OJOOR_LEGAL_NAME_AR = 'شركة الرائدة للموارد البشرية — أجور';
const OJOOR_LEGAL_NAME_EN = 'Al Raedah Human Resources Company — Ojoor';
const OJOOR_CR_NUMBER = '1010586885';
const OJOOR_VAT_NUMBER = '310712172300003';
const OJOOR_ADDRESS_AR = 'مبنى 8730، حي العليا، مكتب 309، الرمز البريدي 12214، الدور الثالث';
const OJOOR_ADDRESS_EN = 'Building No. 8730, Al Olaya District, Office No. 309, Postal Code 12214, Third Floor';
const FIRST_PARTY_NAME = 'Fahad Alkassem';
const FIRST_PARTY_SIGNATURE = `<svg class="fahad-signature" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 635 360" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Fahad Alkassem signature"><path fill="#123062" fill-rule="evenodd" d="M63,295L99,291L115,291L129,289L135,290L140,288L152,289L152,287L156,287L158,289L136,309L113,334L112,333L113,334L92,359L98,359L103,354L104,355L103,354L107,349L109,350L108,347L113,342L114,343L113,342L122,333L124,329L127,327L129,329L130,328L129,329L127,327L128,325L130,325L133,322L132,321L171,285L188,283L190,292L190,322L188,324L189,331L185,347L181,357L179,357L180,359L185,359L187,353L189,353L188,351L192,340L191,339L194,328L195,297L193,284L199,281L255,275L282,274L292,272L302,273L304,271L318,271L343,268L434,263L512,263L560,266L577,271L589,272L593,274L592,273L594,272L594,270L592,268L580,265L580,263L576,264L565,261L562,259L563,258L561,259L557,255L555,256L544,246L535,228L533,218L533,204L537,182L557,156L562,152L561,151L564,148L565,149L564,147L569,143L568,142L570,141L569,140L573,135L574,136L573,135L592,106L595,99L597,99L597,95L610,69L610,65L612,62L612,51L607,48L597,54L590,62L589,61L590,63L586,66L587,67L565,99L566,100L559,110L560,111L552,125L549,135L547,135L548,137L544,144L534,176L509,200L507,199L508,200L497,209L495,208L493,202L494,201L492,202L490,200L484,200L478,202L469,210L466,216L458,224L449,229L445,226L444,220L440,216L441,215L440,216L432,212L427,212L416,216L406,223L405,222L406,224L403,224L404,225L399,232L384,242L382,240L382,233L384,233L383,230L387,221L388,210L382,209L380,211L378,210L379,211L368,222L366,221L367,222L364,225L363,224L364,225L360,230L358,229L359,230L355,235L353,233L356,229L356,225L365,204L367,202L368,203L368,200L373,195L373,193L377,189L393,161L395,160L394,159L400,149L413,119L416,116L416,113L418,111L419,112L418,109L421,103L422,96L419,93L413,93L414,94L406,101L405,100L406,102L403,105L402,104L403,106L401,106L402,107L387,131L385,131L386,133L367,172L368,173L356,209L334,231L333,230L334,231L332,233L330,232L331,233L322,240L319,238L321,240L308,246L305,245L309,241L310,233L308,229L303,225L298,225L291,230L288,230L288,232L281,238L279,236L281,238L270,246L227,242L225,239L228,239L228,236L240,223L243,226L240,223L247,214L247,207L245,203L236,202L230,207L229,205L229,212L238,213L240,216L231,227L216,242L188,251L186,248L182,228L194,200L204,170L208,153L210,153L209,150L217,122L222,97L225,72L225,55L221,41L222,40L217,31L207,21L208,20L207,21L199,16L191,14L174,14L165,17L153,25L152,24L153,25L147,30L140,41L138,39L140,41L135,53L132,68L132,94L135,114L141,133L140,136L142,136L146,146L145,147L147,148L147,151L161,184L160,187L161,186L163,189L170,209L169,211L171,211L176,229L162,252L154,260L155,261L153,263L152,262L152,264L150,263L151,264L148,267L141,270L137,276L146,277L158,271L163,271L162,270L165,268L166,269L166,267L182,259L185,261L186,265L182,269L181,268L181,270L179,269L180,270L174,276L171,276L172,277L170,279L169,278L164,282L158,281L144,284L103,286L78,289L74,288L66,290ZM188,324L190,324ZM149,288L151,288ZM157,288L158,286L160,287L158,289ZM178,279L180,279ZM179,278L181,278ZM186,272L188,277L182,279L180,277ZM286,257L288,257ZM556,256L558,256ZM284,252L282,254L280,253L281,255L273,261L271,260L272,261L270,263L264,263L268,258L269,259L268,258L274,251ZM205,252L201,256L198,256L198,258L196,257L197,258L194,261L190,261L189,257L191,255L192,256L203,251ZM205,251L207,251ZM192,274L193,268L207,256L211,258L207,256L217,248L220,249L223,247L243,247L262,249L264,251L256,260L257,267L259,269L262,269L262,271L239,272L201,277L194,277ZM223,242L224,240L226,241L224,243ZM178,237L183,251L182,253L168,262L160,264L159,263L168,253L176,238ZM292,236L294,236ZM177,236L179,236ZM303,232L303,239L299,243L296,243L296,245L292,247L285,247L281,245L292,236L294,238L293,239L294,234L300,231ZM479,218L482,218ZM435,219L422,226L421,225L419,228L411,232L408,231L411,229L411,227L413,228L412,227L415,224L425,218L433,217ZM239,215L241,215ZM490,206L491,210L488,214L482,218L479,216L480,219L472,224L469,223L471,218L480,208L485,205ZM366,193L368,193ZM367,192L369,192ZM553,260L551,262L543,261L543,259L526,260L502,258L451,258L323,265L273,270L265,269L272,267L284,258L287,258L287,256L292,252L293,253L294,251L310,250L322,245L340,233L349,223L350,226L346,237L346,243L349,246L365,232L364,231L371,226L370,225L381,215L383,216L376,237L376,240L380,246L389,245L399,238L402,239L410,237L417,233L419,234L418,233L420,231L435,224L438,224L441,230L440,231L441,230L444,233L455,233L455,231L462,227L464,229L472,229L496,216L516,200L518,202L516,200L530,188L531,190L529,193L529,223L532,236L536,242L535,244L536,243L538,245L538,248L539,247L545,255ZM542,165L544,165ZM567,143L569,143ZM567,107L569,107ZM415,101L416,102L414,108L412,108L413,110L408,118L409,119L399,140L397,140L398,142L386,165L384,165L385,167L371,189L368,191L367,190L369,183L371,181L371,177L388,139L391,135L392,136L391,134L394,128L396,128L396,125L406,110ZM606,55L607,62L603,70L603,74L595,91L589,99L589,102L576,123L571,128L569,133L544,165L543,162L545,160L553,136L555,136L555,131L557,131L556,129L560,124L559,123L565,111L569,107L569,104L571,104L571,100L578,89L580,89L579,87L596,63ZM185,18L198,21L204,25L215,38L220,52L220,80L217,92L216,105L214,113L212,115L212,123L200,167L197,171L197,176L191,194L189,195L189,200L187,202L181,221L179,222L167,188L168,187L160,171L152,147L143,126L144,124L141,120L136,92L136,70L140,52L148,37L164,23L175,19Z"/></svg>`;

function replaceAll(source: string, marker: string, value: string): string {
  return source.split(marker).join(value);
}

function replaceCidContent(source: string, cid: string, value: string): string {
  const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<([A-Za-z][\\w:-]*)\\b[^>]*\\bdata-cid=["']${escapedCid}["'][^>]*>)([\\s\\S]*?)(<\\/\\2>)`, 'g');
  return source.replace(pattern, (_match, opening: string, _tag: string, _content: string, closing: string) => `${opening}${value}${closing}`);
}

function replaceCidOuter(source: string, cid: string, value: string): string {
  const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<([A-Za-z][\\w:-]*)\\b[^>]*\\bdata-cid=["']${escapedCid}["'][^>]*>[\\s\\S]*?<\\/\\1>`, 'g');
  return source.replace(pattern, value);
}

function replaceClassContent(source: string, className: string, value: string): string {
  const escapedClass = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(<([A-Za-z][\\w:-]*)\\b[^>]*\\bclass=["'][^"']*\\b${escapedClass}\\b[^"']*["'][^>]*>)[\\s\\S]*?(<\\/\\2>)`, 'g');
  return source.replace(pattern, (_match, opening: string, _tag: string, closing: string) => `${opening}${value}${closing}`);
}

function replaceProposalBranding(html: string): string {
  const coverLogo = '<span class="ojoor-brand-logo ojoor-brand-logo-cover" role="img" aria-label="Ojoor HR Station"></span>';
  const headerLogo = '<span class="ojoor-brand-logo ojoor-brand-logo-header" role="img" aria-label="Ojoor HR Station"></span>';
  let branded = replaceClassContent(html, 'cover-top', coverLogo);
  branded = replaceClassContent(branded, 'ih-logo', headerLogo);
  return branded;
}

function normalizeProposalLanguage(value: unknown): ProposalLanguage {
  const normalized = String(value || '').trim().toLowerCase();
  if (['english', 'en', 'eng', 'إنجليزي', 'انجليزي'].includes(normalized)) return 'en';
  return 'ar';
}

function formatProposalDate(value: unknown, language: ProposalLanguage): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  if (language === 'en') {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: PROPOSAL_TIME_ZONE }).format(date);
  }
  return new Intl.DateTimeFormat('ar-EG-u-ca-gregory-nu-arab', { day: 'numeric', month: 'long', year: 'numeric', timeZone: PROPOSAL_TIME_ZONE }).format(date);
}

function joinAddress(parts: unknown[], separator: string): string {
  return parts.map((part) => String(part || '').trim()).filter(Boolean).join(separator);
}

function injectDynamicStyles(html: string): string {
  const style = `<style id="ojoor-dynamic-hubspot-styles">
    html,body,.page,.page *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
    .ojoor-brand-logo{display:block!important;background-image:url("${OJOOR_HR_STATION_LOGO_DATA_URL}")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:contain!important;flex:0 0 auto!important}
    .cover-top{display:flex!important;align-items:center!important;justify-content:center!important;padding:28px 60px 10px!important;min-height:88px!important}
    .ojoor-brand-logo-cover{width:250px!important;height:74px!important;filter:none!important;opacity:1!important}
    .ih-logo{display:block!important;width:128px!important;height:42px!important;min-width:128px!important;font-size:0!important;line-height:0!important;color:transparent!important;background:#fff!important;background-image:none!important;-webkit-mask-image:url("${OJOOR_HR_STATION_LOGO_DATA_URL}")!important;mask-image:url("${OJOOR_HR_STATION_LOGO_DATA_URL}")!important;-webkit-mask-repeat:no-repeat!important;mask-repeat:no-repeat!important;-webkit-mask-position:center!important;mask-position:center!important;-webkit-mask-size:118px 35px!important;mask-size:118px 35px!important;filter:none!important;opacity:1!important;flex:0 0 128px!important}
    .ih-logo>*{display:none!important}
    .ojoor-brand-logo-header{display:none!important}
    .print-toolbar{position:relative;z-index:999999;display:flex;align-items:center;justify-content:center;gap:8px;direction:ltr;width:100%;margin:28px auto 44px}.print-toolbar[dir="rtl"]{direction:rtl}.print-button{appearance:none;border:0;border-radius:999px;background:#1f347f;color:#fff;box-shadow:0 12px 34px rgba(31,52,127,.24);font-family:Cairo,Arial,Tahoma,sans-serif;font-size:20px;font-weight:900;line-height:1;padding:20px 54px;min-width:220px;cursor:pointer}.print-button:hover{filter:brightness(1.07)}.print-button:active{transform:translateY(1px)}
    .page-num{font-size:10px;color:#9999BB;font-weight:600;direction:ltr;unicode-bidi:isolate;min-width:64px;text-align:center;display:inline-block}
    .dynamic-pricing-body{display:block!important;align-items:initial!important;justify-content:initial!important;text-align:initial!important;padding-top:0!important;margin-top:0!important;min-height:auto!important;height:auto!important;background:transparent!important;transform:translateY(15px)!important;transform-origin:top center!important}.dynamic-pricing-body .price-box{margin-top:0!important}
    .price-box{font-family:Cairo,Arial,Tahoma,sans-serif;color:#172b73;font-size:12px;line-height:1.45;width:100%;direction:inherit}.price-box.rtl{direction:rtl;text-align:right}.price-box.ltr{direction:ltr;text-align:left}.price-meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:0 0 22px}.price-meta div{background:#f4f1fb;border:1px solid #ded8ee;border-radius:10px;padding:13px 16px}.price-meta b{display:block;color:#7b5ea7;margin-bottom:4px;font-size:12px}.price-meta span{direction:ltr;unicode-bidi:plaintext;color:#172b73}.price-table{width:100%;border-collapse:collapse;font-size:12px}.price-table th{background:#1f347f;color:#fff;padding:11px 13px;text-align:inherit;font-weight:700}.price-table td{border-bottom:1px solid #e1ddec;padding:11px 13px;vertical-align:top}.price-table tr:nth-child(even) td{background:#f6f3fb}.price-table small{display:block;color:#666;font-size:10px;margin-top:3px}.price-totals{width:310px;margin-top:22px;margin-inline-start:auto;border:1px solid #ded8ee;border-radius:10px;overflow:hidden;font-size:12px}.price-totals div{display:flex;justify-content:space-between;gap:12px;padding:10px 13px;border-bottom:1px solid #eee}.price-totals .grand{background:#1f347f;color:#fff;font-weight:800}.price-box.rtl .price-totals{margin-right:0;margin-left:auto}.price-box.ltr .price-totals{margin-left:auto;margin-right:0}
    .sig-line-row .sl-dots,.pf .ef,.pf .pf-value,.cover-card .cc-value,.cover-card .ef-light{white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important}.cover-card .cc-value,.cover-card .ef-light,[data-cid="QX2Xfb"],[data-cid="HfpEDS"],[data-cid="MzWWQN"],[data-cid="2WqGGa"]{font-size:18px!important;line-height:1.08!important;max-height:44px!important;overflow:hidden!important;text-align:center!important;display:flex!important;align-items:center!important;justify-content:center!important;padding-inline:8px!important}.cover-card [data-cid="K7Bu6y"],.cover-card [data-cid="UqDNGq"],[data-cid="qJ3WHc"],[data-cid="x2nAbT"]{font-size:18px!important;line-height:1.08!important;text-align:center!important}.sigs-row .sl-dots{font-weight:700;color:#26324c;line-height:1.15}.party-card .pf-value,.party-card .ef{font-weight:700;color:#26324c;line-height:1.2}.party-card .pf-value{min-height:22px}.party-card .pf-value .ef{display:inline!important}.inner-content{page-break-inside:avoid}.page{page-break-after:always;break-after:page;overflow:hidden}.page:last-of-type{page-break-after:auto;break-after:auto}html[lang="en"] .sigs-row .sl-dots{transform:translateY(-17px)}
    [data-cid="6xAF3a"],[data-cid="iRqSBF"]{height:70px!important;min-height:70px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:visible!important;padding:0!important}.fahad-signature{display:block!important;width:190px!important;height:76px!important;max-width:100%!important;overflow:visible!important}html[lang="en"] .sigs-row [data-cid="iRqSBF"]{transform:translateY(-8px)!important}
    @media print{@page{size:A4;margin:0}html,body{margin:0!important;background:#fff!important}.page{margin:0!important;box-shadow:none!important}.print-toolbar{display:none!important}html,body,.page,.page *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}}
  </style>`;
  return html.includes('</head>') ? html.replace('</head>', `${style}</head>`) : `${style}${html}`;
}

function injectPrintButton(html: string, language: ProposalLanguage): string {
  if (html.includes('class="print-toolbar"') || html.includes("class='print-toolbar'")) return html;
  const label = language === 'en' ? 'Print' : 'طباعة';
  const dir = language === 'en' ? 'ltr' : 'rtl';
  const button = `<div class="print-toolbar" dir="${dir}"><button type="button" class="print-button" onclick="window.print()" aria-label="${label}">${label}</button></div>`;
  return html.includes('</body>') ? html.replace('</body>', `${button}</body>`) : `${html}${button}`;
}

function injectPageNumbers(html: string): string {
  if (html.includes('class="page-num"') || html.includes("class='page-num'")) return html;
  const sectionCount = (html.match(/<section class="page(?:\s|")/g) || []).length || (html.match(/<section\b/g) || []).length;
  if (!sectionCount) return html;
  let current = 2;
  return html.replace(
    /(<footer class="inner-footer"[^>]*>\s*<span[^>]*>[\s\S]*?<\/span>)[\s\S]*?(<span[^>]*>\s*ojoor\.net\s*<\/span>\s*<\/footer>)/g,
    (_match, first: string, last: string) => `${first}<span class="page-num">${current++} / ${sectionCount}</span>${last}`,
  );
}

export function renderProposal(snapshot: ProposalSnapshot, template: string, _downloadPath = ''): string {
  const deal = snapshot.deal || {};
  const company = snapshot.company || {};
  const contact = snapshot.contact || {};
  const owner = snapshot.owner || {};
  const language = normalizeProposalLanguage(deal.proposal_language);

  const customerName = String(deal.legal_name_arabic || '').trim();
  const customerAddress = company.billing_address || deal.billing_address || joinAddress([company.address, company.address2, company.city, company.state, company.country, company.zip], language === 'en' ? ', ' : '، ');

  const context: ProposalContext = {
    customerName,
    customerCr: company.cr_number || deal.cr_number || '',
    customerVat: company.vat_number || deal.vat_number || '',
    customerAddress,
    contactName: [contact.firstname, contact.lastname].filter(Boolean).join(' '),
    ownerName: [owner.firstName, owner.lastName].filter(Boolean).join(' '),
    createdDate: formatProposalDate(snapshot.createdAt, language),
    expirationDate: formatProposalDate(deal.proposal_expiration_date, language),
    currency: snapshot.totals?.currency || 'SAR',
    quoteNumber: `OJR-${snapshot.dealId}-V${snapshot.version}`,
    language,
  };

  const pricing = renderPricing(snapshot, context);
  const values: Record<string, string> = {
    '{{CUSTOMER_NAME}}': escapeHtml(context.customerName),
    '{{CUSTOMER_CR}}': escapeHtml(context.customerCr || (language === 'ar' ? 'رقم السجل التجاري' : 'Commercial Registration No.')),
    '{{CUSTOMER_VAT}}': escapeHtml(context.customerVat || (language === 'ar' ? 'الرقم الضريبي' : 'Tax Number')),
    '{{CUSTOMER_ADDRESS}}': escapeHtml(context.customerAddress || (language === 'ar' ? 'عنوان المنشأة' : 'Company Address')),
    '{{OJOOR_LEGAL_NAME}}': escapeHtml(language === 'en' ? OJOOR_LEGAL_NAME_EN : OJOOR_LEGAL_NAME_AR),
    '{{OJOOR_CR}}': escapeHtml(OJOOR_CR_NUMBER),
    '{{OJOOR_VAT}}': escapeHtml(OJOOR_VAT_NUMBER),
    '{{OJOOR_ADDRESS}}': escapeHtml(language === 'en' ? OJOOR_ADDRESS_EN : OJOOR_ADDRESS_AR),
    '{{CONTACT_NAME}}': escapeHtml(context.contactName),
    '{{OWNER_NAME}}': escapeHtml(context.ownerName),
    '{{FIRST_PARTY_NAME}}': escapeHtml(FIRST_PARTY_NAME),
    '{{CREATED_DATE}}': escapeHtml(context.createdDate),
    '{{EXPIRATION_DATE}}': escapeHtml(context.expirationDate),
    '{{PRICING_BODY}}': pricing.firstBody,
    '{{EXTRA_PRICING_PAGES}}': pricing.extraPages,
  };

  let html = replaceProposalBranding(template);
  html = injectPrintButton(injectPageNumbers(injectDynamicStyles(html)), language);

  const cidValues: Record<string, string> = language === 'en'
    ? {
      QX2Xfb: values['{{CUSTOMER_NAME}}'], HfpEDS: values['{{CUSTOMER_NAME}}'],
      K7Bu6y: values['{{CREATED_DATE}}'], UqDNGq: values['{{CREATED_DATE}}'],
      BA5R34: values['{{CUSTOMER_NAME}}'], '-86fZo': values['{{CUSTOMER_NAME}}'],
      ogxdcs: values['{{CUSTOMER_CR}}'], gTQRu5: values['{{CUSTOMER_CR}}'],
      sJOAK8: values['{{CUSTOMER_VAT}}'], ivvYPk: values['{{CUSTOMER_VAT}}'],
      '2RObk5': values['{{CUSTOMER_ADDRESS}}'], Q2jzR7: values['{{CUSTOMER_ADDRESS}}'],
      ynPTB: values['{{FIRST_PARTY_NAME}}'], 'ynPTB-': values['{{FIRST_PARTY_NAME}}'],
      ZTFgC: values['{{CREATED_DATE}}'], 'ZTFgC-': values['{{CREATED_DATE}}'],
      iRqSBF: FIRST_PARTY_SIGNATURE, Qcvb8K: '', Au8d6g: '', LrQYZ5: '',
    }
    : {
      MzWWQN: values['{{CUSTOMER_NAME}}'], '2WqGGa': values['{{CUSTOMER_NAME}}'],
      qJ3WHc: values['{{CREATED_DATE}}'], x2nAbT: values['{{CREATED_DATE}}'],
      xB8K53: values['{{CUSTOMER_NAME}}'], jZvbMg: values['{{CUSTOMER_NAME}}'],
      mlVSEo: values['{{CUSTOMER_CR}}'], bnGZN1: values['{{CUSTOMER_CR}}'],
      teEWVO: values['{{CUSTOMER_VAT}}'], Gpnfdu: values['{{CUSTOMER_VAT}}'],
      NpEsFj: values['{{CUSTOMER_ADDRESS}}'], VzkAyN: values['{{CUSTOMER_ADDRESS}}'],
      kODtr_: values['{{FIRST_PARTY_NAME}}'], j42ryV: values['{{CREATED_DATE}}'],
      '6xAF3a': FIRST_PARTY_SIGNATURE, 'R-IAxZ': '', nl1wjI: '', Ie8gsS: '',
    };

  for (const [cid, value] of Object.entries(cidValues)) html = replaceCidContent(html, cid, value);
  html = replaceCidOuter(html, language === 'en' ? 'DE4VvI' : 'a24TUK', `<div class="empty-body dynamic-pricing-body">${pricing.firstBody}</div>`);
  for (const [marker, value] of Object.entries(values)) html = replaceAll(html, marker, value);
  return html
    .replace(/\bOGR-/g, 'OJR-')
    .replace(/مبنى\s*8758/g, 'مبنى 8730')
    .replace(/Building\s*No\.?\s*8758/gi, 'Building No. 8730')
    .replace(/BuildingNo\.?\s*8758/gi, 'Building No. 8730')
    .replace(/Building\s*No\.?\s*8730/gi, 'Building No. 8730')
    .replace(/BuildingNo\.?\s*8730/gi, 'Building No. 8730');
}
