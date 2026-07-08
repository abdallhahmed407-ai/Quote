import { AR_PAGE_IMAGES } from './page-images-ar';
import { EN_PAGE_IMAGES } from './page-images-en';

type Lang = 'ar' | 'en';

function lang(value?: unknown): Lang {
  return ['en', 'eng', 'english', 'إنجليزي', 'انجليزي'].includes(String(value || '').trim().toLowerCase()) ? 'en' : 'ar';
}

function overlay(page: number, language: Lang): string {
  if (language === 'ar') {
    const map: Record<number, string> = {
      1: `<div class="field cover-name ar">{{CUSTOMER_NAME}}</div><div class="field cover-date ar">{{CREATED_DATE}}</div>`,
      6: `<div class="price-layer ar">{{PRICING_BODY}}</div>`,
      9: `<div class="field ar terms-name">{{CUSTOMER_NAME}}</div><div class="field ar terms-cr">{{CUSTOMER_CR}}</div><div class="field ar terms-vat">{{CUSTOMER_VAT}}</div><div class="field ar terms-address">{{CUSTOMER_ADDRESS}}</div>`,
      11: `<div class="field ar sig-owner-name">{{OWNER_NAME}}</div><div class="field ar sig-owner-date">{{CREATED_DATE}}</div>`,
    };
    return map[page] || '';
  }
  const map: Record<number, string> = {
    1: `<div class="field cover-name en">{{CUSTOMER_NAME}}</div><div class="field cover-date en">{{CREATED_DATE}}</div>`,
    7: `<div class="price-layer en">{{PRICING_BODY}}</div>`,
    10: `<div class="field en terms-name">{{CUSTOMER_NAME}}</div><div class="field en terms-cr">{{CUSTOMER_CR}}</div><div class="field en terms-vat">{{CUSTOMER_VAT}}</div><div class="field en terms-address">{{CUSTOMER_ADDRESS}}</div>`,
    12: `<div class="field en sig-owner-name">{{OWNER_NAME}}</div><div class="field en sig-owner-date">{{CREATED_DATE}}</div>`,
  };
  return map[page] || '';
}

function page(src: string, pageNumber: number, language: Lang): string {
  return `<section class="page image-page ${language}"><img class="page-bg" src="${src}" alt=""><div class="page-overlays">${overlay(pageNumber, language)}</div></section>`;
}

function style(language: Lang): string {
  return `<!doctype html><html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${language === 'ar' ? 'عرض سعر أجور' : 'Ojoor Quotation'}</title><style>
@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#e9e9ee}.page{position:relative;width:210mm;height:297mm;margin:18px auto;background:#fff;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,.14);page-break-after:always;break-after:page}.page:last-of-type{page-break-after:auto;break-after:auto}.page-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1}.page-overlays{position:absolute;inset:0;z-index:2;pointer-events:none}.field{position:absolute;font-family:Arial,Tahoma,sans-serif;color:#fff;font-weight:700;line-height:1.25;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden}.field.ar{direction:rtl}.field.en{direction:ltr}.cover-name{left:108mm;top:96.5mm;width:55mm;height:14mm;background:#1c327d;font-size:6.2mm;border-bottom:1.2mm dashed #a69cd7}.cover-date{left:46.5mm;top:96.5mm;width:55mm;height:14mm;background:#1c327d;font-size:5.2mm;border-bottom:1.2mm dashed #a69cd7}.price-layer{position:absolute;left:15mm;right:15mm;top:72mm;bottom:28mm;background:#fff;font-family:Arial,Tahoma,sans-serif;color:#172b73;overflow:hidden}.price-layer.ar{direction:rtl}.price-layer.en{direction:ltr}.price-box{font-size:3mm}.price-meta{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-bottom:4mm}.price-meta div{background:#f4f1fb;border:1px solid #ded8ee;border-radius:2mm;padding:3mm}.price-meta b{display:block;color:#7b5ea7;margin-bottom:1mm}.price-meta span{direction:ltr;unicode-bidi:plaintext}.price-table{width:100%;border-collapse:collapse;font-size:2.75mm}.price-table th{background:#1f347f;color:#fff;padding:2.6mm;text-align:inherit}.price-table td{border-bottom:1px solid #e1ddec;padding:2.3mm;vertical-align:top}.price-table tr:nth-child(even) td{background:#f6f3fb}.price-table small{display:block;color:#666;font-size:2.35mm;margin-top:.8mm}.price-totals{width:74mm;margin-top:4mm;margin-inline-start:auto;border:1px solid #ded8ee;border-radius:2mm;overflow:hidden;font-size:2.75mm}.price-totals div{display:flex;justify-content:space-between;gap:3mm;padding:2.2mm 3mm;border-bottom:1px solid #eee}.price-totals .grand{background:#1f347f;color:#fff;font-weight:800}.terms-name,.terms-cr,.terms-vat,.terms-address{left:22mm;width:67mm;height:7mm;background:#fbf9ff;color:#30334f;justify-content:flex-end;padding:0 3mm;border-bottom:.7mm dashed #b5add1;font-size:3.5mm}.terms-name{top:70mm}.terms-cr{top:93mm}.terms-vat{top:116mm}.terms-address{top:139mm}.sig-owner-name,.sig-owner-date{left:116mm;width:60mm;height:7mm;background:#fbf9ff;color:#30334f;justify-content:flex-end;padding:0 3mm;border-bottom:.5mm dashed #b5add1;font-size:3.4mm}.sig-owner-name{top:90mm}.sig-owner-date{top:103mm}html[lang=en] .cover-name{left:48mm;top:96.5mm}html[lang=en] .cover-date{left:109mm;top:96.5mm}html[lang=en] .terms-name,html[lang=en] .terms-cr,html[lang=en] .terms-vat,html[lang=en] .terms-address{left:118mm;justify-content:flex-start}html[lang=en] .sig-owner-name,html[lang=en] .sig-owner-date{left:29mm;justify-content:flex-start}.proposal-print-actions{width:210mm;max-width:calc(100% - 32px);margin:24px auto 56px;padding:18px;display:flex;justify-content:center}.proposal-print-button{min-width:240px;border:0;border-radius:12px;padding:14px 24px;color:#fff;background:linear-gradient(135deg,#1a2b6e,#7b5ea7);box-shadow:0 10px 24px rgba(26,43,110,.22);font:700 15px Arial,Tahoma,sans-serif;cursor:pointer}@media print{html,body{background:#fff!important}.page{margin:0!important;box-shadow:none!important}.proposal-print-actions{display:none!important}}
</style></head><body>`;
}

export function getProposalTemplate(language?: unknown): Promise<string> {
  const selected = lang(language);
  const images = selected === 'ar' ? AR_PAGE_IMAGES : EN_PAGE_IMAGES;
  return Promise.resolve(`${style(selected)}${images.map((src, index) => page(src, index + 1, selected)).join('')}<div class="proposal-print-actions"><button class="proposal-print-button" type="button" onclick="window.print()">${selected === 'ar' ? 'طباعة' : 'Print'}</button></div></body></html>`);
}
