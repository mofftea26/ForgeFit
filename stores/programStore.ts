// stores/programStore.ts
import type {
  Phase, // ensure these are exported from your zod/entities
  RestDay,
  WorkoutDay, // ensure these are exported from your zod/entities
} from "@/entities/program/zod";
import { Program, blankProgram } from "@/entities/program/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProgramStore = {
  programs: Program[];

  // existing
  addProgram: (title?: string) => Program;
  updateProgram: (id: string, patch: Partial<Program>) => void;
  removeProgram: (id: string) => void;
  replaceAll: (items: Program[]) => void;

  // NEW: day-level helpers
  updateDay: (
    programId: string,
    dayId: string,
    patch: Partial<WorkoutDay | RestDay>
  ) => void;

  addDay: (
    programId: string,
    phaseId: string,
    day: WorkoutDay | RestDay
  ) => void;
  removeDay: (programId: string, dayId: string) => void;
};

export const useProgramStore = create<ProgramStore>()(
  persist(
    (set, get) => ({
      programs: [],

      addProgram: (title = "New Program") => {
        const p = blankProgram(title);
        set({ programs: [p, ...get().programs] });
        return p;
      },

      updateProgram: (id, patch) =>
        set({
          programs: get().programs.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p
          ),
        }),

      removeProgram: (id) =>
        set({ programs: get().programs.filter((p) => p.id !== id) }),

      replaceAll: (items) => set({ programs: items }),

      // ---------- NEW HELPERS ----------
      updateDay: (programId, dayId, patch) =>
        set({
          programs: get().programs.map((p) => {
            if (p.id !== programId) return p;

            // find which phase contains this day
            const phases: Phase[] = p.phases.map((ph) => {
              const dayIdx = ph.days.findIndex((d) => d.id === dayId);
              if (dayIdx === -1) return ph;

              const nextDays = [...ph.days];
              nextDays[dayIdx] = {
                ...nextDays[dayIdx],
                ...patch,
              } as WorkoutDay | RestDay;

              return { ...ph, days: nextDays };
            });

            return { ...p, phases, updatedAt: Date.now() };
          }),
        }),

      addDay: (programId, phaseId, day) =>
        set({
          programs: get().programs.map((p) => {
            if (p.id !== programId) return p;
            const phases = p.phases.map((ph) =>
              ph.id === phaseId ? { ...ph, days: [...ph.days, day] } : ph
            );
            return { ...p, phases, updatedAt: Date.now() };
          }),
        }),

      removeDay: (programId, dayId) =>
        set({
          programs: get().programs.map((p) => {
            if (p.id !== programId) return p;
            const phases = p.phases.map((ph) => ({
              ...ph,
              days: ph.days.filter((d) => d.id !== dayId),
            }));
            return { ...p, phases, updatedAt: Date.now() };
          }),
        }),
    }),
    {
      name: "forgefit_programs_v1",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
