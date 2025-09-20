import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RestDay, WorkoutDay } from "@/entities/program/zod";
import { PhaseBar, RestDayEditor, WorkoutDayEditor } from "./components";
import { DaysPanel } from "./components/DaysPanel";
import { FooterBar } from "./components/FooterBar";
import { summaryLabel } from "./helpers/summary";
import { useEstimatedDuration } from "./hooks/useEstimateDuration";
import { useProgramEditor } from "./hooks/useProgramEditor";

export function ProgramEditorScreen() {
  const {
    id,
    phase: qPhase,
    day: qDay,
  } = useLocalSearchParams<{ id: string; phase?: string; day?: string }>();

  const bg = useThemeColor({}, "background");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const router = useRouter();

  // Hook 1: program/editor state (always called)
  const {
    program,
    phase,
    phaseIdx,
    setPhaseIdx,
    selectedDay,
    setSelectedDayId,
    addWorkoutDay,
    addRestDay,
    addPhase,
    removeDay,
    patchDay,
  } = useProgramEditor(id, qPhase, qDay);

  // Prepare inputs for the next hook in an unconditional way
  const isWorkout = selectedDay?.type === "workout";
  const seriesForEstimate = (
    isWorkout ? (selectedDay as WorkoutDay).series : []
  ) as any[];

  // Hook 2: duration estimate (always called, even if program is missing)
  const { minutes: estimatedMinutesRaw } = useEstimatedDuration(
    seriesForEstimate,
    { perSetOverheadSec: 8, roundToMinutes: 5 }
  );
  const estimatedMinutes = isWorkout ? estimatedMinutesRaw : undefined;

  // Build summary text (no hooks here, just plain logic)
  const summaryText = isWorkout
    ? summaryLabel(((selectedDay as WorkoutDay)?.series ?? []) as any)
    : "Rest day";

  // Only now do the early return
  if (!program) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <P>Program not found.</P>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 16,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={22}
          color={text}
          onPress={() => router.back()}
        />
        <View style={{ flex: 1 }}>
          <H1>{program.title}</H1>
          <H2 color="primary">Editor</H2>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120 }}
      >
        {/* Phase bar */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <PhaseBar
              phases={program.phases}
              activeIndex={phaseIdx}
              onChange={(i) => {
                setPhaseIdx(i);
                setSelectedDayId(program.phases[i].days[0]?.id);
              }}
            />
          </View>
          <Button
            title="+"
            variant="primary"
            onPress={addPhase}
            style={{ width: 44, height: 44, borderRadius: 22 }}
          />
        </View>

        {/* Day Panel */}
        <DaysPanel
          days={phase.days}
          selectedId={selectedDay?.id}
          onSelect={setSelectedDayId}
          onAddWorkout={addWorkoutDay}
          onAddRest={addRestDay}
          onRemoveDay={removeDay}
          onChangeDayImage={(dayId, uri) => {
            const d = phase.days.find((d) => d.id === dayId);
            if (d?.type !== "workout") return;

            patchDay(dayId, { imageUrl: uri } as any);
          }}
        />

        <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

        {/* Editors */}
        {isWorkout ? (
          <WorkoutDayEditor
            value={selectedDay as WorkoutDay}
            onChange={(patch: Partial<WorkoutDay>) =>
              patchDay((selectedDay as WorkoutDay).id, patch)
            }
          />
        ) : (
          <RestDayEditor
            value={selectedDay as RestDay}
            onChange={(patch: Partial<RestDay>) =>
              patchDay((selectedDay as RestDay).id, patch)
            }
          />
        )}
      </ScrollView>

      {/* Sticky footer with summary + estimated duration + Save */}
      <FooterBar
        summaryText={summaryText}
        estimatedMinutes={estimatedMinutes}
        onSave={() => router.back()}
      />
    </SafeAreaView>
  );
}

export default ProgramEditorScreen;
