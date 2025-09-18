import { blankExercise } from "@/entities/program/zod";
import { StateCreator } from "zustand";
import { ExerciseSlice, ProgramStore } from "./types";

export const createExerciseSlice: StateCreator<
  ProgramStore,
  [["zustand/persist", unknown]],
  [],
  ExerciseSlice
> = (set, get) => ({
  addExercise: (
    programId,
    phaseId,
    dayId,
    seriesId,
    exercise = blankExercise("New Exercise")
  ) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              phases: p.phases.map((ph) =>
                ph.id !== phaseId
                  ? ph
                  : {
                      ...ph,
                      days: ph.days.map((d) =>
                        d.id !== dayId || d.type !== "workout"
                          ? d
                          : {
                              ...d,
                              series: d.series.map((s) =>
                                s.id === seriesId
                                  ? { ...s, items: [...s.items, exercise] }
                                  : s
                              ),
                            }
                      ),
                    }
              ),
              updatedAt: Date.now(),
            }
      ),
    }),

  updateExercise: (programId, phaseId, dayId, seriesId, exerciseId, patch) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              phases: p.phases.map((ph) =>
                ph.id !== phaseId
                  ? ph
                  : {
                      ...ph,
                      days: ph.days.map((d) =>
                        d.id !== dayId || d.type !== "workout"
                          ? d
                          : {
                              ...d,
                              series: d.series.map((s) => ({
                                ...s,
                                items: s.items.map((e) =>
                                  e.id === exerciseId ? { ...e, ...patch } : e
                                ),
                              })),
                            }
                      ),
                    }
              ),
              updatedAt: Date.now(),
            }
      ),
    }),

  removeExercise: (programId, phaseId, dayId, seriesId, exerciseId) =>
    set({
      programs: get().programs.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              phases: p.phases.map((ph) =>
                ph.id !== phaseId
                  ? ph
                  : {
                      ...ph,
                      days: ph.days.map((d) =>
                        d.id !== dayId || d.type !== "workout"
                          ? d
                          : {
                              ...d,
                              series: d.series.map((s) => ({
                                ...s,
                                items: s.items.filter(
                                  (e) => e.id !== exerciseId
                                ),
                              })),
                            }
                      ),
                    }
              ),
              updatedAt: Date.now(),
            }
      ),
    }),
});
