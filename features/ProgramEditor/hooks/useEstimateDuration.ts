import type { Series } from "@/entities/program/zod";
import * as React from "react";

type Options = {
  /** Extra seconds added per set for setup/transition (default: 8s) */
  perSetOverheadSec?: number;
  /** Round to nearest N minutes (default: 5) */
  roundToMinutes?: number;
};

function secondsPerRep(tempo: [string, string, string, string]) {
  // tempo strings -> ints (fallback to 0)
  const [ecc, bot, con, top] = tempo.map((t) => parseInt(t || "0", 10) || 0);
  return ecc + bot + con + top;
}

export function estimateDurationSeconds(series: Series[], opts?: Options) {
  const perSetOverheadSec = opts?.perSetOverheadSec ?? 8;
  let total = 0;

  for (const s of series) {
    for (const ex of s.items) {
      const spr = secondsPerRep(ex.tempo as any);
      for (const set of ex.sets ?? []) {
        total += spr * (set.reps || 0);
        total += set.rest || 0;
        total += perSetOverheadSec;
      }
    }
  }

  return Math.max(0, Math.round(total));
}

export function roundSecondsToMinutes(sec: number, stepMin = 5) {
  const mins = sec / 60;
  const rounded = Math.round(mins / stepMin) * stepMin;
  return Math.max(1, rounded); // at least 1 minute
}

export function useEstimatedDuration(series: Series[], opts?: Options) {
  const sec = React.useMemo(
    () => estimateDurationSeconds(series, opts),
    [series, opts?.perSetOverheadSec]
  );
  const minutes = React.useMemo(
    () => roundSecondsToMinutes(sec, opts?.roundToMinutes ?? 5),
    [sec, opts?.roundToMinutes]
  );
  return { seconds: sec, minutes };
}
