// SeriesBuilder/index.tsx
import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";

import type { Series } from "@/entities/program/zod";
import { ExerciseCard } from "./components/ExerciseCard";
import { SeriesHeader } from "./components/SeriesHeader";
import { useSeriesOps } from "./hooks/useSeriesOps";

type Props = {
  value: Series[];
  onChange: (next: Series[]) => void;
  /** Day-level targets to present as toggle chips in exercises */
  selectedTargets: string[];
};

export function SeriesBuilder({ value, onChange, selectedTargets }: Props) {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const muted = useThemeColor({}, "muted");
  const primaryTint = useThemeColor({}, "primaryTint");
  const primarySoft = useThemeColor({}, "primarySoft");

  // Use modular series ops as-is (haptics included inside)
  const {
    addSeries,
    removeSeries,
    addExercise,
    patchExercise,
    removeExercise,
    fromIndex,
  } = useSeriesOps({ value, onChange });

  return (
    <View style={{ gap: 10 }}>
      {value.map((s, si) => (
        <View
          key={s.id}
          style={{
            borderWidth: 1,
            borderColor: primaryTint,
            borderRadius: 12,
            padding: 10,
            backgroundColor: surface,
            gap: 10,
          }}
        >
          {/* Header */}
          <SeriesHeader
            label={s.label ?? fromIndex(si)}
            onRemove={() => removeSeries(s.id)}
          />

          {/* Exercises */}
          <View style={{ gap: 8 }}>
            {s.items.length === 0 ? (
              <P style={{ color: muted, fontSize: 13 }}>No exercises.</P>
            ) : (
              s.items.map((ex, ei) => (
                <ExerciseCard
                  key={ex.id}
                  code={`${s.label ?? fromIndex(si)}${ei + 1}`}
                  value={ex}
                  onPatch={(patch) => patchExercise(si, ex.id, patch)}
                  onRemove={() => removeExercise(si, ex.id)}
                  dayTargets={selectedTargets}
                />
              ))
            )}
          </View>

          {/* Add exercise */}
          <Pressable
            onPress={() => addExercise(si)}
            style={{
              alignSelf: "flex-start",
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: outline,
              opacity: 0.9,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={14} color={muted} />
            <P style={{ color: muted, fontSize: 13 }}>Add exercise</P>
          </Pressable>
        </View>
      ))}

      {/* Add series */}
      <Pressable
        onPress={addSeries}
        style={{
          alignSelf: "flex-start",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: outline,
          backgroundColor: primarySoft,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Plus size={14} color="#fff" />
        <P style={{ color: "#fff", fontSize: 13 }}>Add series</P>
      </Pressable>
    </View>
  );
}
