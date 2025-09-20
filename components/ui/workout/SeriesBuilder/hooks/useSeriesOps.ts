import type { Exercise, Series } from "@/entities/program/zod";
import { useCallback } from "react";
import { useHaptics } from "../../../../../hooks/useHaptics";
import { rid } from "../utils/id";
import { removeById, replaceAtIndex, updateById } from "../utils/update";
import { useAutoSeriesLabel } from "./useAutoSeriesLabel";

type Args = { value: Series[]; onChange: (next: Series[]) => void };

export function useSeriesOps({ value, onChange }: Args) {
  const { light, select } = useHaptics();
  const { fromIndex } = useAutoSeriesLabel();

  const addSeries = useCallback(async () => {
    const nextSeries: Series = {
      id: rid(),
      label: fromIndex(value.length),
      items: [],
      trainerNote: "",
    };
    onChange([...value, nextSeries]);
    await light();
  }, [fromIndex, light, onChange, value]);

  const removeSeries = useCallback(
    async (seriesId: string) => {
      onChange(removeById(value, seriesId));
      await select();
    },
    [onChange, select, value]
  );

  const addExercise = useCallback(
    async (seriesIndex: number) => {
      const s = value[seriesIndex];
      const ex: Exercise = {
        id: rid(),
        title: "",
        imageUrl: "",
        sets: [],
        tempo: ["3", "0", "1", "0"],
        targetMuscles: [],
        trainerNote: "",
      };
      onChange(
        replaceAtIndex(value, seriesIndex, { ...s, items: [...s.items, ex] })
      );
      await light();
    },
    [light, onChange, value]
  );

  const patchExercise = useCallback(
    (seriesIndex: number, exId: string, patch: Partial<Exercise>) => {
      const s = value[seriesIndex];
      onChange(
        replaceAtIndex(value, seriesIndex, {
          ...s,
          items: updateById(s.items, exId, patch),
        })
      );
    },
    [onChange, value]
  );

  const removeExercise = useCallback(
    async (seriesIndex: number, exId: string) => {
      const s = value[seriesIndex];
      onChange(
        replaceAtIndex(value, seriesIndex, {
          ...s,
          items: s.items.filter((e) => e.id !== exId),
        })
      );
      await select();
    },
    [onChange, select, value]
  );

  return {
    addSeries,
    removeSeries,
    addExercise,
    patchExercise,
    removeExercise,
    fromIndex,
  };
}
