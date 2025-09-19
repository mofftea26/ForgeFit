// features/ProgramEditor/WorkoutDayEditor/components/MetaRow.tsx
import React from "react";
import { View } from "react-native";

import { MultiSelectField } from "@/components/ui/forms/MultiSelectField";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { TextField } from "@/components/ui/forms/TextField";
import type { Option } from "../options/types";

export const MetaRow: React.FC<{
  title: string;
  durationMin: number;
  onTitleChange: (t: string) => void;
  onDurationChange: (n: number) => void;

  targetMuscles: string[];
  onTargetsChange: (vals: string[]) => void;
  equipment: string[];
  onEquipmentChange: (vals: string[]) => void;

  muscleOptions: Option[];
  equipmentOptions: Option[];
}> = ({
  title,
  durationMin,
  onTitleChange,
  onDurationChange,
  targetMuscles,
  onTargetsChange,
  equipment,
  onEquipmentChange,
  muscleOptions,
  equipmentOptions,
}) => {
  return (
    <View style={{ gap: 12 }}>
      {/* Title + duration */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField
            label="Day title"
            value={title}
            onChangeText={onTitleChange}
            required
          />
        </View>
        <View style={{ width: 120 }}>
          <NumberInput
            label="Dur"
            value={durationMin}
            onChange={onDurationChange}
            min={5}
            max={300}
            step={5}
            unit="m"
          />
        </View>
      </View>

      {/* Targets */}
      <MultiSelectField
        label="Target muscles"
        options={muscleOptions}
        value={targetMuscles}
        onChange={(list) => onTargetsChange(list as string[])}
      />

      {/* Equipment */}
      <MultiSelectField
        label="Equipment"
        options={equipmentOptions}
        value={equipment}
        onChange={(list) => onEquipmentChange(list as string[])}
      />
    </View>
  );
};
