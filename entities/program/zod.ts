import { z } from "zod";

/** ----------- Helpers ----------- */
const id = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export const tempoTuple = z
  .tuple([
    z.string().regex(/^\d+$/),
    z.string().regex(/^\d+$/),
    z.string().regex(/^\d+$/),
    z.string().regex(/^\d+$/),
  ])
  .describe("Eccentric / Bottom Pause / Concentric / Top Pause");

export const repsArray = z
  .array(z.number().int().positive().max(99))
  .min(1, "At least one set")
  .max(50, "Too many sets");

export const goalEnum = z.enum([
  "cut",
  "bulk",
  "recomp",
  "strength",
  "endurance",
]);
export const dayTypeEnum = z.enum(["workout", "rest"]);

/** ----------- Exercise ----------- */
export const exerciseSchema = z.object({
  id: z.string().default(id()),
  title: z.string().min(1, "Exercise title is required"),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
  reps: repsArray, // e.g. [12,12,10,10]
  tempo: tempoTuple, // e.g. ["3","0","1","0"]
  restSec: z.number().int().nonnegative().max(600).default(60),
  trainerNote: z.string().optional().default(""),
  setup: z.string().optional().default(""),
  instructions: z.string().optional().default(""),
  target: z.string().optional().default(""), // primary target (e.g., "Lats")
});

/** ----------- Series (A, B, ...) with A1/A2 items ----------- */
export const seriesSchema = z.object({
  id: z.string().default(id()),
  label: z.string().min(1).max(2), // "A", "B"...
  items: z
    .array(exerciseSchema)
    .min(1, "Add at least one exercise to the series"),
});

/** ----------- Days ----------- */
export const restDaySchema = z.object({
  id: z.string().default(id()),
  type: z.literal(dayTypeEnum.enum.rest),
  title: z.string().default("Rest"),
  description: z.string().optional().default(""),
  trainerNote: z.string().optional().default(""),
});

export const workoutDaySchema = z
  .object({
    id: z.string().default(id()),
    type: z.literal(dayTypeEnum.enum.workout),
    title: z.string().min(1, "Day title is required"),
    description: z.string().optional().default(""),
    targetMuscleGroups: z.array(z.string()).default([]),
    equipmentNeeded: z.array(z.string()).default([]),
    trainerNote: z.string().optional().default(""),
    durationMin: z.number().int().positive().max(300).default(60),
    numberOfSets: z.number().int().positive().max(200).default(1),
    numberOfExercises: z.number().int().positive().max(200).default(1),
    series: z.array(seriesSchema).default([]),
  })
  .superRefine((val, ctx) => {
    const flatExercises = val.series.reduce(
      (acc, s) => acc + s.items.length,
      0
    );
    if (flatExercises !== val.numberOfExercises) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["numberOfExercises"],
        message: `Exercise count mismatch: expected ${val.numberOfExercises}, but series contain ${flatExercises}`,
      });
    }
    // compute total sets as sum of reps arrays lengths
    const totalSets = val.series.reduce(
      (acc, s) => acc + s.items.reduce((a, e) => a + e.reps.length, 0),
      0
    );
    if (totalSets !== val.numberOfSets) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["numberOfSets"],
        message: `Set count mismatch: expected ${val.numberOfSets}, but exercises define ${totalSets}`,
      });
    }
  });

export const daySchema = z.discriminatedUnion("type", [
  restDaySchema,
  workoutDaySchema,
]);

/** ----------- Phases ----------- */
export const phaseSchema = z
  .object({
    id: z.string().default(id()),
    title: z.string().min(1, "Phase title is required"),
    description: z.string().optional().default(""),
    lengthWeeks: z.number().int().positive().max(52).default(4),
    days: z.array(daySchema).min(1, "Phase needs at least 1 day"),
  })
  .superRefine((val, ctx) => {
    // Optional sanity: ensure days length is a multiple of 7 if you want weekly phases
    // if (val.days.length % 7 !== 0) {
    //   ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["days"], message: "Days should represent full weeks (multiple of 7)" });
    // }
  });

/** ----------- Program ----------- */
export const programSchema = z.object({
  id: z.string().default(id()),
  title: z.string().min(1, "Program title is required"),
  description: z.string().optional().default(""),
  goal: goalEnum,
  lengthWeeks: z.number().int().positive().max(104), // up to 2 years
  phases: z.array(phaseSchema).min(1, "Program needs at least 1 phase"),
  // metadata for exports/sharing
  version: z.string().default("1.0.0"),
  createdAt: z.number().default(() => Date.now()),
  updatedAt: z.number().default(() => Date.now()),
});

/** ----------- Inferred Types ----------- */
export type Exercise = z.infer<typeof exerciseSchema>;
export type Series = z.infer<typeof seriesSchema>;
export type WorkoutDay = z.infer<typeof workoutDaySchema>;
export type RestDay = z.infer<typeof restDaySchema>;
export type Day = z.infer<typeof daySchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type Program = z.infer<typeof programSchema>;

/** ----------- Blank factories (good UX defaults) ----------- */
export const blankExercise = (title = ""): Exercise => ({
  id: id(),
  title,
  imageUrl: "",
  reps: [12, 12, 10, 10],
  tempo: ["3", "0", "1", "0"],
  restSec: 60,
  trainerNote: "",
  setup: "",
  instructions: "",
  target: "",
});

export const blankSeries = (label = "A"): Series => ({
  id: id(),
  label,
  items: [blankExercise("")],
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
  numberOfSets: 4, // will be validated against series
  numberOfExercises: 1, // "
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
  days: [
    blankWorkoutDay("Day 1"),
    blankWorkoutDay("Day 2"),
    blankRestDay(),
    blankWorkoutDay("Day 4"),
    blankWorkoutDay("Day 5"),
    blankRestDay(),
    blankRestDay(),
  ],
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
