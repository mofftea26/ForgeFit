import { SeriesBuilder } from "@/components/ui/workout/SeriesBuilder";
import type { WorkoutDay } from "@/entities/program/zod";
import React from "react";
import { View } from "react-native";
import { useEstimatedDuration } from "../hooks/useEstimateDuration";
import { MetaRow } from "./components/MetaRow";
import { equipmentOptions } from "./options/equipmentOptions";
import { muscleOptions } from "./options/muscleOptions";
export const WorkoutDayEditor: React.FC<{
  value: WorkoutDay & { imageUrl?: string };
  onChange: (patch: Partial<WorkoutDay & { imageUrl?: string }>) => void;
}> = ({ value, onChange }) => {
  // Compute and sync estimated duration (keeps cards/other UI consistent)
  const { minutes: estimatedMinutes } = useEstimatedDuration(
    value.series as any,
    { perSetOverheadSec: 8, roundToMinutes: 5 }
  );

  React.useEffect(() => {
    if (value.durationMin !== estimatedMinutes) {
      onChange({ durationMin: estimatedMinutes });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimatedMinutes]);

  return (
    <View style={{ gap: 12 }}>
      <MetaRow
        title={value.title}
        onTitleChange={(t: string) => onChange({ title: t })}
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
        description={value.description}
        onDescriptionChange={(t: string) => onChange({ description: t })}
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
