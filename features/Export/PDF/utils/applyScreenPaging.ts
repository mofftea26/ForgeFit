export function applyScreenPaging(html: string): string {
  const pagerCss = `
  <style id="screen-paged-css">
    @media screen {
      html, body { background: #0B1420; }
      .sheet-stack {
        display: grid;
        gap: 16px;
        padding: 16px 0 32px;
        justify-content: center;
      }
      .sheet {
        background: white;
        width: 210mm;
        height: 297mm;
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        border: 1px solid rgba(0,0,0,.06);
        overflow: hidden;
        position: relative;
      }
      .sheet-content {
        position: absolute;
        inset: 30mm 16mm 20mm;
        overflow: hidden;
      }
      .sheet--cover .sheet-content {
        inset: 18mm 16mm 20mm;
      }
      main.cover-page, main.pages { display: none !important; }
      .chips-right { justify-content: flex-end; }
    }
  </style>`;

  const pagerJs = `
<script id="screen-paged-js">
(() => {
  if (typeof window === 'undefined') return;

  const PX_PER_IN = 96;
  const A4_W = Math.round(8.27 * PX_PER_IN);
  const A4_H = Math.round(11.69 * PX_PER_IN);

  const PAGES_TOP = Math.round(30/25.4 * PX_PER_IN);
  const PAGES_BOT = Math.round(20/25.4 * PX_PER_IN);
  const PAGES_LEFT = Math.round(16/25.4 * PX_PER_IN);
  const PAGES_RIGHT = Math.round(16/25.4 * PX_PER_IN);
  const COVER_TOP = Math.round(18/25.4 * PX_PER_IN);

  const pageInnerHeight = A4_H - PAGES_TOP - PAGES_BOT;

  const cover = document.querySelector('main.cover-page');
  const pages = document.querySelector('main.pages');

  const stack = document.createElement('div');
  stack.className = 'sheet-stack';
  document.body.prepend(stack);

  const newSheet = (isCover=false) => {
    const sheet = document.createElement('div');
    sheet.className = 'sheet' + (isCover ? ' sheet--cover' : '');
    const inner = document.createElement('div');
    inner.className = 'sheet-content';
    sheet.appendChild(inner);
    stack.appendChild(sheet);
    return { sheet, inner };
  };

  const moveChildrenIntoPagedSheets = (container, { isCover=false } = {}) => {
    if (!container) return;
    const nodes = Array.from(container.childNodes).filter(n => n.nodeType === 1);
    if (nodes.length === 0) return;

    let { sheet, inner } = newSheet(isCover);
    const innerHeight = isCover ? A4_H - COVER_TOP - PAGES_BOT : pageInnerHeight;

    const fits = (el) => {
      inner.appendChild(el);
      const ok = inner.scrollHeight <= innerHeight;
      if (!ok) inner.removeChild(el);
      return ok;
    };

    for (const el of nodes) {
      if (!fits(el)) {
        ({ sheet, inner } = newSheet(isCover));
        // place even if it overflows (avoid losing content)
        inner.appendChild(el);
      }
    }
  };

  const paginate = () => {
    stack.innerHTML = '';
    moveChildrenIntoPagedSheets(cover, { isCover: true });
    moveChildrenIntoPagedSheets(pages, { isCover: false });

    const totalHeight = stack.getBoundingClientRect().height + 80;
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'height', height: Math.max(600, totalHeight) }));
  };

  const awaitImages = () => {
    const imgs = Array.from(document.images || []);
    if (imgs.length === 0) return Promise.resolve();
    const loaders = imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(res => {
        img.addEventListener('load', res, { once: true });
        img.addEventListener('error', res, { once: true }); // don't hang on errors
      });
    });
    return Promise.allSettled(loaders).then(() => void 0);
  };

  let rebuildTimer;
  const scheduleRebuild = (delay=100) => {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(() => {
      try { paginate(); } catch {}
    }, delay);
  };

  // First run: wait for images, then paginate
  awaitImages().then(paginate);

  // Rebuild if window resizes or any image loads after first pass
  window.addEventListener('resize', () => scheduleRebuild(150));
  (document.images || []).forEach(img => {
    img.addEventListener('load', () => scheduleRebuild(50));
  });

  // Safety: paginate again shortly
  setTimeout(paginate, 300);
})();
</script>`;

  return html.includes("</body>")
    ? html.replace("</body>", `${pagerCss}${pagerJs}</body>`)
    : `${html}${pagerCss}${pagerJs}`;
}
