import { Phase, WorkoutDay } from "@/entities/program/zod";
import { workoutDaySummary } from "@/features/ProgramEditor/helpers/summary";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, View } from "react-native";

export const PhaseExerciseList: React.FC<{ phase: Phase }> = ({ phase }) => {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");

  const workouts = phase.days.filter(
    (d): d is WorkoutDay => d.type === "workout"
  );

  if (workouts.length === 0) {
    return (
      <Text style={{ color: muted, fontFamily: "WorkSans_400Regular" }}>
        No workout days in this phase yet.
      </Text>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      {workouts.map((d) => (
        <View
          key={d.id}
          style={{
            backgroundColor: surface,
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 12,
            padding: 12,
            gap: 6,
          }}
        >
          <Text
            style={{ color: text, fontFamily: "Syne_700Bold", fontSize: 16 }}
          >
            {d.title}{" "}
            <Text style={{ color: muted, fontFamily: "WorkSans_400Regular" }}>
              • {d.durationMin} min
            </Text>
          </Text>

          {/* 🔹 NEW: read-only day summary */}
          <Text style={{ color: muted, fontFamily: "WorkSans_400Regular" }}>
            {workoutDaySummary(d)}
          </Text>

          {d.series.length === 0 ? (
            <Text style={{ color: muted }}>No exercises yet.</Text>
          ) : (
            <View style={{ gap: 6 }}>
              {d.series.map((s) => (
                <View key={s.id} style={{ gap: 4 }}>
                  <Text
                    style={{
                      color: primary,
                      fontFamily: "WorkSans_600SemiBold",
                    }}
                  >
                    Series {s.label}
                  </Text>

                  {s.items.map((ex, ei) => {
                    const repsDisplay =
                      ex.sets.length > 0
                        ? ex.sets.map((st) => st.reps).join(" / ")
                        : "—";
                    const tempoDisplay = ex.tempo.join("/");

                    return (
                      <Text
                        key={ex.id}
                        style={{
                          color: text,
                          fontFamily: "WorkSans_400Regular",
                        }}
                        numberOfLines={1}
                      >
                        {`${s.label}${ei + 1}`} • {ex.title || "Untitled"}{" "}
                        <Text style={{ color: muted }}>
                          ({repsDisplay} reps, tempo {tempoDisplay})
                        </Text>
                      </Text>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};
