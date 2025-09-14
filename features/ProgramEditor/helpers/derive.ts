import { Series } from "@/entities/program/zod";

export function deriveCounts(series: Series[]) {
  const numberOfExercises = series.reduce((acc, s) => acc + s.items.length, 0);
  const numberOfSets = series.reduce(
    (acc, s) => acc + s.items.reduce((a, e) => a + e.reps.length, 0),
    0
  );
  return { numberOfExercises, numberOfSets };
}
