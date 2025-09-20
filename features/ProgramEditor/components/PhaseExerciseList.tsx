import { P } from "@/components/ui/Typography";
import { Phase, WorkoutDay } from "@/entities/program/zod";
import { workoutDaySummary } from "@/features/ProgramEditor/helpers/summary";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View } from "react-native";

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
      <P style={{ color: muted, fontFamily: "WorkSans_400Regular" }}>
        No workout days in this phase yet.
      </P>
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
          <P style={{ color: text, fontFamily: "Syne_700Bold", fontSize: 16 }}>
            {d.title}{" "}
            <P style={{ color: muted, fontFamily: "WorkSans_400Regular" }}>
              • {d.durationMin} min
            </P>
          </P>

          {/* 🔹 NEW: read-only day summary */}
          <P style={{ color: muted, fontFamily: "WorkSans_400Regular" }}>
            {workoutDaySummary(d)}
          </P>

          {d.series.length === 0 ? (
            <P style={{ color: muted }}>No exercises yet.</P>
          ) : (
            <View style={{ gap: 6 }}>
              {d.series.map((s) => (
                <View key={s.id} style={{ gap: 4 }}>
                  <P
                    style={{
                      color: primary,
                      fontFamily: "WorkSans_600SemiBold",
                    }}
                  >
                    Series {s.label}
                  </P>

                  {s.items.map((ex, ei) => {
                    const repsDisplay =
                      ex.sets.length > 0
                        ? ex.sets.map((st) => st.reps).join(" / ")
                        : "—";
                    const tempoDisplay = ex.tempo.join("/");

                    return (
                      <P
                        key={ex.id}
                        style={{
                          color: text,
                          fontFamily: "WorkSans_400Regular",
                        }}
                        numberOfLines={1}
                      >
                        {`${s.label}${ei + 1}`} • {ex.title || "Untitled"}{" "}
                        <P style={{ color: muted }}>
                          ({repsDisplay} reps, tempo {tempoDisplay})
                        </P>
                      </P>
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
