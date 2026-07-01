const svgDataUrl = (svg: string): string => {
  const bytes = new TextEncoder().encode(svg);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `data:image/svg+xml;base64,${btoa(binary)}`;
};

const ecoCards = [
  [610, 105, 1, 'الأنظمة الحكومية', 'Government', ['GOSI', 'Muqeem', 'Mudad']],
  [635, 345, 2, 'أنظمة المحاسبة', 'ERP', ['Odoo', 'QuickBooks', 'ERP Systems']],
  [610, 585, 3, 'أجهزة الحضور والبصمة', 'Attendance', ['ZKTeco', 'Biometric Devices', 'RFID / NFC']],
  [332, 690, 4, 'قنوات التوظيف', 'واستقطاب المواهب', ['LinkedIn', 'X', 'Career Portal']],
  [55, 585, 5, 'الإشعارات وسير العمل', 'Workflows', ['SMTP', 'Email', 'Workflow Alerts']],
  [30, 345, 6, 'تطبيق الجوال', 'والخدمة الذاتية', ['iOS App', 'Android App', 'Employee Self-Service']],
  [55, 105, 7, 'تكاملات مخصصة', 'وقابلة للتوسع', ['API', 'Custom Integrations', 'Future Connectors']],
] as const;

const ecoCard = ([x, y, number, title, subtitle, items]: typeof ecoCards[number]): string => `
<g transform="translate(${x} ${y})" font-family="Cairo,Arial,sans-serif">
  <rect width="235" height="155" rx="20" fill="#fff" stroke="#E3DEED"/>
  <path d="M0 20a20 20 0 0 1 20-20h195a20 20 0 0 1 20 20v48H0z" fill="url(#brand)"/>
  <circle cx="28" cy="34" r="18" fill="none" stroke="#fff" stroke-width="2"/>
  <text x="28" y="41" text-anchor="middle" font-size="17" fill="#fff">${number}</text>
  <text x="140" y="29" text-anchor="middle" direction="rtl" font-size="14" font-weight="700" fill="#fff">${title}</text>
  <text x="140" y="50" text-anchor="middle" direction="rtl" font-size="11" fill="#EEE7F8">${subtitle}</text>
  ${items.map((item, index) => `<text x="20" y="${91 + index * 27}" font-size="12" fill="#1A2B6E">${item}</text><circle cx="214" cy="${87 + index * 27}" r="4" fill="#7B5EA7"/>`).join('')}
</g>`;

const ecosystemSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
<defs><linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A2B6E"/><stop offset="1" stop-color="#7B5EA7"/></linearGradient></defs>
<rect width="900" height="900" rx="22" fill="#FEFDFF"/><rect x="1" y="1" width="898" height="898" rx="22" fill="none" stroke="#E4DFF0"/>
<text x="450" y="64" text-anchor="middle" direction="rtl" font-family="Cairo,Arial,sans-serif" font-size="35" font-weight="800" fill="#1A2B6E">منظومة أجور والتكاملات</text>
<g stroke="#8870AA" stroke-width="2.5" stroke-dasharray="4 6" opacity=".8">${[[690,190],[720,420],[690,670],[450,720],[210,670],[180,420],[210,190]].map(([x,y]) => `<line x1="450" y1="430" x2="${x}" y2="${y}"/>`).join('')}</g>
<g><rect x="342" y="320" width="216" height="220" rx="58" fill="#fff" stroke="#E7E2F1" stroke-width="8"/><circle cx="430" cy="390" r="9" fill="#7B5EA7"/><rect x="446" y="370" width="13" height="29" rx="6" fill="#7B5EA7"/><rect x="466" y="352" width="13" height="47" rx="6" fill="#7B5EA7"/><text x="450" y="459" text-anchor="middle" direction="rtl" font-family="Cairo,Arial,sans-serif" font-size="50" font-weight="900" fill="#1A2B6E">أجور</text><text x="450" y="493" text-anchor="middle" direction="rtl" font-family="Cairo,Arial,sans-serif" font-size="15" font-weight="700" fill="#7B5EA7">منصة موحدة للموارد البشرية</text><text x="450" y="518" text-anchor="middle" direction="rtl" font-family="Cairo,Arial,sans-serif" font-size="13" fill="#45455A">والرواتب والتشغيل اليومي</text></g>
${ecoCards.map(ecoCard).join('')}
<rect x="130" y="854" width="640" height="30" rx="14" fill="#FAF9FD" stroke="#D8D2E7"/><text x="450" y="875" text-anchor="middle" direction="rtl" font-family="Cairo,Arial,sans-serif" font-size="12" fill="#1A2B6E">منصة واحدة تربط بيانات الموظفين والحضور والرواتب والنفقات والموافقات والأنظمة الخارجية</text>
</svg>`;

const activationSteps = [
  ['1', 'مرحلة البداية', 'فهم الاحتياجات', '◈'], ['2', 'جمع البيانات', 'الموظفون والعقود', '▤'],
  ['3', 'إعداد النظام', 'الصلاحيات والسياسات', '⚙'], ['4', 'التكاملات', 'الأنظمة والأجهزة', '↗'],
  ['5', 'التجربة والاختبار', 'الرواتب والتقارير', '✓'], ['6', 'التدريب', 'مسؤول النظام والفرق', '▣'],
  ['7', 'الإطلاق الفعلي', 'الخدمة الذاتية', '▲'],
];

export const ACTIVATION_GRAPHIC_HTML = `
<div style="position:relative;padding:12px 14px 10px;border:1px solid #E5DFF5;border-radius:12px;background:#FEFDFF;min-height:205px;overflow:hidden;font-family:Cairo,Arial,sans-serif">
  <div style="text-align:center;color:#1A2B6E;font-size:18px;font-weight:900">رحلة تفعيل نظام أجور</div>
  <div style="text-align:center;color:#77738A;font-size:11px;margin:1px 0 8px">خطوات منظمة لضمان جاهزية النظام قبل الإطلاق</div>
  <div style="position:relative;display:grid;grid-template-columns:repeat(7,1fr);gap:4px;direction:rtl;padding-top:2px">
    <div style="position:absolute;top:58px;right:5%;left:5%;height:2px;background:#8B6AAA"></div>
    ${activationSteps.map(([number, title, copy, symbol]) => `<div style="position:relative;z-index:1;text-align:center;min-width:0"><div style="height:20px;color:#1A2B6E;font-size:7.5px;font-weight:800;line-height:1.25">${title}</div><div style="height:28px;color:#1A2B6E;font-size:18px;line-height:28px">${symbol}</div><div style="width:32px;height:32px;margin:0 auto 8px;border:3px solid #fff;border-radius:50%;background:linear-gradient(135deg,#1A2B6E,#7B5EA7);color:#fff;font-size:13px;font-weight:800;line-height:26px">${number}</div><div style="color:#45455A;font-size:7px;line-height:1.5;padding:0 2px">${copy}</div></div>`).join('')}
  </div>
  <div style="margin-top:8px;padding:5px 10px;border-radius:10px;background:#F7F6FF;text-align:center;color:#57536B;font-size:7.5px">تبدأ الرحلة بمرحلة التحليل وتنتهي بإطلاق النظام ومتابعة الاستقرار التشغيلي</div>
</div>`;

export const ECOSYSTEM_IMAGE_DATA_URL = svgDataUrl(ecosystemSvg);
