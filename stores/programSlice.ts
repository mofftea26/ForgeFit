import { Program, blankProgram } from "@/entities/program/zod";
import { StateCreator } from "zustand";
import { ProgramSlice, ProgramStore } from "./types";

export const createProgramSlice: StateCreator<
  ProgramStore,
  [["zustand/persist", unknown]],
  [],
  ProgramSlice
> = (set, get) => ({
  programs: [],

  addProgram: (title = "New Program") => {
    const p: Program = blankProgram(title);
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
});
