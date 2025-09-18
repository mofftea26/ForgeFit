import { RestDay, WorkoutDay } from "@/entities/program/zod";
import { StateCreator } from "zustand";
import { DaySlice, ProgramStore } from "./types";

export const createDaySlice: StateCreator<
  ProgramStore,
  [["zustand/persist", unknown]],
  [],
  DaySlice
> = (set, get) => ({
  addDay: (programId, phaseId, day) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              phases: p.phases.map((ph) =>
                ph.id === phaseId ? { ...ph, days: [...ph.days, day] } : ph
              ),
              updatedAt: Date.now(),
            }
      ),
    }),

  updateDay: (programId, dayId, patch) =>
    set({
      programs: get().programs.map((p) => {
        if (p.id !== programId) return p;

        const phases = p.phases.map((ph) => {
          const dayIdx = ph.days.findIndex((d) => d.id === dayId);
          if (dayIdx === -1) return ph;

          const nextDays = [...ph.days];
          const targetDay = nextDays[dayIdx];

          if (targetDay.type === "workout") {
            nextDays[dayIdx] = { ...targetDay, ...patch } as WorkoutDay;
          } else {
            nextDays[dayIdx] = { ...targetDay, ...patch } as RestDay;
          }

          return { ...ph, days: nextDays };
        });

        return { ...p, phases, updatedAt: Date.now() };
      }),
    }),

  removeDay: (programId, dayId) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              phases: p.phases.map((ph) => ({
                ...ph,
                days: ph.days.filter((d) => d.id !== dayId),
              })),
              updatedAt: Date.now(),
            }
      ),
    }),
});
