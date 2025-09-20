import type { SetType } from "@/entities/program/types";
import type { Exercise } from "@/entities/program/zod";
import { rid } from "./id";

/** Clone last set's defaults; fallback to sensible defaults */
export function cloneLastSetDefaults(ex: Exercise) {
  const last = (ex.sets ?? [])[Math.max(0, (ex.sets?.length ?? 1) - 1)];
  const type: SetType = (last?.type as SetType) ?? ("working" as SetType);
  const reps = typeof last?.reps === "number" ? last!.reps : 10;
  const rest = typeof last?.rest === "number" ? last!.rest : 60;

  return { id: rid(), type, reps, rest };
}
