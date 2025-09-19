import type { Program } from "@/entities/program/zod";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";

/**
 * Ensures the current phase index is always clamped within program.phases length.
 */
export function useClampedPhaseIndex(
  program: Program | undefined,
  phaseIdx: number,
  setPhaseIdx: Dispatch<SetStateAction<number>>
) {
  useEffect(() => {
    if (!program) return;
    const maxIdx = Math.max(0, program.phases.length - 1);
    setPhaseIdx((i) => Math.min(i, maxIdx));
  }, [program?.phases.length, setPhaseIdx]);
}
