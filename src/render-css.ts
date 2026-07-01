export const ADDITIONAL_CSS = `
/* ===== DYNAMIC HUBSPOT PRICING ===== */
.ltr { direction:ltr; unicode-bidi:isolate; display:inline-block; }
.pricing-page .inner-content { padding-top:32px; padding-bottom:78px; }
.pricing-head { display:flex; align-items:flex-start; justify-content:space-between; gap:22px; margin-bottom:18px; }
.pricing-head .sec-title { margin-bottom:0; }
.quote-badge { min-width:190px; padding:10px 14px; border:1px solid #D4C8F0; border-radius:12px; background:#FAFAFF; text-align:center; }
.quote-badge span { display:block; color:#7B5EA7; font-size:10.5px; font-weight:700; }
.quote-badge strong { display:block; margin-top:2px; color:#1A2B6E; font-size:14px; direction:ltr; unicode-bidi:isolate; }
.pricing-meta-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:14px 0 18px; }
.pricing-meta-card { min-height:66px; padding:10px 12px; border:1px solid #E2DCF3; border-radius:10px; background:#F9F8FF; }
.pricing-meta-card b { display:block; color:#7B5EA7; font-size:10px; }
.pricing-meta-card span { display:block; margin-top:3px; color:#343448; font-size:11.5px; font-weight:700; overflow-wrap:anywhere; }
.pricing-table-frame { overflow:hidden; border:1px solid #D4C8F0; border-radius:12px; }
.pricing-table { width:100%; border-collapse:collapse; table-layout:fixed; font-size:11.5px; }
.pricing-table thead { background:#1A2B6E; color:#fff; }
.pricing-table th { padding:10px 7px; font-size:11px; font-weight:700; }
.pricing-table td { padding:10px 7px; border-bottom:1px solid #E8E2F5; color:#343448; text-align:center; vertical-align:middle; }
.pricing-table tbody tr:nth-child(even) td { background:#F7F6FF; }
.pricing-table tbody tr:last-child td { border-bottom:0; }
.pricing-table th:nth-child(1), .pricing-table td:nth-child(1) { width:5%; }
.pricing-table th:nth-child(2), .pricing-table td:nth-child(2) { width:34%; text-align:right; }
.pricing-table th:nth-child(3), .pricing-table td:nth-child(3) { width:9%; }
.pricing-table th:nth-child(4), .pricing-table td:nth-child(4) { width:17%; }
.pricing-table th:nth-child(5), .pricing-table td:nth-child(5) { width:16%; }
.pricing-table th:nth-child(6), .pricing-table td:nth-child(6) { width:19%; }
.item-name { display:block; color:#1A2B6E; font-size:12px; font-weight:800; }
.item-description { display:block; margin-top:2px; color:#77778F; font-size:9.5px; line-height:1.45; }
.item-tags { display:flex; flex-wrap:wrap; gap:4px; margin-top:5px; }
.item-tag { display:inline-block; padding:1px 7px; border-radius:10px; background:#EEE9F8; color:#7B5EA7; font-size:8.5px; font-weight:700; }
.pricing-bottom-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:18px; align-items:start; }
.pricing-note-card, .totals-card { overflow:hidden; border:1px solid #D4C8F0; border-radius:12px; background:#FAFAFF; }
.pricing-note-card { padding:16px 18px; }
.pricing-note-card h3 { margin:0 0 8px; color:#7B5EA7; font-size:15px; }
.pricing-note-card p { margin:4px 0; color:#343448; font-size:10.5px; line-height:1.7; text-align:right; }
.total-row { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:9px 14px; border-bottom:1px solid #E5DFF5; font-size:11px; }
.total-row:last-child { border-bottom:0; }
.total-row span:last-child { direction:ltr; unicode-bidi:isolate; font-weight:700; color:#1A2B6E; }
.total-row.grand { background:linear-gradient(135deg,#1A2B6E 0%,#7B5EA7 100%); color:#fff; font-size:12.5px; font-weight:800; }
.total-row.grand span:last-child { color:#fff; }
.pricing-continuation { margin-top:18px; padding:12px 16px; border-right:4px solid #7B5EA7; border-radius:0 8px 8px 0; background:#F7F6FF; color:#55556D; font-size:11px; }

/* ===== REFERENCE ACTIVATION PAGE FIT ===== */
.activation-reference-page .inner-content { padding-top:28px !important; padding-bottom:58px !important; }
.activation-reference-page .sec-title { margin-bottom:14px; }
.activation-reference-page .timeline-img-wrap { margin:8px 0 6px; }
.activation-reference-page .timeline-img-wrap img { max-height:305px; object-fit:contain; }
.activation-reference-page .sec-sub { margin:16px 0 8px; }
.activation-reference-page p { margin-bottom:8px; font-size:12px; line-height:1.7; }
.activation-reference-page .schedule-table { margin:10px 0; }
.activation-reference-page .schedule-table th { padding:8px 14px; }
.activation-reference-page .schedule-table td { padding:7px 14px; }
.activation-reference-page .note-box { margin:9px 0; padding:10px 16px; }

/* ===== SPLIT TERMS PAGES ===== */
.terms-page .inner-content { padding-top:30px; padding-bottom:70px; }
.terms-page .sec-title { margin-bottom:16px; }
.terms-page .parties-row { margin:12px 0 16px; }
.terms-page .party-card { padding:14px 16px; }
.terms-page .party-card h3 { margin-bottom:10px; padding-bottom:6px; }
.terms-page .pf { margin-bottom:6px; }
.terms-page .pf-value { min-height:18px; font-size:11.5px; }
.dynamic-field { border-bottom:1px dashed #9B8ED4; }
.terms-page .terms-sec { margin:14px 0 7px; padding:6px 12px; font-size:14px; }
.terms-page .terms-subsec { margin:9px 0 5px; font-size:12.5px; }
.terms-page .terms-list { margin-bottom:8px; }
.terms-page .terms-list li { margin-bottom:4px; font-size:10.7px; line-height:1.65; }
.terms-page .refund-copy { margin:0; padding:13px 16px; border-right:4px solid #7B5EA7; border-radius:0 8px 8px 0; background:#F7F6FF; color:#343448; font-size:11px; line-height:1.8; }
.terms-page .sigs-row { gap:18px; margin-top:18px; }
.terms-page .sig-block { padding:14px 18px; }
.terms-page .sig-block h3 { margin-bottom:12px; padding-bottom:6px; }
.terms-page .sig-line-row { margin-bottom:11px; }
.terms-page .sl-dots { height:18px; }
.signature-value { flex:1; min-height:18px; padding:0 4px 2px; border-bottom:1px dashed #C4B8E8; color:#343448; font-size:11px; overflow-wrap:anywhere; }

@media print {
  .pricing-table-frame, .pricing-bottom-grid, .pricing-note-card, .totals-card,
  .pricing-meta-grid, .pricing-meta-card, .terms-sec, .terms-list, .parties-row,
  .party-card, .sigs-row, .sig-block { break-inside:avoid; page-break-inside:avoid; }
}`;
