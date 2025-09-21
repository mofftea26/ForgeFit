import { NumberInput } from "@/components/ui/forms/NumberInput";
import { SelectField } from "@/components/ui/forms/SelectField";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import type { ProgramGoal } from "@/entities/program/zod";
import React from "react";
import { View } from "react-native";

const GOAL_OPTIONS = [
  { label: "Cut", value: "cut" },
  { label: "Bulk", value: "bulk" },
  { label: "Recomp", value: "recomp" },
  { label: "Strength", value: "strength" },
  { label: "Endurance", value: "endurance" },
] as const;

export function BasicForm({
  title,
  onTitle,
  goal,
  onGoal,
  weeks,
  onWeeks,
  description,
  onDescription,
}: {
  title: string;
  onTitle: (v: string) => void;
  goal: ProgramGoal;
  onGoal: (g: ProgramGoal) => void;
  weeks: number;
  onWeeks: (w: number) => void;
  description: string;
  onDescription: (d: string) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <TextField label="Title" value={title} onChangeText={onTitle} required />
      <SelectField
        label="Goal"
        options={GOAL_OPTIONS as any}
        value={goal}
        onChange={onGoal as any}
      />
      <NumberInput
        label="Length (weeks)"
        value={weeks}
        onChange={(v) => onWeeks(v ?? 0)}
      />
      <TextArea
        label="Description"
        value={description}
        onChangeText={onDescription}
        placeholder="What this program is about…"
        multiline
        style={{ minHeight: 140, textAlignVertical: "top" }}
      />
    </View>
  );
}
