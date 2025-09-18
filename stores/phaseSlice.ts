import { blankPhase } from "@/entities/program/zod";
import { StateCreator } from "zustand";
import { PhaseSlice, ProgramStore } from "./types";

export const createPhaseSlice: StateCreator<
  ProgramStore,
  [["zustand/persist", unknown]],
  [],
  PhaseSlice
> = (set, get) => ({
  addPhase: (programId, phase = blankPhase()) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : { ...p, phases: [...p.phases, phase], updatedAt: Date.now() }
      ),
    }),

  updatePhase: (programId, phaseId, patch) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              phases: p.phases.map((ph) =>
                ph.id === phaseId ? { ...ph, ...patch } : ph
              ),
              updatedAt: Date.now(),
            }
      ),
    }),

  removePhase: (programId, phaseId) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              phases: p.phases.filter((ph) => ph.id !== phaseId),
              updatedAt: Date.now(),
            }
      ),
    }),
});
