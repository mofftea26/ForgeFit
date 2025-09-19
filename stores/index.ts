import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createDaySlice } from "./daySlice";
import { createExerciseSlice } from "./exerciseSlice";
import { createPhaseSlice } from "./phaseSlice";
import { createProgramSlice } from "./programSlice";
import { createSeriesSlice } from "./seriesSlice";
import { createSetSlice } from "./setSlice";
import { ProgramStore } from "./types";

export const useProgramStore = create<ProgramStore>()(
  persist(
    (...a) => ({
      ...createProgramSlice(...a),
      ...createPhaseSlice(...a),
      ...createDaySlice(...a),
      ...createSeriesSlice(...a),
      ...createExerciseSlice(...a),
      ...createSetSlice(...a),
    }),
    {
      name: "forgefit_programs_v1",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
