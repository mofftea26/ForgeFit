import {
  Day,
  Exercise,
  Phase,
  Program,
  Series,
  Set,
} from "@/entities/program/zod";

export type ProgramSlice = {
  programs: Program[];
  addProgram: (title?: string) => Program;
  updateProgram: (id: string, patch: Partial<Program>) => void;
  removeProgram: (id: string) => void;
  replaceAll: (items: Program[]) => void;
};

export type PhaseSlice = {
  addPhase: (programId: string, phase: Phase) => void;
  updatePhase: (
    programId: string,
    phaseId: string,
    patch: Partial<Phase>
  ) => void;
  removePhase: (programId: string, phaseId: string) => void;
};

export type DaySlice = {
  addDay: (programId: string, phaseId: string, day: Day) => void;
  updateDay: (programId: string, dayId: string, patch: Partial<Day>) => void;
  removeDay: (programId: string, dayId: string) => void;
};

export type SeriesSlice = {
  addSeries: (
    programId: string,
    phaseId: string,
    dayId: string,
    series: Series
  ) => void;
  updateSeries: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string,
    patch: Partial<Series>
  ) => void;
  removeSeries: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string
  ) => void;
};

export type ExerciseSlice = {
  addExercise: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string,
    exercise: Exercise
  ) => void;
  updateExercise: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string,
    exerciseId: string,
    patch: Partial<Exercise>
  ) => void;
  removeExercise: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string,
    exerciseId: string
  ) => void;
};

export type SetSlice = {
  addSet: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string,
    exerciseId: string,
    set: Set
  ) => void;
  updateSet: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string,
    exerciseId: string,
    setId: string,
    patch: Partial<Set>
  ) => void;
  removeSet: (
    programId: string,
    phaseId: string,
    dayId: string,
    seriesId: string,
    exerciseId: string,
    setId: string
  ) => void;
};

export type ProgramStore = ProgramSlice &
  PhaseSlice &
  DaySlice &
  SeriesSlice &
  ExerciseSlice &
  SetSlice;
