import { useProgramStore } from "@/stores";

// Keep UI free of store details. Export a function instead.
// (You can mock this in tests or swap implementations later.)
type SaveArgs = {
  title: string;
  goal: "cut" | "bulk" | "recomp" | "strength" | "endurance";
  lengthWeeks: number;
  description: string;
  imageUrl?: string;
};

export async function saveProgram(data: SaveArgs): Promise<string> {
  // Acquire store once (module scope) or inline here:
  const addProgram = useProgramStore.getState().addProgram;
  const updateProgram = useProgramStore.getState().updateProgram;

  const p = addProgram(data.title);
  updateProgram(p.id, {
    goal: data.goal,
    lengthWeeks: data.lengthWeeks,
    description: data.description,
    imageUrl: data.imageUrl,
  });
  return p.id;
}
