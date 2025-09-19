import type { Exercise, Series } from "@/entities/program/zod";
import * as Haptics from "expo-haptics";
import { rid } from "../utils/id";

type Args = {
  value: Series[];
  onChange: (next: Series[]) => void;
};

export function useSeriesOps({ value, onChange }: Args) {
  const bump = (next: Series[]) => onChange(next);
  const autoSeriesLabel = (idx: number) =>
    String.fromCharCode("A".charCodeAt(0) + idx);

  async function addSeries() {
    const label = autoSeriesLabel(value.length);
    const nextSeries: Series = { id: rid(), label, items: [], trainerNote: "" };
    bump([...value, nextSeries]);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function removeSeries(seriesId: string) {
    bump(value.filter((s) => s.id !== seriesId));
    await Haptics.selectionAsync();
  }

  async function addExercise(seriesIndex: number) {
    const next = value.map((s, i) => {
      if (i !== seriesIndex) return s;
      const newExercise: Exercise = {
        id: rid(),
        title: "",
        imageUrl: "",
        sets: [],
        tempo: ["3", "0", "1", "0"],
        targetMuscles: [],
        trainerNote: "",
      };
      return { ...s, items: [...s.items, newExercise] };
    });
    bump(next);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function patchExercise(
    seriesIndex: number,
    exId: string,
    patch: Partial<Exercise>
  ) {
    const next = value.map((s, i) => {
      if (i !== seriesIndex) return s;
      return {
        ...s,
        items: s.items.map((e) => (e.id === exId ? { ...e, ...patch } : e)),
      };
    });
    bump(next);
  }

  async function removeExercise(seriesIndex: number, exId: string) {
    const next = value.map((s, i) =>
      i !== seriesIndex
        ? s
        : { ...s, items: s.items.filter((e) => e.id !== exId) }
    );
    bump(next);
    await Haptics.selectionAsync();
  }

  return {
    addSeries,
    removeSeries,
    addExercise,
    patchExercise,
    removeExercise,
    autoSeriesLabel,
  };
}
