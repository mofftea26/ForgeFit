import type { SetType } from "@/entities/program/types";
import type { Exercise } from "@/entities/program/zod";
import { useCallback, useMemo, useState } from "react";
import { useHaptics } from "../../../../../hooks/useHaptics";
import { cloneLastSetDefaults } from "../utils/sets";
import { useImagePicker } from "./useImagePicker";

export function useExerciseOps(
  ex: Exercise,
  onPatch: (p: Partial<Exercise>) => void
) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [titleHeight, setTitleHeight] = useState(52);
  const { light, select } = useHaptics();
  const { pickImage: pickImageRaw } = useImagePicker();

  const setTitleMeasuredHeight = useCallback(
    (h: number) => setTitleHeight(Math.max(44, Math.round(h))),
    []
  );

  const pickImage = useCallback(async () => {
    const uri = await pickImageRaw();
    if (!uri) return;
    onPatch({ imageUrl: uri });
    await select();
  }, [onPatch, pickImageRaw, select]);

  const addSet = useCallback(async () => {
    const next = cloneLastSetDefaults(ex);
    onPatch({ sets: [...(ex.sets ?? []), next] });
    await light();
  }, [ex, onPatch, light]);

  const removeSet = useCallback(
    async (setId: string) => {
      onPatch({ sets: (ex.sets ?? []).filter((s) => s.id !== setId) });
      await select();
    },
    [ex.sets, onPatch, select]
  );

  const patchSet = useCallback(
    async (
      setId: string,
      patch: Partial<{ type: SetType; reps: number; rest: number }>
    ) => {
      onPatch({
        sets: (ex.sets ?? []).map((s) =>
          s.id === setId ? { ...s, ...patch } : s
        ),
      });
      await select();
    },
    [ex.sets, onPatch, select]
  );

  const imageSide = useMemo(
    () => Math.max(44, Math.round(titleHeight * 0.65)),
    [titleHeight]
  );

  return {
    noteOpen,
    setNoteOpen,
    titleHeight,
    setTitleMeasuredHeight,
    imageSide,
    pickImage,
    addSet,
    removeSet,
    patchSet,
  };
}
