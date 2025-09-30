import { useProgramStore } from "@/stores";
import * as React from "react";

export function useProgramSelection(initialProgramId?: string) {
  const programs = useProgramStore((s) => s.programs);

  const computedInitial = React.useMemo(
    () => initialProgramId || programs[0]?.id,
    [initialProgramId, programs]
  );

  const [selectedId, setSelectedId] = React.useState<string | undefined>(
    computedInitial
  );

  const currentProgram = React.useMemo(
    () => programs.find((p) => p.id === selectedId),
    [programs, selectedId]
  );

  return { programs, selectedId, setSelectedId, currentProgram };
}
