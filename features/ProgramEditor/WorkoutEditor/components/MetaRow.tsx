import { MultiSelectField } from "@/components/ui/forms/MultiSelectField";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import React from "react";
import { View } from "react-native";

export type Option = { label: string; value: string };

export const MetaRow: React.FC<{
  title: string;
  onTitleChange: (t: string) => void;
  description: string;
  onDescriptionChange: (t: string) => void;
  targetMuscles: string[];
  onTargetsChange: (vals: string[]) => void;
  equipment: string[];
  onEquipmentChange: (vals: string[]) => void;
  muscleOptions: Option[];
  equipmentOptions: Option[];
}> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  targetMuscles,
  onTargetsChange,
  equipment,
  onEquipmentChange,
  muscleOptions,
  equipmentOptions,
}) => {
  return (
    <View style={{ gap: 10 }}>
      {/* Title only (duration removed) */}
      <TextField
        label="Day title"
        value={title}
        onChangeText={onTitleChange}
        required
      />
      <TextArea
        label="Description"
        value={description}
        onChangeText={onDescriptionChange}
      />

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
