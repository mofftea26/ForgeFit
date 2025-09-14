import { NumberInput } from "@/components/ui/forms/NumberInput";
import { TagPicker } from "@/components/ui/forms/TagPicker";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import { SeriesBuilder } from "@/components/ui/workout/SeriesBuilder";
import { WorkoutDay } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View } from "react-native";
import { deriveCounts } from "../helpers/derive";

export const WorkoutDayEditor: React.FC<{
  value: WorkoutDay;
  onChange: (patch: Partial<WorkoutDay>) => void;
}> = ({ value, onChange }) => {
  const outline = useThemeColor({}, "outline");

  return (
    <View style={{ gap: 12 }}>
      <TextField
        label="Day title"
        value={value.title}
        onChangeText={(t) => onChange({ title: t })}
        required
      />
      <TextArea
        label="Description"
        value={value.description}
        onChangeText={(t) => onChange({ description: t })}
      />
      <TagPicker
        label="Target muscles"
        value={value.targetMuscleGroups}
        onChange={(list) => onChange({ targetMuscleGroups: list })}
      />
      <TagPicker
        label="Equipment"
        value={value.equipmentNeeded}
        onChange={(list) => onChange({ equipmentNeeded: list })}
      />

      <NumberInput
        label="Planned duration (min)"
        value={value.durationMin}
        onChange={(n) => onChange({ durationMin: n })}
        min={5}
        max={300}
        step={5}
        unit="min"
      />

      {/* Series builder; auto-derive counts */}
      <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />
      <SeriesBuilder
        value={value.series}
        onChange={(series) => {
          const derived = deriveCounts(series);
          onChange({ series, ...derived });
        }}
      />
      <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

      <NumberInput
        label="Number of exercises (derived)"
        value={value.numberOfExercises}
        onChange={(n) => onChange({ numberOfExercises: n })}
        min={0}
        step={1}
      />
      <NumberInput
        label="Number of sets (derived)"
        value={value.numberOfSets}
        onChange={(n) => onChange({ numberOfSets: n })}
        min={0}
        step={1}
      />
    </View>
  );
};
