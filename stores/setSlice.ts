import { blankSet } from "@/entities/program/zod";
import { StateCreator } from "zustand";
import { ProgramStore, SetSlice } from "./types";

export const createSetSlice: StateCreator<
  ProgramStore,
  [["zustand/persist", unknown]],
  [],
  SetSlice
> = (set, get) => ({
  addSet: (
    programId,
    phaseId,
    dayId,
    seriesId,
    exerciseId,
    setObj = blankSet()
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
                              series: d.series.map((s) => ({
                                ...s,
                                items: s.items.map((e) =>
                                  e.id === exerciseId
                                    ? { ...e, sets: [...e.sets, setObj] }
                                    : e
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

  updateSet: (programId, phaseId, dayId, seriesId, exerciseId, setId, patch) =>
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
                                  e.id !== exerciseId
                                    ? e
                                    : {
                                        ...e,
                                        sets: e.sets.map((set) =>
                                          set.id === setId
                                            ? { ...set, ...patch }
                                            : set
                                        ),
                                      }
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

  removeSet: (programId, phaseId, dayId, seriesId, exerciseId, setId) =>
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
                                items: s.items.map((e) => ({
                                  ...e,
                                  sets: e.sets.filter(
                                    (set) => set.id !== setId
                                  ),
                                })),
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
