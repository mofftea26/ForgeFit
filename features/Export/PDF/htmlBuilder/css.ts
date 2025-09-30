import { Colors, Fonts } from "../../../../constants/theme";

const C = Colors.light;
const F =
  Fonts?.sans ||
  "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
const FMONO = Fonts?.mono || "SFMono-Regular, Menlo, Consolas, monospace";

export function baseCss() {
  return `
/* =========================================================
   0) PAGE & GLOBALS
   --------------------------------------------------------- */
@page { size: A4; margin: 18mm 16mm; } /* real per-page padding */

* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  background: ${C.background};
  color: ${C.text};
  font-family: ${F};
  font-size: 12px;
  line-height: 1.35;
  -webkit-font-smoothing: antialiased;
}
img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

/* =========================================================
   1) TYPOGRAPHY & UTILS
   --------------------------------------------------------- */
h1, h2, h3 { margin: 0; font-weight: 700; }
h1 { font-size: 22px; letter-spacing: .2px; }
h2 { font-size: 16px; }
h3 { font-size: 14px; }

.muted  { color: ${C.muted}; }
.small  { font-size: 11px; }
.primary{ color: ${Colors.light.primary}; }
.code   { font-family: ${FMONO}; }

/* =========================================================
   2) SURFACES & TABLES
   --------------------------------------------------------- */
.surface  { background: ${C.surface};         border: 1px solid ${C.outline}; border-radius: 10px; }
.elevated { background: ${C.surfaceElevated}; border: 1px solid ${C.outline}; border-radius: 10px; }
.card     { padding: 12px; }
.divider  { height: 2px; background: ${C.outline}; opacity: .6; margin: 12px 0; }

.table { width: 100%; border-collapse: collapse; page-break-inside: auto; break-inside: auto; }
.table th, .table td { border: 1px solid ${C.outline}; padding: 6px 8px; vertical-align: top; }
.table th { background: #F9FBFD; color: ${C.text}; text-align: left; font-weight: 600; }
.table tr { page-break-inside: avoid; break-inside: avoid; } /* keep rows intact */

/* =========================================================
   3) HIDDEN LEGACY ELEMENTS (not used anymore)
   --------------------------------------------------------- */
header.pdf-header,
footer.pdf-footer,
.watermark { display: none !important; }

/* =========================================================
   4) PAGE CONTAINERS
   --------------------------------------------------------- */
/* Cover is its own page; content pages flow normally (no extra padding here—
   @page handles margins on every page). */
main.cover-page { padding: 0; min-height: 100vh; page-break-after: always; }
main.pages      { padding: 0; }

/* Prevent unwanted gap before first phase */
main.pages > .phase:first-child {
  margin-top: 0 !important;
  page-break-before: auto !important;
}

/* =========================================================
   5) COVER LAYOUT
   --------------------------------------------------------- */
.cover {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  /* 297mm total - top(18) - bottom(18) = 261mm available; keep slack */
  max-height: calc(261mm - 10mm);
  display: flex; flex-direction: column; gap: 10px;
  overflow: hidden;
}
.cover-media {
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}
.cover-media .program-image {
  width: 100%; max-width: 680px;
  max-height: 110mm;        /* cap so cover never overflows */
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid ${C.outline};
  background: ${C.mediaBg};
  box-shadow: 0 8px 28px rgba(0,0,0,0.12);
}
.program-image--placeholder {
  display:flex; align-items:center; justify-content:center;
  color:#8B94A7; font-size:12px;
  width: 100%; max-width: 680px; height: 60mm;
  border-radius: 12px; border: 1px solid ${C.outline}; background: ${C.mediaBg};
}
.cover-title  { font-size: 40px; font-weight: 900; letter-spacing: .3px; margin-top: 6px; }
.cover-sub    { font-size: 14px; color: ${C.muted}; margin-top: 6px; }
.cover-date   { margin-top: 8px; color: ${C.muted}; font-size: 12px; }
.cover-client { margin: 14px 0 10px; font-size: 28px; font-weight: 800; color: ${Colors.light.primary}; }
.cover-details {
  margin-top: 12px;
  display: grid; grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 8px 12px; text-align: left;
  background: linear-gradient(180deg, ${C.surfaceElevated} 0%, ${C.surface} 100%);
  border: 1px solid ${C.outline}; border-radius: 14px; padding: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
}
.kv       { display: grid; gap: 4px; padding: 8px; background: ${C.surface}; border: 1px solid ${C.outline}; border-radius: 12px; }
.kv-label { width: fit-content; font-size: 11px; background: ${Colors.light.primarySoft}; color: ${Colors.light.onTint}; padding: 2px 8px; border-radius: 999px; }
.kv-value { color: ${C.text}; font-weight: 700; font-size: 13px; }
.notes-text { margin-top: 6px; font-size: 12px; color: ${C.text}; }

/* =========================================================
   6) PAGE LOGO (ALL NON-COVER PAGES)
   --------------------------------------------------------- */
.page-logo {
  position: fixed;    /* repeats on every printed page in main.pages */
  right: 2mm;
  bottom: 2mm;
  width: 12mm;
  height: 12mm;
  z-index: 10;
  pointer-events: none;
  opacity: .95;
  border-radius: 3mm;
}
.page-logo img {
  width: 100%; height: 100%; object-fit: contain;
  border-radius: 2mm;
  border: 1px solid ${Colors.light.outline};
  background: ${Colors.light.surface};
}

/* =========================================================
   7) PHASE LAYOUT
   --------------------------------------------------------- */
.phase { margin-top: 8px; }
.phase + .phase {
  /* no forced page break between phases; just a neat gap */
  page-break-before: auto !important;
  break-before: auto !important;
  margin-top: 14px;
}
.phase-header {
  display:flex; align-items:baseline; justify-content:space-between;
  gap:12px; margin-bottom: 6px;
}
.phase-weeks { font-size: 13px; font-weight: 600; color: ${C.muted}; }

/* =========================================================
   8) SECTIONS & PAGINATION BEHAVIOR
   --------------------------------------------------------- */
/* Default: allow splitting so we don't leave giant blank tails. */
.section, .elevated, .surface.card {
  page-break-inside: auto; break-inside: auto;
  margin: 8px 0 10px; /* compact spacing */
}
/* Use .avoid-break on any element you want kept together. */
.avoid-break { page-break-inside: avoid; break-inside: avoid; }

/* Rest card: slightly tighter so it doesn't orphan easily. */
.rest-card.section { margin: 6px 0 8px; }
.rest-card.section .card { padding: 10px 12px; }

/* =========================================================
   9) SERIES BADGE
   --------------------------------------------------------- */
.series-badge {
  display:inline-flex; align-items:center; gap:6px;
  background: #E9F4FB; border: 1px solid ${C.outline}; color: ${C.text};
  padding: 4px 10px; border-radius: 999px; font-weight: 600;
}
.series-badge .k {
  background:${Colors.light.primarySoft}; color:${Colors.light.onTint};
  border-radius:6px; padding: 1px 6px; font-size: 10px;
}

/* =========================================================
   10) EXERCISE ROW LAYOUT
   --------------------------------------------------------- */
.ex-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.ex-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 50%;
}
.ex-thumb {
  width: 50px; height: 50px; border-radius: 8px;
  object-fit: cover; border: 1px solid ${C.outline};
  background: ${C.mediaBg};
  flex: 0 0 50px;
}
.ex-thumb--placeholder {
  display:flex; align-items:center; justify-content:center;
  color:${C.muted}; font-size: 12px;
}
.ex-name-wrap { display:flex; flex-direction:column; gap: 4px; }
.ex-line      { display:flex; align-items:center; gap:8px; }
.ex-label {
  display:inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${C.outline};
  background: ${Colors.light.primarySoft};
  color: ${Colors.light.onTint};
  font-weight: 700;
  font-size: 11px;
}
.ex-name { font-size: 13px; }

/* Right column: target chips aligned right, note under */
.ex-right     { text-align: right; min-width: 35%; }
.chips-right  { display:flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
.chip {
  display:inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${C.surfaceElevated};
  border: 1px solid ${C.outline};
  font-size: 11px;
}
.right-note { margin-top: 6px; }

/* =========================================================
   11) FORM INPUTS (PDF-FILLABLE)
   --------------------------------------------------------- */
input[type="checkbox"] {
  width: 14px; height: 14px; vertical-align: middle;
  accent-color: ${Colors.light.primary};
  transform: translateY(1px);
}
.cell-input {
  width: 64px; height: 22px; font-size: 11px; padding: 2px 6px;
  border: 1px solid ${C.outline}; border-radius: 6px;
  background: #fff; color: #000;
}
.cell-input:focus { outline: none; border-color: ${Colors.light.primary}; }

/* Table spacing from exercise header row */
.ex-table { margin-top: 8px; }
`;
}
