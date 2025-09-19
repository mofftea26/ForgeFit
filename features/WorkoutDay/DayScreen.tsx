import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { P } from "@/components/ui/Typography";
import type { RestDay, WorkoutDay } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores";
import { ChipRow } from "./components/ChipRow";
import { DayHeader } from "./components/DayHeader";
import { SeriesCard } from "./components/SeriesCard";

// Narrow helper to read optional imageUrl safely if it exists on the object
function pickOptionalImageUrl(day: WorkoutDay | RestDay): string | undefined {
  if (day.type !== "workout") return undefined;
  // runtime check for a non-schema ad-hoc prop
  if ("imageUrl" in day && typeof (day as any).imageUrl === "string") {
    return (day as any).imageUrl as string;
  }
  return undefined;
}

export function DayScreen() {
  const { id, dayId } = useLocalSearchParams<{ id: string; dayId: string }>();
  const router = useRouter();

  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const bg = useThemeColor({}, "background");

  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));
  const day =
    program?.phases.flatMap((ph) => ph.days).find((d) => d.id === dayId) ??
    null;

  if (!program || !day) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <P>Day not found.</P>
      </View>
    );
  }

  const isWorkout = day.type === "workout";
  const workoutDay = isWorkout ? (day as WorkoutDay) : null;

  const headerTitle = day.title || (isWorkout ? "Workout day" : "Rest day");
  const headerSubtitle = isWorkout
    ? `workout • ${workoutDay?.durationMin}m`
    : "rest";
  const headerImage = pickOptionalImageUrl(day);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <DayHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          imageUri={headerImage}
          description={day.description ?? ""}
          onBack={() => router.back()}
        />

        {/* Meta chips */}
        {isWorkout && workoutDay && (
          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {!!workoutDay.targetMuscleGroups?.length && (
              <ChipRow label="Targets" items={workoutDay.targetMuscleGroups} />
            )}
            {!!workoutDay.equipmentNeeded?.length && (
              <ChipRow label="Equipment" items={workoutDay.equipmentNeeded} />
            )}
          </View>
        )}

        {/* Series list */}
        <View style={{ padding: 16, gap: 12 }}>
          {isWorkout && workoutDay?.series?.length ? (
            workoutDay.series.map((s) => <SeriesCard key={s.id} series={s} />)
          ) : (
            <View
              style={{
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: surface,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <P color="muted">
                {isWorkout ? "No series yet." : "This is a rest day."}
              </P>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
