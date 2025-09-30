import type { PrintableProgram } from "../utils/selectors";
import { safe } from "./helpers";

export function renderRestDay(day: any) {
  return `
    <div class="surface card section rest-card">
      <div style="display:flex; align-items:center; gap:8px;">
        <input type="checkbox" />
        <strong>${safe(day.title)}</strong>${
    day.subtitle ? ` — <span class="muted">${safe(day.subtitle)}</span>` : ""
  }
      </div>
      ${
        day.notes
          ? `<div class="small muted" style="margin-top:6px">${safe(
              day.notes
            )}</div>`
          : ""
      }
      <div class="small muted" style="margin-top:8px">Rest Day</div>
    </div>
  `;
}

const formatTempo = (t?: [string, string, string, string]) =>
  t && t.length === 4 ? `${t[0]}-${t[1]}-${t[2]}-${t[3]}` : "";

export function renderWorkoutDay(day: any, iconDataUrl: string) {
  const blocks = day.series
    .map((s: any, sIdx: number) => {
      const exerciseBlocks = s.items
        .map((e: any, eIdx: number) => {
          const exLabel = `${s.code ?? "A"}${eIdx + 1}`;

          const targets = e.targetMuscles?.length
            ? `<div class="chips-right" style="margin:6px 0 0">
                   ${e.targetMuscles
                     .map((t: string) => `<span class="chip">${safe(t)}</span>`)
                     .join("")}
                 </div>`
            : "";

          const tempo = e.tempo
            ? `<div class="small muted" style="margin-top:6px">
                   <strong>Tempo:</strong> <span class="code">${formatTempo(
                     e.tempo
                   )}</span>
                 </div>`
            : "";

          const note = e.trainerNote
            ? `<div class="small muted right-note"><em>${safe(
                e.trainerNote
              )}</em></div>`
            : "";

          const rows = e.sets
            .map(
              (st: any, i: number) => `
                <tr>
                  <td class="small">${safe(st.index ?? i + 1)}</td>
                  <td><span class="type-pill">${safe(
                    st.type ?? "working"
                  )}</span></td>
                  <td>${safe(st.reps)}</td>
                  <td class="small">${safe(st.restSec ?? st.rest)}s</td>
                  <td><input class="cell-input" type="text" placeholder="kg" /></td>
                  <td><input class="cell-input" type="text" placeholder="reps" /></td>
                </tr>
              `
            )
            .join("");

          return `
            <div class="section avoid-break">
              <div class="ex-row">
                <div class="ex-left">
                  ${
                    e.imageUrl
                      ? `<img class="ex-thumb" src="${safe(
                          e.imageUrl
                        )}" alt="ex" />`
                      : `<div class="ex-thumb ex-thumb--placeholder"><img src="${iconDataUrl}" alt="p"/></div>`
                  }
                  <div class="ex-name-wrap">
                    <div class="ex-line">
                      <span class="ex-label">${exLabel}</span>
                      <strong class="ex-name">${safe(e.name)}</strong>
                    </div>
                    ${tempo}
                  </div>
                </div>
                <div class="ex-right">
                  ${targets}
                  ${note}
                </div>
              </div>

              <table class="table small ex-table">
                <thead>
                  <tr>
                    <th>#</th><th>Type</th><th>Reps</th><th>Rest</th>
                    <th>Weight</th><th>Reps completed</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          `;
        })
        .join("");

      const sNote = s.trainerNote
        ? `<div class="small muted" style="margin:6px 0 0"><em>${safe(
            s.trainerNote
          )}</em></div>`
        : "";

      return `
        <div class="elevated card section avoid-break">
          <div class="series-badge"><span class="k">${safe(
            s.code ?? "A"
          )}</span> Series</div>
          ${sNote}
          ${exerciseBlocks}
        </div>
      `;
    })
    .join("");

  // Day header with checkbox
  const headerLine = `
    <div style="display:flex; align-items:center; gap:8px;">
      <input type="checkbox" />
      <h3 style="margin:0;">
        ${safe(day.title)}${
    day.description
      ? ` — <span class="muted">${safe(day.description)}</span>`
      : ""
  }
      </h3>
    </div>
  `;

  // Meta line
  const metaParts: string[] = [];
  if (day.durationMin) metaParts.push(`${safe(day.durationMin)} min`);
  if (Array.isArray(day.targetMuscleGroups) && day.targetMuscleGroups.length)
    metaParts.push(`Groups: ${day.targetMuscleGroups.map(safe).join(", ")}`);
  if (Array.isArray(day.equipmentNeeded) && day.equipmentNeeded.length)
    metaParts.push(`Equip: ${day.equipmentNeeded.map(safe).join(", ")}`);

  const meta =
    metaParts.length > 0
      ? `<div class="small muted" style="margin:6px 0 6px">${metaParts.join(
          " • "
        )}</div>`
      : "";

  const dayNote = day.trainerNote
    ? `<div class="small muted" style="margin:6px 0 10px"><em>${safe(
        day.trainerNote
      )}</em></div>`
    : "";

  return `
    <div class="section">
      ${headerLine}
      ${meta}
      ${dayNote}
      ${blocks}
    </div>
  `;
}

export function renderPhase(
  ph: PrintableProgram["phases"][number],
  index: number,
  iconDataUrl: string
) {
  const dayBlocks = ph.days
    .map((d) =>
      d.type === "rest" ? renderRestDay(d) : renderWorkoutDay(d, iconDataUrl)
    )
    .join("");

  return `
    <section class="phase">
      <div class="phase-header">
        <h2 style="color:#053F5C">Phase ${index + 1}</h2>
        ${
          typeof ph.lengthWeeks === "number"
            ? `<span class="phase-weeks">Weeks: ${safe(ph.lengthWeeks)}</span>`
            : ""
        }
      </div>
      ${
        ph.description
          ? `<div class="small muted" style="margin:6px 0 6px">${safe(
              ph.description
            )}</div>`
          : ""
      }
      ${dayBlocks}
    </section>
  `;
}
