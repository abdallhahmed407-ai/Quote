export const EXACT_TEMPLATE_01 = String.raw`<!DOCTYPE html>
<html dir="rtl" lang="ar"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>عرض سعر - منصة أجور</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&display=swap');

/* ===== RESET ===== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ===== BASE ===== */
body {
  font-family: 'Cairo', sans-serif;
  direction: rtl;
  background: #e8e8e8;
  color: #1a2b6e;
  font-size: 14px;
  line-height: 1.8;
}

/* ===== PAGE SETUP ===== */
@page { size: A4 portrait; margin: 0; }

.page {
  width: 794px;
  min-height: 1122px;
  margin: 0 auto 32px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 18px rgba(0,0,0,0.13);
}

/* Pagination — top-level, never inside @media */
.page { break-after: page; page-break-after: always; }
.page:last-child { break-after: auto; page-break-after: auto; }

/* ===== BRAND ===== */
/* Purple:  #7B5EA7  |  Navy:  #1A2B6E  |  Light-bg: #F7F6FF */

/* ===== EDITABLE FIELDS ===== */
.ef {
  display: inline-block;
  border-bottom: 2px dashed #9B8ED4;
  padding: 0 4px 1px;
  color: inherit;
  font-weight: inherit;
  min-width: 120px;
}
.ef-light {
  display: inline-block;
  border-bottom: 2px dashed rgba(200,190,240,0.8);
  padding: 0 4px 1px;
  color: #fff;
  font-weight: 600;
  min-width: 100px;
}

/* ============================================================ */
/* PAGE 1 — COVER                                              */
/* ============================================================ */
.cover-page {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #F7F6FF 0%, #EAE7FF 38%, #D8D2F0 58%, #b8b2d8 100%);
  height: 1122px;
}

/* Top: logo + accent */
.cover-top {
  padding: 44px 60px 20px;
  text-align: center;
}

.cover-logo-text {
  font-size: 46px;
  font-weight: 900;
  color: #1A2B6E;
  letter-spacing: -2px;
  font-family: 'Cairo', sans-serif;
  direction: ltr;
  display: block;
  line-height: 1;
}

.cover-logo-sub {
  font-size: 11px;
  font-weight: 600;
  color: #7B5EA7;
  letter-spacing: 4px;
  text-transform: uppercase;
  direction: ltr;
  display: block;
  margin-top: 4px;
}

.cover-accent-strip {
  height: 5px;
  background: linear-gradient(90deg, #1A2B6E 0%, #7B5EA7 55%, #B0A0E0 100%);
  margin: 22px 60px 0;
  border-radius: 3px;
}

/* Title box */
.cover-title-area {
  text-align: center;
  padding: 30px 60px 22px;
}

.cover-title-pill {
  display: inline-block;
  background: linear-gradient(135deg, #1A2B6E 0%, #7B5EA7 100%);
  color: #ffffff;
  font-size: 34px;
  font-weight: 900;
  padding: 16px 90px;
  border-radius: 60px;
  letter-spacing: 3px;
  box-shadow: 0 6px 28px rgba(123,94,167,0.35);
}

/* Info cards row */
.cover-cards {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding: 10px 60px 20px;
}

.cover-card {
  background: #1A2B6E;
  border-radius: 14px;
  padding: 18px 36px;
  text-align: center;
  min-width: 210px;
  box-shadow: 0 4px 18px rgba(26,43,110,0.22);
}

.cc-label {
  font-size: 11px;
  font-weight: 700;
  color: #9B8ED4;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 8px;
  text-transform: none;
}

.cc-value {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  display: block;
}

/* Cityscape section */
.cover-cityscape {
  flex: 1;
  position: relative;
}

.cover-cityscape img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  display: block;
}

.cityscape-fade-top {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 90px;
  background: linear-gradient(180deg, #c8c2e8 0%, transparent 100%);
  pointer-events: none;
}

.cityscape-fade-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(0deg, rgba(26,43,110,0.90) 0%, transparent 100%);
  pointer-events: none;
}

/* Contact bar */
.cover-contact-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(26, 43, 110, 0.93);
  padding: 14px 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
}

.ci {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ci-icon {
  width: 30px;
  height: 30px;
  background: #7B5EA7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ci-icon-inner {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  direction: ltr;
}

.ci-label {
  font-size: 10px;
  color: #9B8ED4;
  font-weight: 600;
  display: block;
}

.ci-value {
  font-size: 12px;
  color: #ffffff;
  font-weight: 700;
  display: block;
  direction: ltr;
  text-align: right;
}

.ci-addr {
  font-size: 11px;
  color: #ffffff;
  font-weight: 600;
  display: block;
  direction: rtl;
  text-align: right;
}

/* ============================================================ */
/* INNER PAGES — SHARED                                        */
/* ============================================================ */
.inner-header {
  background: linear-gradient(135deg, #1A2B6E 0%, #7B5EA7 100%);
  padding: 18px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ih-logo {
  font-size: 24px;
  font-weight: 900;
  color: #ffffff;
  direction: ltr;
  line-height: 1.1;
}

.ih-logo small {
  font-size: 9px;
  color: rgba(255,255,255,0.65);
  display: block;
  letter-spacing: 3px;
  font-weight: 600;
}

.ih-title {
  font-size: 15px;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
}

.inner-content {
  padding: 38px 50px 80px;
}

/* Section headings */
.sec-title {
  font-size: 22px;
  font-weight: 800;
  color: #1A2B6E;
  border-right: 5px solid #7B5EA7;
  padding-right: 14px;
  margin-bottom: 24px;
  line-height: 1.4;
}

.sec-sub {
  font-size: 17px;
  font-weight: 700;
  color: #7B5EA7;
  margin: 28px 0 12px;
}

/* Body text */
p {
  color: #343448;
  font-size: 13.5px;
  line-height: 1.95;
  margin-bottom: 14px;
  text-align: justify;
}

ul {
  padding-right: 22px;
  margin-bottom: 18px;
}

ul li {
  color: #343448;
  font-size: 13.5px;
  line-height: 1.9;
  margin-bottom: 6px;
}

ul li::marker { color: #7B5EA7; }

/* Goals highlight box */
.goals-box {
  background: #F7F6FF;
  border: 1px solid #D4C8F0;
  border-radius: 12px;
  padding: 22px 28px;
  margin: 18px 0;
}

.goals-box ul { margin: 0; padding-right: 20px; }

.goals-box li {
  border-bottom: 1px solid #E5DFF5;
  padding: 7px 0;
  font-weight: 600;
  color: #1A2B6E;
  font-size: 13.5px;
}

.goals-box li:last-child { border-bottom: none; }

/* Page footer */
.inner-footer {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 9px 50px;
  background: #F7F6FF;
  border-top: 1px solid #E5DFF5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #9999BB;
}

.page-num {
  font-size: 10px;
  color: #9999BB;
  font-weight: 600;
  direction: ltr;
  unicode-bidi: isolate;
}

/* ============================================================ */
/* PAGE 3 — ECOSYSTEM                                         */
/* ============================================================ */
.eco-img-wrap {
  text-align: center;
  margin: 18px 0 10px;
}

.eco-img-wrap img {
  width: 100%;
  max-width: 680px;
  border-radius: 12px;
  border: 1px solid #E5DFF5;
  box-shadow: 0 4px 22px rgba(123,94,167,0.10);
}

.eco-caption {
  text-align: center;
  font-size: 12px;
  color: #777799;
  font-style: italic;
  margin-top: 10px;
  line-height: 1.7;
}

/* ============================================================ */
/* PAGE 4 — EMPTY (HubSpot)                                  */
/* ============================================================ */
.empty-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 920px;
  text-align: center;
}

.empty-box {
  border: 2.5px dashed #C4B8E8;
  border-radius: 20px;
  padding: 70px 90px;
  background: #FAFAFF;
  max-width: 420px;
}

.empty-box-title {
  font-size: 19px;
  font-weight: 800;
  color: #7B5EA7;
  margin-bottom: 12px;
  display: block;
}

.empty-box-sub {
  font-size: 12.5px;
  color: #999;
  text-align: center;
  line-height: 1.75;
}

/* ============================================================ */
/* PAGE 5 — ACTIVATION                                        */
/* ============================================================ */
.timeline-img-wrap {
  margin: 14px 0 10px;
  text-align: center;
}

.timeline-img-wrap img {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #E5DFF5;
}

/* Schedule table */
.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin: 18px 0;
  font-size: 13px;
}

.schedule-table th {
  background: #1A2B6E;
  color: #ffffff;
  padding: 11px 16px;
  font-weight: 700;
  text-align: right;
  font-size: 13px;
}

.schedule-table th:first-child { border-radius: 0 6px 0 0; }
.schedule-table th:last-child  { border-radius: 6px 0 0 0; }
`;