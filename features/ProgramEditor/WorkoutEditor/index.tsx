import React from "react";
import { View } from "react-native";

import { TextArea } from "@/components/ui/forms/TextArea";
import { SeriesBuilder } from "@/components/ui/workout/SeriesBuilder";
import type { WorkoutDay } from "@/entities/program/zod";
import { summaryLabel } from "../helpers/summary";

import { BannerImage } from "./components/BannerImage";
import { MetaRow } from "./components/MetaRow";
import { ReadOnlySummary } from "./components/ReadOnlySummary";

import { equipmentOptions } from "./options/equipmentOptions";
import { muscleOptions } from "./options/muscleOptions";

export const WorkoutDayEditor: React.FC<{
  value: WorkoutDay & { imageUrl?: string };
  onChange: (patch: Partial<WorkoutDay & { imageUrl?: string }>) => void;
}> = ({ value, onChange }) => {
  const summary = summaryLabel(value.series);

  return (
    <View style={{ gap: 12 }}>
      <BannerImage
        uri={value.imageUrl}
        onPick={(uri: string) => onChange({ imageUrl: uri })}
      />

      <MetaRow
        title={value.title}
        durationMin={value.durationMin}
        onTitleChange={(t: string) => onChange({ title: t })}
        onDurationChange={(n: number) => onChange({ durationMin: n })}
        targetMuscles={value.targetMuscleGroups}
        onTargetsChange={(list: string[]) =>
          onChange({ targetMuscleGroups: list as string[] })
        }
        equipment={value.equipmentNeeded}
        onEquipmentChange={(list: string[]) =>
          onChange({ equipmentNeeded: list as string[] })
        }
        muscleOptions={muscleOptions}
        equipmentOptions={equipmentOptions}
      />

      <ReadOnlySummary text={summary} />

      <TextArea
        label="Description"
        value={value.description}
        onChangeText={(t) => onChange({ description: t })}
      />

      <SeriesBuilder
        selectedTargets={value.targetMuscleGroups ?? []}
        value={value.series as any}
        onChange={(series) => onChange({ series: series as any })}
      />
    </View>
  );
};

export default WorkoutDayEditor;
