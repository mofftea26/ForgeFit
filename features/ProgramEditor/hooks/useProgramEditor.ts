import {
  Day,
  Phase,
  RestDay,
  WorkoutDay,
  blankPhase,
  blankRestDay,
  blankWorkoutDay,
} from "@/entities/program/zod";
import { useProgramStore } from "@/stores";
import React from "react";

export function useProgramEditor(
  id: string | undefined,
  qPhase?: string,
  qDay?: string
) {
  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));
  const updateProgram = useProgramStore((s) => s.updateProgram);

  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [selectedDayId, setSelectedDayId] = React.useState<
    string | undefined
  >();

  React.useEffect(() => {
    if (!program) return;
    const pIdx = qPhase
      ? Math.max(0, Math.min(Number(qPhase) || 0, program.phases.length - 1))
      : 0;
    setPhaseIdx(pIdx);
    const fallbackDay = program.phases[pIdx]?.days[0]?.id;
    setSelectedDayId(qDay ?? fallbackDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.id]);

  React.useEffect(() => {
    if (program && program.phases.length > 0) {
      setPhaseIdx((i) => Math.min(i, program.phases.length - 1));
      if (!selectedDayId) setSelectedDayId(program.phases[0].days[0]?.id);
    }
  }, [program?.id]);

  const mutatePhase = (mutator: (p: Phase) => Phase) => {
    if (!program) return;
    const phases = program.phases.map((ph, i) =>
      i === phaseIdx ? mutator(ph) : ph
    );
    updateProgram(program.id, { phases });
  };

  const addWorkoutDay = () => {
    mutatePhase((ph) => ({
      ...ph,
      days: [...ph.days, blankWorkoutDay(`Day ${ph.days.length + 1}`)],
    }));
  };

  const addRestDay = () => {
    mutatePhase((ph) => ({ ...ph, days: [...ph.days, blankRestDay()] }));
  };

  const patchDay = (id: string, patch: Partial<WorkoutDay | RestDay>) => {
    mutatePhase((ph) => ({
      ...ph,
      days: ph.days.map((d) => (d.id === id ? ({ ...d, ...patch } as Day) : d)),
    }));
  };

  const addPhase = () => {
    if (!program) return;
    const nextIndex = program.phases.length;
    const newPhases = [...program.phases, blankPhase(`Phase ${nextIndex + 1}`)];
    updateProgram(program.id, { phases: newPhases });
    const firstDayId = newPhases[nextIndex].days[0]?.id;
    setPhaseIdx(nextIndex);
    setSelectedDayId(firstDayId);
  };

  const removeDay = (dayId: string) => {
    mutatePhase((ph) => ({
      ...ph,
      days: ph.days.filter((d) => d.id !== dayId),
    }));
    const newPhase = program!.phases[phaseIdx];
    const next = newPhase?.days[0]?.id;
    setSelectedDayId(next);
  };

  const phase = program?.phases[phaseIdx]!;
  const selectedDay =
    phase?.days.find((d) => d.id === selectedDayId) ?? phase?.days[0];

  return {
    program,
    phase,
    phaseIdx,
    setPhaseIdx,
    selectedDay,
    setSelectedDayId,
    addWorkoutDay,
    addRestDay,
    addPhase,
    removeDay,
    patchDay,
  };
}
