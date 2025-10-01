// buildProgramHtml.ts
import type { PrintableProgram } from "../utils/selectors";
import { renderGeneralInfoAppendix } from "./appendix/general";
import {
  renderInstructionsAppendix,
  type Instruction,
} from "./appendix/instructions";
import { renderCover, type CoverOptions } from "./cover";
import { baseCss } from "./css";
import { safe } from "./helpers";
import { renderPhase } from "./phase";

type ExtraOptions = {
  /** Show hardcoded general info appendix pages */
  showGeneralInfo?: boolean;
  /** Instructions to render (from your separate file.ts) */
  instructions?: Instruction[];
  /** Optional appendix title overrides */
  titles?: {
    generalInfo?: string;
    instructions?: string;
  };
};

export function buildProgramHtml(
  p: PrintableProgram,
  iconDataUrl: string,
  cover: CoverOptions,
  extra?: ExtraOptions
): string {
  const coverHtml = renderCover(p, cover, iconDataUrl);
  const phases = p.phases
    .map((ph, i) => renderPhase(ph, i, iconDataUrl))
    .join("");

  // --- Appendices (added AFTER phases) ---
  const appendices: string[] = [];

  if (extra?.showGeneralInfo) {
    appendices.push(
      renderGeneralInfoAppendix(iconDataUrl, extra?.titles?.generalInfo)
    );
  }

  if (extra?.instructions?.length) {
    appendices.push(
      renderInstructionsAppendix(
        extra.instructions,
        iconDataUrl,
        extra?.titles?.instructions
      )
    );
  }

  const appendixHtml = appendices.join("");

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

    ${appendixHtml}
  </main>
</body>
</html>
`;
}

export type { CoverOptions, Instruction };
