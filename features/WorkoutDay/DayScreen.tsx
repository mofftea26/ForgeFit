import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccordionWrapper } from "@/components/ui/AccordionWrapper";
import { P } from "@/components/ui/Typography";
import type { RestDay, WorkoutDay } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores";
import { Info } from "lucide-react-native";
import { DayHeader } from "./components/DayHeader";
import { InfoSectionWrapper } from "./components/InfoSectionWrapper";
import { SeriesList } from "./components/SeriesList";

function pickOptionalImageUrl(day: WorkoutDay | RestDay): string | undefined {
  if (day.type !== "workout") return undefined;
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
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <DayHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          imageUri={headerImage}
          description={day.description ?? ""}
          onBack={() => router.back()}
        />
        {isWorkout && workoutDay && (
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            <AccordionWrapper
              title="Targets & Equipment"
              Icon={Info}
              defaultOpen
            >
              <InfoSectionWrapper
                targets={workoutDay.targetMuscleGroups ?? []}
                equipment={workoutDay.equipmentNeeded ?? []}
              />
            </AccordionWrapper>
          </View>
        )}
        {/* Series list – redesigned */}
        <View style={{ padding: 16 }}>
          {isWorkout && workoutDay?.series?.length ? (
            <SeriesList series={workoutDay.series} />
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

      {/* Sticky CTA placeholder for future "Start Workout" */}
      {/* 
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
          backgroundColor: bg,
          borderTopWidth: 1,
          borderTopColor: outline,
        }}
      >
        <Button title="Start workout" onPress={() => {}} />
      </View>
      */}
    </SafeAreaView>
  );
}
