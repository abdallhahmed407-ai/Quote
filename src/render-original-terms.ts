import { esc, page, partyField, type RenderContext } from './render-utils';

const firstPartyObligations = [
  'يلتزم الطرف الأول بتقديم هذه الشروط والأحكام، والملحق، والعرض الفني.',
  'يلتزم الطرف الأول بالالتزام التام على الخدمات المقدمة من النظام.',
  'يتحرى الطرف الأول دقتها، بما لا يتعارض مع أنظمة المملكة العربية السعودية.',
  'ينائب الموافقة الطرف الثاني، ولا يجوز استخدامها أو نشرها إلا بموافقة الطرف الثاني.',
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
  'يتحمل الطرف الثاني المسؤولية عن أي تصرف يقوم بتعيين مستخدم أو عميل أو موظف قد خالف التعليمات المقدمة.',
  'لا يجوز للطرف الثاني بأي حال التنازل عن كل أو جزء من الالتزامات دون موافقة كتابية.',
  'عدم نشر أو إعادة نسخ أو بيانات عن المنصة على أي من حسابات شبكات التواصل الاجتماعي دون موافقة أو إذن مسبق مكتوب.',
  'المرونة وسرعة التجاوب مع متطلبات العمل والالتزام بالتوجيهات الفنية للطرف الأول.',
  'بذل المسؤولية لضمان الالتزام من أي أضرار تنجم عن سوء استخدام الخدمة.',
];

const financialObligations = [
  'يبدأ العقد ميلادياً حسب عدد الحسابات الدنى المتفق أو المرسل له في الباقة المختارة. وللطرف الأول حق تعديل الأسعار وإبلاغ الطرف الثاني قبل 90 يوماً من تاريخ بداية الاشتراك.',
  'يجب سداد الدفعة قبل بدء تنفيذ الاشتراك من قبل الطرف الأول.',
  'يتم احتساب اشتراك الخدمة لمدة سنة اعتباراً من إرسال بلاغ بدء الاشتراك، والتي تبلغ مدتها 30 يوماً من تاريخ نهاية الاشتراك.',
  'يحق للطرف الأول إيقاف الخدمة وإبلاغ الطرف الثاني كتابياً بعد إرسال مطالبات رسمية بالفواتير الإلكترونية المستحقة في حال عدم السداد.',
];

const disputeTerms = [
  'تخضع هذه الشروط والأحكام لأحكام الأنظمة السعودية.',
  'أي خلاف قد ينشأ في شأن تطبيق هذه الشروط والأحكام، أو تفسيرها، أو تنفيذها، يلتزم الطرفان بمحاولة حله ودياً دون الرجوع إلى أي جهة.',
  'في حالة عدم القدرة على حل النزاع ودياً، يحق لأي طرف التقدم للجهات المختصة.',
  'يحق للطرف الأول إيقاف هذه الخدمات في حال تأخر العميل بسداد الفواتير المستحقة.',
  'في حال تطلب الأمر الرجوع إلى أي جهة خارجية أو قانونية، تكون التكاليف المترتبة على ذلك على الطرف المتسبب.',
];

const list = (items: string[], start = 1): string =>
  `<ol class="terms-list" start="${start}">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ol>`;

const termsTitle = '<h1 class="sec-title">الشروط والأحكام</h1>';

export function renderOriginalTermsPages(context: RenderContext): string {
  const parties = `
    ${termsTitle}
    <div class="parties-row">
      <div class="party-card">
        <h3>الطرف الأول (أجور)</h3>
        ${partyField('الاسم', 'شركة الرائدة للموارد البشرية — أجور')}
        ${partyField('السجل التجاري', '')}
        ${partyField('الرقم الضريبي', '')}
        ${partyField('العنوان', 'مبنى 8758، حي العليا، مكتب 309، الرمز البريدي 12214، الدور الثالث')}
      </div>
      <div class="party-card">
        <h3>الطرف الثاني (العميل)</h3>
        ${partyField('الاسم', esc(context.customerName), true)}
        ${partyField('السجل التجاري', esc(context.customerCr), true)}
        ${partyField('الرقم الضريبي', esc(context.customerVat), true)}
        ${partyField('العنوان', esc(context.customerAddress), true)}
      </div>
    </div>
    <div class="terms-sec">الالتزامات</div>
    <p class="terms-subsec">الطرف الأول:</p>
    ${list(firstPartyObligations)}`;

  const secondParty = `
    ${termsTitle}
    <div class="terms-sec">الالتزامات</div>
    <p class="terms-subsec">الطرف الثاني:</p>
    ${list(secondPartyObligations)}`;

  const financialAndGeneral = `
    ${termsTitle}
    <div class="terms-sec">الالتزامات المالية</div>
    ${list(financialObligations)}
    <div class="terms-sec">أحكام عامة</div>
    <p class="terms-subsec">الفصل في النزاعات:</p>
    ${list(disputeTerms)}`;

  const signatures = `
    ${termsTitle}
    <div class="terms-sec">إنهاء الخدمة والاسترداد</div>
    <p class="refund-copy">يحق للعميل طلب استرجاع المبلغ فقط في حال لم يقم بأي استخدام للنظام أو تفعيل أي خدمة داخل النظام، ويكون طلب الاسترجاع خاضعاً لمراجعة الطرف الأول.</p>
    <div class="terms-sec">التوقيعات</div>
    <div class="sigs-row">
      <div class="sig-block">
        <h3>توقيع الطرف الأول</h3>
        <div class="sig-line-row"><span class="sl-label">الاسم:</span><span class="signature-value">${esc(context.ownerName)}</span></div>
        <div class="sig-line-row"><span class="sl-label">التاريخ:</span><span class="signature-value ltr">${esc(context.createdDate)}</span></div>
        <div class="sig-line-row"><span class="sl-label">التوقيع:</span><span class="sl-dots"></span></div>
      </div>
      <div class="sig-block">
        <h3>توقيع الطرف الثاني</h3>
        <div class="sig-line-row"><span class="sl-label">الاسم:</span><span class="signature-value">${esc(context.contactName)}</span></div>
        <div class="sig-line-row"><span class="sl-label">التاريخ:</span><span class="signature-value ltr">${esc(context.createdDate)}</span></div>
        <div class="sig-line-row"><span class="sl-label">التوقيع:</span><span class="sl-dots"></span></div>
      </div>
    </div>`;

  return [
    page('الشروط والأحكام', parties, 'terms-page terms-page-parties'),
    page('الشروط والأحكام', secondParty, 'terms-page terms-page-obligations'),
    page('الشروط والأحكام', financialAndGeneral, 'terms-page terms-page-financial'),
    page('الشروط والأحكام', signatures, 'terms-page terms-page-signatures'),
  ].join('');
}
