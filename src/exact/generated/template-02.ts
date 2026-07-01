export const EXACT_TEMPLATE_02 = String.raw`dius: 6px 0 0 0; }

.schedule-table td {
  padding: 10px 16px;
  border-bottom: 1px solid #E8E2F5;
  color: #343448;
  font-size: 13px;
  vertical-align: top;
}

.schedule-table tr:nth-child(even) td { background: #F7F6FF; }

.week-pill {
  display: inline-block;
  background: #7B5EA7;
  color: #ffffff;
  border-radius: 20px;
  padding: 2px 13px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}

.note-box {
  background: #F7F6FF;
  border-right: 4px solid #7B5EA7;
  padding: 15px 20px;
  border-radius: 0 8px 8px 0;
  margin: 16px 0;
  font-size: 13px;
  color: #343448;
  line-height: 1.85;
}

/* ============================================================ */
/* PAGE 6 — TERMS                                             */
/* ============================================================ */
.parties-row {
  display: flex;
  gap: 18px;
  margin: 18px 0;
}

.party-card {
  flex: 1;
  border: 1.5px solid #D4C8F0;
  border-radius: 12px;
  padding: 18px 20px;
  background: #FAFAFF;
}

.party-card h3 {
  font-size: 14px;
  font-weight: 800;
  color: #1A2B6E;
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 2px solid #7B5EA7;
}

.pf {
  margin-bottom: 10px;
}

.pf-label {
  font-size: 10.5px;
  font-weight: 700;
  color: #7B5EA7;
  display: block;
  margin-bottom: 2px;
}

.pf-value {
  display: block;
  border-bottom: 1px solid #C4B8E8;
  padding-bottom: 3px;
  min-height: 22px;
  font-size: 12.5px;
  color: #343448;
}

.terms-sec {
  font-size: 15px;
  font-weight: 700;
  color: #1A2B6E;
  background: #EEF0FF;
  padding: 8px 14px;
  border-radius: 6px;
  margin: 22px 0 10px;
}

.terms-subsec {
  font-size: 13.5px;
  font-weight: 700;
  color: #7B5EA7;
  margin: 16px 0 7px;
}

.terms-list {
  padding-right: 20px;
  margin-bottom: 14px;
}

.terms-list li {
  font-size: 12.5px;
  color: #343448;
  line-height: 1.85;
  margin-bottom: 7px;
  padding-right: 4px;
}

/* Signatures */
.sigs-row {
  display: flex;
  gap: 30px;
  margin-top: 36px;
}

.sig-block {
  flex: 1;
  border: 1.5px solid #D4C8F0;
  border-radius: 12px;
  padding: 20px 24px;
  background: #FAFAFF;
}

.sig-block h3 {
  font-size: 14px;
  font-weight: 800;
  color: #1A2B6E;
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 9px;
  border-bottom: 2px solid #7B5EA7;
}

.sig-line-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.sl-label {
  font-size: 12px;
  font-weight: 700;
  color: #7B5EA7;
  white-space: nowrap;
  min-width: 52px;
}

.sl-dots {
  flex: 1;
  border-bottom: 1px dashed #C4B8E8;
  height: 24px;
}

/* Print */
@media print {
  body { background: #ffffff; }
  .page { margin: 0; box-shadow: none; width: 210mm; }
}
</style>
</head><body>
<!-- ================================================================ -->
<!-- PAGE 1 — COVER / الغلاف                                         -->
<!-- ================================================================ -->
<section class="page cover-page" data-cid="0oeJWt">
<div class="cover-top" data-cid="P3zAc4">
<span class="cover-logo-text" data-cid="p7kvf6">ojoor</span>
<span class="cover-logo-sub" data-cid="Sy4O27">HR STATION  |  محطة الموارد البشرية</span>
</div>
<div class="cover-accent-strip editor-empty-block" data-cid="PGnPVo"></div>
<div class="cover-title-area" data-cid="1bN_RO">
<div class="cover-title-pill" data-cid="hYv3dK">عرض سعر</div>
</div>
<div class="cover-cards" data-cid="z8bU3E">
<div class="cover-card" data-cid="D9a87D">
<span class="cc-label" data-cid="5kROGe">مقدم إلى</span>
<span class="cc-value" data-cid="MzWWQN"><span class="ef-light" data-cid="2WqGGa">{{CUSTOMER_NAME}}</span></span>
</div>
<div class="cover-card" data-cid="cZ5IQ5">
<span class="cc-label" data-cid="q3BelF">التاريخ</span>
<span class="cc-value" data-cid="qJ3WHc"><span class="ef-light" data-cid="x2nAbT">{{CREATED_DATE}}</span></span></div>
</div>
<div class="cover-cityscape" data-cid="TC_3Si">
<img alt="مشهد مدينة سعودية حديثة" data-cid="O8b56g" src="{{COVER_IMAGE}}"/>
<div class="cityscape-fade-top editor-empty-block" data-cid="NbSZPF"></div>
<div class="cityscape-fade-bottom editor-empty-block" data-cid="BRfp68"></div>
<div class="cover-contact-bar" data-cid="-pu_sH">
<div class="ci" data-cid="rqFsiv">
<div class="ci-icon" data-cid="wx5mDZ"><span class="ci-icon-inner" data-cid="mORxmn">ت</span></div>
<div data-cid="620jbA">
<span class="ci-label" data-cid="ZrWkia">الجوال</span>
<span class="ci-value" data-cid="TXkIRY"><span class="ef-light" data-cid="_RbYhx">+966 56 443 2194</span></span>
</div>
</div>
<div class="ci" data-cid="ZPijYz">
<div class="ci-icon" data-cid="fei88c"><span class="ci-icon-inner" data-cid="0paTZi">و</span></div>
<div data-cid="Y-Hnpt">
<span class="ci-label" data-cid="gjTNwO">الموقع الإلكتروني</span>
<span class="ci-value" data-cid="BJ7KP3"><span class="ef-light" data-cid="Hbr6xj">www.ojoor.net</span></span>
</div>
</div>
<div class="ci" data-cid="SCRihf">
<div class="ci-icon" data-cid="rnTqIO"><span class="ci-icon-inner" data-cid="fbo4EN">ع</span></div>
<div data-cid="2NvHLX">
<span class="ci-label" data-cid="oUg7Hc">العنوان</span>
<span class="ci-addr" data-cid="ZpEzaW"><span class="ef-light" data-cid="26hxAJ" style="font-size:10.5px">مبنى 8758، حي العليا، مكتب 309، الرمز البريدي 12214</span></span>
</div>
</div>
</div>
</div>
</section>
<!-- ================================================================ -->
<!-- PAGE 2 — EXECUTIVE SUMMARY / الملخص التنفيذي                   -->
<!-- ================================================================ -->
<section class="page" data-cid="3_B4XG">
<header class="inner-header" data-cid="f-Q0ZO">
<div class="ih-logo" data-cid="MJz0Xs" style="">ojoor<small data-cid="yAlAng">HR STATION</small></div>
<span class="ih-title" data-cid="uZ_moC">الملخص التنفيذي</span>
</header>
<div class="inner-content" data-cid="6QTLp8">
<h1 class="sec-title" data-cid="4OwOD2">الملخص التنفيذي</h1>
<p data-cid="BqvgxH">
      يوضح هذا العرض كيف يمكن لمنصة أجور للموارد البشرية والرواتب أن تساعد المنشآت في المملكة العربية السعودية على تطوير عمليات الموارد البشرية والمالية من خلال نظام سحابي متكامل، مدعوم بالذكاء الاصطناعي، يربط بين إدارة الموظفين، الحضور، الرواتب، الإجازات، الأداء، النفقات، والتقارير في منصة واحدة، مع توضيح أن المستند عبارة عن عرض سعر مقدم لعميل محدد.
    </p>
<p data-cid="oXqHb7">تهدف منصة أجور إلى تمكين المنشآت من تحقيق الأهداف التالية:</p>
<div class="goals-box" data-cid="wvEWSS">
<ul data-cid="EOB30_">
<li data-cid="cBdYZ4">أتمتة عمليات الموارد البشرية والرواتب</li>
<li data-cid="M2PR9c">تقليل الأخطاء التشغيلية والمالية</li>
<li data-cid="RNacns">ضمان دقة الرواتب والامتثال للأنظمة</li>
<li data-cid="zszCrQ">تحسين تجربة الموظفين ورفع مستوى الشفافية</li>
<li data-cid="4icd50">تمكين الإدارة من اتخاذ قرارات أسرع مبنية على البيانات</li>
</ul>
</div>
<h2 class="sec-sub" data-cid="XRdMSh">نبذة عن أجور</h2>
<p data-cid="5-Xt0O">
      وُلدت أجور من حاجة حقيقية واجهتها كثير من المنشآت: أنظمة موارد بشرية ورواتب معقدة، غير مرنة، تزيد العبء اليومي بدلاً من أن تقلله. ومن هنا جاءت فكرة بناء منصة سعودية أكثر بساطة وذكاءً، تساعد الشركات على إدارة موظفيها ورواتبها وعملياتها اليومية من مكان واحد.
    </p>
<p data-cid="U1zq6X">
      تجمع أجور بين وحدات الموارد البشرية الأساسية: الرواتب، الحضور والانصراف، الإجازات، التوظيف، الأداء، التعلم، النفقات، تطبيق الجوال، الخدمة الذاتية للموظفين، والتكاملات مع الأنظمة والمنصات الحكومية. تمنح فرق الموارد البشرية والمالية تجربة عمل أكثر وضوحاً وسرعة.
    </p>
<p data-cid="OJAZ4z">
      القيمة الحقيقية لأجور لا تقتصر على أتمتة المهام، بل في تحويل الموارد البشرية من أعمال تشغيلية متكررة إلى منظومة أكثر كفاءة. تساعد المنشآت على تقليل الأخطاء، تحسين تجربة الموظف، دعم الامتثال، واتخاذ قرارات أفضل مع نمو الأعمال.
    </p>
</div>
<footer class="inner-footer" data-cid="uXKuFW">
<span data-cid="NU9Zt2">منصة أجور للموارد البشرية والرواتب — سري وخاص</span>
<span class="page-num">2 / 9</span>
<span data-cid="BG9VOc">ojoor.net</span></footer></section><section class="page" data-cid="l8NNdV"><header class="inner-header" data-cid="T6ROi_"><div class="ih-logo align-right" data-cid="jMPkPw" style="text-align: right;">            ojoor <small class="" data-cid="vkNKrx" style="">               HR STATION</small></div><div data-cid="vps8zc">
<span class="ih-title" data-cid="s1hj-C">منظومة التكاملات</span>
</div></header>
<div class="inner-content" data-cid="uIqncd" style="padding-bottom:90px;">
<h1 class="sec-title" data-cid="t6HFQ8">منظومة أجور والتكاملات</h1>
<p data-cid="XJmo1i">
      أجور ليست مجرد نظام للموارد البشرية والرواتب، بل منظومة متكاملة تربط الموارد البشرية، الرواتب، المالية، المنصات الحكومية، أنظمة المحاسبة، قنوات التوظيف، أجهزة الحضور، وخدمات الموظفين في منصة مركزية واحدة.
    </p>
<figure class="eco-img-wrap" data-cid="ljDHrt">
<img alt="مخطط منظومة أجور والتكاملات" data-cid="44BSfP" src="{{ECOSYSTEM_IMAGE}}"/>
<figcaption class="eco-caption" data-cid="tuwwRA">
        منصة واحدة تربط بيانات الموظفين والحضور والرواتب والنفقات والموافقات والأنظمة الخارجية لتقليل العمل اليدوي ورفع`;