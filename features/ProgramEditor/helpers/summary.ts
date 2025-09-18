import { Series, WorkoutDay } from "@/entities/program/zod";

/** Count total exercises in a series array */
export function countExercises(series: Series[]): number {
  return series.reduce((acc, s) => acc + s.items.length, 0);
}

/** Count total sets across all exercises in a series array */
export function countSets(series: Series[]): number {
  return series.reduce(
    (acc, s) => acc + s.items.reduce((a, ex) => a + ex.sets.length, 0),
    0
  );
}

/** Friendly label like: "5 exercises • 18 sets" */
export function summaryLabel(series: Series[]): string {
  const ex = countExercises(series);
  const sets = countSets(series);
  const exLabel = ex === 1 ? "exercise" : "exercises";
  const setLabel = sets === 1 ? "set" : "sets";
  return `${ex} ${exLabel} • ${sets} ${setLabel}`;
}

/** Day-level summary; safe for only workout days */
export function workoutDaySummary(day: WorkoutDay): string {
  return summaryLabel(day.series);
}
