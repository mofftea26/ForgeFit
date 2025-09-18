import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DayList,
  PhaseBar,
  RestDayEditor,
  WorkoutDayEditor,
} from "./components";
import { useProgramEditor } from "./hooks/useProgramEditor";

export function ProgramEditorScreen() {
  const {
    id,
    phase: qPhase,
    day: qDay,
  } = useLocalSearchParams<{
    id: string;
    phase?: string;
    day?: string;
  }>();
  const bg = useThemeColor({}, "background");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");
  const router = useRouter();

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
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 80 }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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

        {/* Day list */}
        <DayList
          days={phase.days}
          selectedId={selectedDay?.id}
          onSelect={setSelectedDayId}
          onAddWorkout={addWorkoutDay}
          onAddRest={addRestDay}
          onRemoveDay={removeDay}
        />

        <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

        {/* Editors */}
        {selectedDay?.type === "workout" ? (
          <WorkoutDayEditor
            value={selectedDay}
            onChange={(patch) => patchDay(selectedDay.id, patch)}
          />
        ) : (
          <RestDayEditor
            value={selectedDay}
            onChange={(patch) => patchDay(selectedDay.id, patch)}
          />
        )}

        {/* Footer buttons */}
        <View style={{ flexDirection: "row", gap: 10, paddingBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Button
              title="Back"
              variant="ghost"
              onPress={() => router.back()}
              fullWidth
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Save"
              variant="primary"
              onPress={() => router.back()}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
