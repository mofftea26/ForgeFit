import type { Series } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, View } from "react-native";

export const SeriesCard: React.FC<{ series: Series }> = ({ series }) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 12,
        backgroundColor: surface,
        padding: 12,
        gap: 6,
      }}
    >
      <Text style={{ color: text, fontWeight: "700" }}>
        Series {series.label}
      </Text>

      {series.items.length === 0 ? (
        <Text style={{ color: muted }}>No exercises.</Text>
      ) : (
        series.items.map((ex) => {
          const sets = ex.sets ?? [];
          const repsList =
            sets.length > 0 ? sets.map((s) => s.reps).join(" / ") : "—";
          const tempo = ex.tempo.join("/");

          return (
            <View
              key={ex.id}
              style={{
                borderWidth: 1,
                borderColor: outline,
                borderRadius: 8,
                padding: 8,
              }}
            >
              <Text style={{ color: text }}>
                {ex.title || "Untitled"}{" "}
                <Text style={{ color: muted }}>
                  ({repsList} reps, tempo {tempo})
                </Text>
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
};
