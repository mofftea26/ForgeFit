// ./appendix/instructions.ts
import { safe } from "../helpers";

export type Instruction = {
  title: string;
  steps?: string[]; // bullet steps
  note?: string; // optional note under steps
  html?: string; // OR prebuilt html (assumed safe/escaped upstream)
};

export function renderInstructionsAppendix(
  items: Instruction[],
  iconDataUrl: string,
  title = "Program Instructions"
): string {
  const cards = items
    .map((item) => {
      // Prefer explicit html if provided; otherwise render steps + note
      if (item.html) {
        return `
      <article class="appendix-card elevated card avoid-break">
        <h2>${safe(item.title)}</h2>
        ${item.html}
      </article>`;
      }

      const steps = item.steps?.length
        ? `<ol class="numbered">${item.steps
            .map((s) => `<li>${safe(s)}</li>`)
            .join("")}</ol>`
        : "";

      const note = item.note
        ? `<p class="small muted">${safe(item.note)}</p>`
        : "";

      return `
    <article class="appendix-card elevated card avoid-break">
      <h2>${safe(item.title)}</h2>
      ${steps}
      ${note}
    </article>`;
    })
    .join("");

  return `
<section class="appendix page">
  <header class="appendix-header">
    <h1 class="appendix-title">${safe(title)}</h1>
  </header>
  ${cards}
</section>
`;
}
