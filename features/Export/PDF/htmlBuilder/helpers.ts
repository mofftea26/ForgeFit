import type { PrintableProgram } from "../utils/selectors";

export const fmtDate = (ts?: number) =>
  ts
    ? new Date(ts).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "";

export const safe = (v: unknown) =>
  v === null || v === undefined ? "" : String(v);

export function summarizeProgram(p: PrintableProgram) {
  let workoutDays = 0;
  let restDays = 0;
  for (const ph of p.phases) {
    for (const d of ph.days) {
      if (d.type === "workout") workoutDays++;
      else restDays++;
    }
  }
  const totalDays = workoutDays + restDays;
  return { workoutDays, restDays, totalDays, phases: p.phases.length };
}
