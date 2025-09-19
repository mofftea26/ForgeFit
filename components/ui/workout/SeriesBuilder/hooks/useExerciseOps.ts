import type { SetType } from "@/entities/program/types";
import type { Exercise } from "@/entities/program/zod";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { rid } from "../utils/id";

export function useExerciseOps(
  ex: Exercise,
  onPatch: (p: Partial<Exercise>) => void
) {
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [titleHeight, setTitleHeight] = React.useState(52);

  const setTitleMeasuredHeight = (h: number) =>
    setTitleHeight(Math.max(44, Math.round(h)));

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      onPatch({ imageUrl: res.assets[0].uri });
      await Haptics.selectionAsync();
    }
  }

  async function addSet() {
    onPatch({
      sets: [
        ...(ex.sets ?? []),
        { id: rid(), type: "working" as SetType, reps: 10, rest: 60 },
      ],
    });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function removeSet(setId: string) {
    onPatch({ sets: (ex.sets ?? []).filter((s) => s.id !== setId) });
    await Haptics.selectionAsync();
  }

  async function patchSet(
    setId: string,
    patch: Partial<{ type: SetType; reps: number; rest: number }>
  ) {
    onPatch({
      sets: (ex.sets ?? []).map((s) =>
        s.id === setId ? { ...s, ...patch } : s
      ),
    });
    await Haptics.selectionAsync();
  }

  return {
    noteOpen,
    setNoteOpen,
    titleHeight,
    setTitleMeasuredHeight,
    pickImage,
    addSet,
    removeSet,
    patchSet,
  };
}
