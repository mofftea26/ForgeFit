import { blankSeries, WorkoutDay } from "@/entities/program/zod";
import { StateCreator } from "zustand";
import { ProgramStore, SeriesSlice } from "./types";

export const createSeriesSlice: StateCreator<
  ProgramStore,
  [["zustand/persist", unknown]],
  [],
  SeriesSlice
> = (set, get) => ({
  addSeries: (programId, phaseId, dayId, series = blankSeries("A")) =>
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
                        d.id === dayId && d.type === "workout"
                          ? {
                              ...d,
                              series: [...(d as WorkoutDay).series, series],
                            }
                          : d
                      ),
                    }
              ),
              updatedAt: Date.now(),
            }
      ),
    }),

  updateSeries: (programId, phaseId, dayId, seriesId, patch) =>
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
                                s.id === seriesId ? { ...s, ...patch } : s
                              ),
                            }
                      ),
                    }
              ),
              updatedAt: Date.now(),
            }
      ),
    }),

  removeSeries: (programId, phaseId, dayId, seriesId) =>
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
                              series: d.series.filter((s) => s.id !== seriesId),
                            }
                      ),
                    }
              ),
              updatedAt: Date.now(),
            }
      ),
    }),
});
