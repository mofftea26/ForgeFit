import type {
  Program,
  RestDay,
  WorkoutDay,
  Exercise as ZExercise,
  Series as ZSeries,
  Set as ZSet,
} from "@/entities/program/zod";
import { useProgramStore } from "@/stores";

export function getProgramById(programId: string): Program | undefined {
  const { programs } = useProgramStore.getState();
  return programs.find((p: Program) => p.id === programId);
}

export type PrintableProgram = {
  id: string;
  title: string;
  subtitle?: string;
  notes?: string;
  description?: string;
  goal?: string;
  lengthWeeks?: number;
  createdAt?: number;
  updatedAt?: number;

  imageUrl?: string;
  image?: string;
  coverImage?: string;
  photo?: string;

  phases: {
    id: string;
    title: string;
    description?: string;
    lengthWeeks?: number;
    days: (
      | {
          type: "workout";
          id: string;
          title: string;
          description?: string;
          trainerNote?: string;
          durationMin?: number;
          targetMuscleGroups?: string[];
          equipmentNeeded?: string[];
          imageUrl?: string;
          series: {
            id: string;
            code?: string;
            trainerNote?: string;
            items: {
              id: string;
              name: string;
              imageUrl?: string;
              targetMuscles?: string[];
              tempo?: [string, string, string, string];
              trainerNote?: string;
              sets: {
                id: string;
                index: number;
                type: string;
                reps: number;
                restSec: number;
              }[];
            }[];
          }[];
        }
      | {
          type: "rest";
          id: string;
          title: string;
          description?: string;
          trainerNote?: string;
        }
    )[];
  }[];
};

const SET_TYPE_LABELS: Record<string, string> = {
  lightWarmup: "Light Warm-up",
  heavyWarmup: "Heavy Warm-up",
  working: "Working",
  drop: "Drop",
  restPause: "Rest-Pause",
  cluster: "Cluster",
  backOff: "Back-off",
  density: "Density",
  peak: "Peak",
  variableMuscleAction: "VMA",
};

export function toPrintableProgram(program: Program): PrintableProgram {
  const phases = program.phases.map((ph) => ({
    id: ph.id,
    title: ph.title,
    description: ph.description,
    lengthWeeks: ph.lengthWeeks,
    days: ph.days.map(
      (d): PrintableProgram["phases"][number]["days"][number] => {
        if (d.type === "workout") {
          const wd = d as WorkoutDay;
          return {
            type: "workout",
            id: wd.id,
            title: wd.title || "Workout Day",
            description: wd.description,
            trainerNote: wd.trainerNote,
            durationMin: wd.durationMin,
            targetMuscleGroups: wd.targetMuscleGroups,
            equipmentNeeded: wd.equipmentNeeded,
            imageUrl: wd.imageUrl,
            series: wd.series.map((s: ZSeries) => ({
              id: s.id,
              code: s.label,
              trainerNote: s.trainerNote,
              items: s.items.map((e: ZExercise) => ({
                id: e.id,
                name: e.title || "Exercise",
                imageUrl: e.imageUrl,
                targetMuscles: e.targetMuscles,
                tempo: e.tempo,
                trainerNote: e.trainerNote,
                sets: e.sets.map((set: ZSet, i: number) => ({
                  id: set.id,
                  index: i + 1,
                  type: SET_TYPE_LABELS[set.type] || set.type,
                  reps: set.reps,
                  restSec: set.rest,
                })),
              })),
            })),
          };
        }
        const rd = d as RestDay;
        return {
          type: "rest",
          id: rd.id,
          title: rd.title || "Rest Day",
          description: rd.description,
          trainerNote: rd.trainerNote,
        };
      }
    ),
  }));

  const anyp = program as any;
  const bestImage =
    anyp.imageUrl || anyp.image || anyp.coverImage || anyp.photo || undefined;

  return {
    id: program.id,
    title: program.title ?? "Program",
    subtitle: anyp.subtitle,
    notes: anyp.notes,
    description: program.description,
    goal: program.goal,
    lengthWeeks: program.lengthWeeks,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
    imageUrl: bestImage,
    image: anyp.image,
    coverImage: anyp.coverImage,
    photo: anyp.photo,
    phases,
  };
}
