import { Program, blankProgram } from "@/entities/program/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ProgramStore = {
  programs: Program[];
  addProgram: (title?: string) => Program; // returns the created program
  updateProgram: (id: string, patch: Partial<Program>) => void;
  removeProgram: (id: string) => void;
  replaceAll: (items: Program[]) => void;
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
    }),
    {
      name: "forgefit_programs_v1",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
