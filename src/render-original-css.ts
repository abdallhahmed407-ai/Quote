export const ORIGINAL_DYNAMIC_CSS = `
.ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}
.dynamic-field{border-bottom:1px dashed #9B8ED4}
.signature-value{flex:1;min-height:22px;padding:0 4px 2px;border-bottom:1px dashed #C4B8E8;color:#343448;font-size:12px;line-height:22px;overflow-wrap:anywhere}

/* Dynamic pricing page, using the same original brand system */
.pricing-page .inner-content{padding:34px 50px 82px}
.pricing-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:16px}
.pricing-head .sec-title{margin-bottom:0}
.quote-badge{min-width:180px;padding:9px 13px;border:1px solid #D4C8F0;border-radius:10px;background:#FAFAFF;text-align:center}
.quote-badge span{display:block;color:#7B5EA7;font-size:10px;font-weight:700}
.quote-badge strong{display:block;color:#1A2B6E;font-size:13px;direction:ltr;unicode-bidi:isolate}
.pricing-meta-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:12px 0 16px}
.pricing-meta-card{min-height:58px;padding:8px 10px;border:1px solid #E2DCF3;border-radius:9px;background:#F9F8FF}
.pricing-meta-card b{display:block;color:#7B5EA7;font-size:9.5px}
.pricing-meta-card span{display:block;margin-top:2px;color:#343448;font-size:10.5px;font-weight:700;overflow-wrap:anywhere}
.pricing-table-frame{overflow:hidden;border:1px solid #D4C8F0;border-radius:10px}
.pricing-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:10.5px}
.pricing-table thead{background:#1A2B6E;color:#fff}
.pricing-table th{padding:9px 6px;font-weight:700}
.pricing-table td{padding:9px 6px;border-bottom:1px solid #E8E2F5;color:#343448;text-align:center;vertical-align:middle}
.pricing-table tbody tr:nth-child(even) td{background:#F7F6FF}
.pricing-table tbody tr:last-child td{border-bottom:0}
.pricing-table th:nth-child(1),.pricing-table td:nth-child(1){width:5%}
.pricing-table th:nth-child(2),.pricing-table td:nth-child(2){width:35%;text-align:right}
.pricing-table th:nth-child(3),.pricing-table td:nth-child(3){width:9%}
.pricing-table th:nth-child(4),.pricing-table td:nth-child(4){width:17%}
.pricing-table th:nth-child(5),.pricing-table td:nth-child(5){width:15%}
.pricing-table th:nth-child(6),.pricing-table td:nth-child(6){width:19%}
.item-name{display:block;color:#1A2B6E;font-size:11.5px;font-weight:800}
.item-description{display:block;margin-top:2px;color:#77778F;font-size:8.8px;line-height:1.45}
.item-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.item-tag{display:inline-block;padding:1px 6px;border-radius:9px;background:#EEE9F8;color:#7B5EA7;font-size:8px;font-weight:700}
.pricing-bottom-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;align-items:start}
.pricing-note-card,.totals-card{overflow:hidden;border:1px solid #D4C8F0;border-radius:10px;background:#FAFAFF}
.pricing-note-card{padding:14px 16px}
.pricing-note-card h3{margin:0 0 7px;color:#7B5EA7;font-size:14px}
.pricing-note-card p{margin:3px 0;color:#343448;font-size:9.7px;line-height:1.65;text-align:right}
.total-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 12px;border-bottom:1px solid #E5DFF5;font-size:10.2px}
.total-row:last-child{border-bottom:0}
.total-row span:last-child{direction:ltr;unicode-bidi:isolate;font-weight:700;color:#1A2B6E}
.total-row.grand{background:linear-gradient(135deg,#1A2B6E 0%,#7B5EA7 100%);color:#fff;font-size:11.7px;font-weight:800}
.total-row.grand span:last-child{color:#fff}
.pricing-continuation{margin-top:15px;padding:10px 14px;border-right:4px solid #7B5EA7;border-radius:0 8px 8px 0;background:#F7F6FF;color:#55556D;font-size:10px}

/* Keep the original activation page intact while fitting all copy above the footer */
.activation-reference-page .inner-content{padding:26px 48px 66px!important}
.activation-reference-page .sec-title{margin-bottom:12px}
.activation-reference-page .timeline-img-wrap{margin:7px 0 8px}
.activation-reference-page .timeline-img-wrap img{display:block;width:100%;max-height:318px;object-fit:contain}
.activation-reference-page .sec-sub{margin:13px 0 7px;font-size:15.5px}
.activation-reference-page p{margin-bottom:7px;font-size:11.4px;line-height:1.65}
.activation-reference-page .schedule-table{margin:8px 0;font-size:11px}
.activation-reference-page .schedule-table th{padding:7px 12px;font-size:11px}
.activation-reference-page .schedule-table td{padding:6px 12px;font-size:10.8px}
.activation-reference-page .week-pill{padding:1px 11px;font-size:10px}
.activation-reference-page .note-box{margin:8px 0;padding:9px 14px;font-size:10.5px;line-height:1.6}
.activation-reference-page .inner-content>p:last-child{margin-bottom:0}

/* Four fixed, print-safe terms pages. Nothing can fall below the footer. */
.terms-page .inner-content{padding:30px 50px 72px}
.terms-page .sec-title{margin-bottom:15px}
.terms-page .parties-row{gap:16px;margin:10px 0 15px}
.terms-page .party-card{padding:13px 15px}
.terms-page .party-card h3{margin-bottom:9px;padding-bottom:6px;font-size:13px}
.terms-page .pf{margin-bottom:5px}
.terms-page .pf-label{font-size:9.7px}
.terms-page .pf-value{min-height:17px;padding-bottom:2px;font-size:10.5px;line-height:1.45;overflow-wrap:anywhere}
.terms-page .terms-sec{margin:13px 0 7px;padding:6px 12px;font-size:13.5px}
.terms-page .terms-subsec{margin:8px 0 5px;font-size:12px}
.terms-page .terms-list{margin:0 0 7px;padding-right:21px}
.terms-page .terms-list li{margin-bottom:4px;padding-right:2px;color:#343448;font-size:10.4px;line-height:1.58}
.terms-page .refund-copy{margin:0;padding:14px 17px;border-right:4px solid #7B5EA7;border-radius:0 8px 8px 0;background:#F7F6FF;color:#343448;font-size:11.5px;line-height:1.85;text-align:right}
.terms-page .sigs-row{gap:20px;margin-top:20px}
.terms-page .sig-block{padding:16px 20px}
.terms-page .sig-block h3{margin-bottom:15px;padding-bottom:7px;font-size:13.5px}
.terms-page .sig-line-row{margin-bottom:14px}
.terms-page .sl-label{font-size:11px}
.terms-page .sl-dots{height:21px}
.terms-page-signatures .terms-sec:nth-of-type(2){margin-top:22px}

@media print{
  .pricing-table-frame,.pricing-bottom-grid,.pricing-meta-grid,.parties-row,.party-card,.terms-sec,.terms-list,.sigs-row,.sig-block{break-inside:avoid;page-break-inside:avoid}
}
`;
