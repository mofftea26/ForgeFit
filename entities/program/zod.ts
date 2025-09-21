import { z } from "zod";

/** ----------- Helpers ----------- */
const id = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export const setTypeEnum = z.enum([
  "lightWarmup",
  "heavyWarmup",
  "working",
  "drop",
  "restPause",
  "cluster",
  "backOff",
  "density",
  "peak",
  "variableMuscleAction",
]);

export const tempoTuple = z
  .tuple([
    z.string().regex(/^\d+$/),
    z.string().regex(/^\d+$/),
    z.string().regex(/^\d+$/),
    z.string().regex(/^\d+$/),
  ])
  .describe("Eccentric / Bottom Pause / Concentric / Top Pause");

/** ----------- Set ----------- */
export const setSchema = z.object({
  id: z.string().default(id()),
  type: setTypeEnum,
  reps: z.number().int().positive().max(99),
  rest: z.number().int().nonnegative().max(600).default(60),
});

/** ----------- Exercise ----------- */
export const exerciseSchema = z.object({
  id: z.string().default(id()),
  title: z.string().min(1, "Exercise title is required"),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
  sets: z.array(setSchema).min(1, "At least one set"),
  tempo: tempoTuple, // e.g. ["3","0","1","0"]
  targetMuscles: z.array(z.string()).default([]),
  trainerNote: z.string().optional().default(""),
});

/** ----------- Series (A, B, ...) ----------- */
export const seriesSchema = z.object({
  id: z.string().default(id()),
  label: z.string().min(1).max(2), // "A", "B"
  items: z.array(exerciseSchema).min(1, "Add at least one exercise"),
  trainerNote: z.string().optional().default(""),
});

/** ----------- Days ----------- */
export const dayTypeEnum = z.enum(["workout", "rest"]);

export const restDaySchema = z.object({
  id: z.string().default(id()),
  type: z.literal(dayTypeEnum.enum.rest),
  title: z.string().default("Rest"),
  description: z.string().optional().default(""),
  trainerNote: z.string().optional().default(""),
});

export const workoutDaySchema = z.object({
  id: z.string().default(id()),
  type: z.literal(dayTypeEnum.enum.workout),
  title: z.string().min(1, "Day title is required"),
  description: z.string().optional().default(""),
  targetMuscleGroups: z.array(z.string()).default([]),
  equipmentNeeded: z.array(z.string()).default([]),
  trainerNote: z.string().optional().default(""),
  durationMin: z.number().int().positive().max(300).default(60),
  series: z.array(seriesSchema).default([]),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
});

export const daySchema = z.discriminatedUnion("type", [
  restDaySchema,
  workoutDaySchema,
]);

/** ----------- Phases ----------- */
export const phaseSchema = z.object({
  id: z.string().default(id()),
  title: z.string().min(1, "Phase title is required"),
  description: z.string().optional().default(""),
  lengthWeeks: z.number().int().positive().max(52).default(4),
  days: z.array(daySchema).min(1, "Phase needs at least 1 day"),
});

/** ----------- Program ----------- */
export const programSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().default(""),
  goal: z.enum(["cut", "bulk", "recomp", "strength", "endurance"]),
  lengthWeeks: z.number().int().min(1),
  phases: z.array(phaseSchema),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
  version: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

/** ----------- Inferred Types ----------- */
export type Set = z.infer<typeof setSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type Series = z.infer<typeof seriesSchema>;
export type WorkoutDay = z.infer<typeof workoutDaySchema>;
export type RestDay = z.infer<typeof restDaySchema>;
export type Day = z.infer<typeof daySchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type Program = z.infer<typeof programSchema>;

/** ----------- Blank factories (good UX defaults) ----------- */
export const blankSet = (
  type: z.infer<typeof setTypeEnum> = "working"
): Set => ({
  id: id(),
  type,
  reps: 10,
  rest: 60,
});

export const blankExercise = (title = ""): Exercise => ({
  id: id(),
  title,
  imageUrl: "",
  sets: [blankSet()],
  tempo: ["3", "0", "1", "0"],
  targetMuscles: [],
  trainerNote: "",
});

export const blankSeries = (label = "A"): Series => ({
  id: id(),
  label,
  items: [blankExercise("Exercise 1")],
  trainerNote: "",
});

export const blankWorkoutDay = (title = "Workout"): WorkoutDay => ({
  id: id(),
  type: "workout",
  title,
  description: "",
  targetMuscleGroups: [],
  equipmentNeeded: [],
  trainerNote: "",
  durationMin: 60,
  series: [blankSeries("A")],
});

export const blankRestDay = (): RestDay => ({
  id: id(),
  type: "rest",
  title: "Rest",
  description: "",
  trainerNote: "",
});

export const blankPhase = (title = "Phase 1"): Phase => ({
  id: id(),
  title,
  description: "",
  lengthWeeks: 4,
  days: [blankWorkoutDay("Day 1"), blankRestDay()],
});

export const blankProgram = (title = "New Program"): Program => ({
  id: id(),
  title,
  description: "",
  goal: "cut",
  lengthWeeks: 4,
  phases: [blankPhase()],
  version: "1.0.0",
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export type ProgramGoal = z.infer<typeof programSchema.shape.goal>;
