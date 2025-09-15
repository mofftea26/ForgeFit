import { MultiSelectField } from "@/components/ui/forms/MultiSelectField";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import { SeriesBuilder } from "@/components/ui/workout/SeriesBuilder";
import { WorkoutDay } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Pressable, View } from "react-native";
import { deriveCounts } from "../helpers/derive";

export const WorkoutDayEditor: React.FC<{
  value: WorkoutDay & { imageUrl?: string };
  onChange: (patch: Partial<WorkoutDay & { imageUrl?: string }>) => void;
}> = ({ value, onChange }) => {
  const outline = useThemeColor({}, "outline");
  const bg = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");

  async function pickDayImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      onChange({ imageUrl: res.assets[0].uri });
    }
  }

  return (
    <View style={{ gap: 12 }}>
      {/* Banner image full width */}
      <Pressable
        onPress={pickDayImage}
        style={{
          width: "100%",
          height: 180,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: outline,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {value.imageUrl ? (
          <Image
            source={{ uri: value.imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="image-outline" size={36} color={text} />
        )}
      </Pressable>

      {/* Title + duration */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField
            label="Day title"
            value={value.title}
            onChangeText={(t) => onChange({ title: t })}
            required
          />
        </View>
        <View style={{ width: 120 }}>
          <NumberInput
            label="Dur"
            value={value.durationMin}
            onChange={(n) => onChange({ durationMin: n })}
            min={5}
            max={300}
            step={5}
            unit="m"
          />
        </View>
      </View>

      <TextArea
        label="Description"
        value={value.description}
        onChangeText={(t) => onChange({ description: t })}
      />

      <MultiSelectField
        label="Target muscles"
        options={[
          { label: "Chest", value: "chest" },
          { label: "Back", value: "back" },
          { label: "Quads", value: "quads" },
          { label: "Hamstrings", value: "hams" },
          { label: "Shoulders", value: "shoulders" },
          { label: "Biceps", value: "biceps" },
          { label: "Triceps", value: "triceps" },
          { label: "Glutes", value: "glutes" },
          { label: "Calves", value: "calves" },
          { label: "Abs", value: "abs" },
        ]}
        value={value.targetMuscleGroups}
        onChange={(list) => onChange({ targetMuscleGroups: list as string[] })}
      />

      <MultiSelectField
        label="Equipment"
        options={[
          { label: "Barbell", value: "barbell" },
          { label: "Dumbbells", value: "dumbbells" },
          { label: "Cable", value: "cable" },
          { label: "Machine", value: "machine" },
          { label: "Bands", value: "bands" },
          { label: "Bodyweight", value: "bodyweight" },
          { label: "Kettlebell", value: "kettlebell" },
        ]}
        value={value.equipmentNeeded}
        onChange={(list) => onChange({ equipmentNeeded: list as string[] })}
      />

      {/* Series builder (with pill targets from above) */}
      <SeriesBuilder
        selectedTargets={value.targetMuscleGroups ?? []}
        value={value.series as any}
        onChange={(series) => {
          const derived = deriveCounts(series as any);
          onChange({ series: series as any, ...derived });
        }}
      />
    </View>
  );
};
