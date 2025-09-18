export type SetType =
  | "lightWarmup"
  | "heavyWarmup"
  | "working"
  | "drop"
  | "restPause"
  | "cluster"
  | "backOff"
  | "density"
  | "peak"
  | "variableMuscleAction";

export interface Set {
  id: string;
  type: SetType;
  reps: number;
  rest: number; // in seconds
}
