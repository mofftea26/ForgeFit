import type { PrintableProgram } from "../utils/selectors";
import { renderCover, type CoverOptions } from "./cover";
import { baseCss } from "./css";
import { safe } from "./helpers";
import { renderPhase } from "./phase";

export function buildProgramHtml(
  p: PrintableProgram,
  iconDataUrl: string,
  cover: CoverOptions
): string {
  const coverHtml = renderCover(p, cover, iconDataUrl);
  const phases = p.phases
    .map((ph, i) => renderPhase(ph, i, iconDataUrl))
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${safe(p.title)} — ForgeFit</title>
  <style>${baseCss()}</style>
</head>
<body>
  <!-- COVER (no logo) -->
  <main class="cover-page">
    ${coverHtml}
  </main>

  <!-- SUBSEQUENT PAGES -->
  <main class="pages">
    <!-- Logo fixed for all pages printed from this section -->
    <div class="page-logo"><img src="${iconDataUrl}" alt="logo"/></div>

    ${phases}
  </main>
</body>
</html>
`;
}

export type { CoverOptions };
