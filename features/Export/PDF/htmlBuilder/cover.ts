import { getProgramImageUrl } from "../utils/getProgramImageUrl";
import type { PrintableProgram } from "../utils/selectors";
import { fmtDate } from "./helpers";

export type CoverOptions = {
  clientName?: string;
  programImage?: string;
  dateMs?: number;
  details?: { label: string; value?: string | number | null | undefined }[];
};

export function renderCover(
  p: PrintableProgram,
  cover: CoverOptions,
  iconDataUrl: string
) {
  const dateShown = cover.dateMs ?? p.updatedAt ?? p.createdAt ?? Date.now();
  const programImage = getProgramImageUrl(p, cover.programImage, iconDataUrl);

  const details =
    cover.details && cover.details.length
      ? cover.details
      : buildDefaultDetails(p, cover.clientName);

  const detailsGrid = details
    .map(
      (d) => `
        <div class="kv">
          <div class="kv-label">${d.label}</div>
          <div class="kv-value">${d.value ?? "—"}</div>
        </div>
      `
    )
    .join("");

  const imageBlock = programImage
    ? `<img class="program-image" src="${programImage}" alt="Program image" />`
    : `<div class="program-image program-image--placeholder">No image</div>`;

  return `
    <section class="cover">
      <div class="cover-header">
        <div class="cover-title primary">${p.title || "Program"}</div>
        ${p.subtitle ? `<div class="cover-sub">${p.subtitle}</div>` : ""}
        <div class="cover-date">Date: ${fmtDate(dateShown)}</div>
        ${p.description ? `<div class="cover-desc">${p.description}</div>` : ""}
      </div>

      <div class="cover-media">
        ${imageBlock}
      </div>

      ${
        cover.clientName
          ? `<div class="cover-client primary">${cover.clientName}</div>`
          : ""
      }

      <div class="cover-details">
        ${detailsGrid}
      </div>

      ${
        p.notes
          ? `
        <div class="cover-notes surface card" style="max-width:760px;">
          <strong>Notes</strong>
          <div class="notes-text">${p.notes}</div>
        </div>
      `
          : ""
      }
    </section>
  `;
}

function buildDefaultDetails(p: PrintableProgram, clientName?: string) {
  let workoutDays = 0;
  let restDays = 0;
  for (const ph of p.phases) {
    for (const d of ph.days) {
      if (d.type === "workout") workoutDays++;
      else restDays++;
    }
  }
  const totalDays = workoutDays + restDays;

  return [
    p.goal ? { label: "Goal", value: p.goal } : undefined,
    typeof p.lengthWeeks === "number"
      ? { label: "Weeks", value: p.lengthWeeks }
      : undefined,
    { label: "Phases", value: p.phases.length },
    { label: "Workout Days", value: workoutDays },
    { label: "Rest Days", value: restDays },
    { label: "Total Days", value: totalDays },
  ].filter(Boolean) as { label: string; value?: any }[];
}
