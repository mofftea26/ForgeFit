import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Typography";
import {
  Day,
  Phase,
  RestDay,
  WorkoutDay,
  blankPhase,
  blankRestDay,
  blankWorkoutDay,
} from "@/entities/program/zod";
import {
  DayList,
  PhaseBar,
  RestDayEditor,
  WorkoutDayEditor,
} from "@/features/ProgramEditor/components";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores/programStore";
import { Ionicons } from "@expo/vector-icons";

export default function ProgramEditorScreen() {
  const {
    id,
    phase: qPhase,
    day: qDay,
  } = useLocalSearchParams<{ id: string; phase?: string; day?: string }>();
  const bg = useThemeColor({}, "background");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const router = useRouter();

  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));
  const updateProgram = useProgramStore((s) => s.updateProgram);
  const removeProgram = useProgramStore((s) => s.removeProgram);

  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [selectedDayId, setSelectedDayId] = React.useState<string | undefined>(
    undefined
  );
  React.useEffect(() => {
    if (!program) return;
    const pIdx = qPhase
      ? Math.max(0, Math.min(Number(qPhase) || 0, program.phases.length - 1))
      : 0;
    setPhaseIdx(pIdx);
    const fallbackDay = program.phases[pIdx]?.days[0]?.id;
    setSelectedDayId(qDay ?? fallbackDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.id]);

  React.useEffect(() => {
    if (program && program.phases.length > 0) {
      setPhaseIdx((i) => Math.min(i, program.phases.length - 1));
      if (!selectedDayId) setSelectedDayId(program.phases[0].days[0]?.id);
    }
  }, [program?.id]);

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

  const phase = program.phases[phaseIdx];

  function mutatePhase(mutator: (p: Phase) => Phase) {
    if (!program) return;
    const phases = program.phases.map((ph, i) =>
      i === phaseIdx ? mutator(ph) : ph
    );
    updateProgram(program.id, { phases });
  }

  function addWorkoutDay() {
    mutatePhase((ph) => ({
      ...ph,
      days: [...ph.days, blankWorkoutDay(`Day ${ph.days.length + 1}`)],
    }));
  }
  function addRestDay() {
    mutatePhase((ph) => ({ ...ph, days: [...ph.days, blankRestDay()] }));
  }
  function patchDay(id: string, patch: Partial<WorkoutDay | RestDay>) {
    mutatePhase((ph) => ({
      ...ph,
      days: ph.days.map((d) => (d.id === id ? ({ ...d, ...patch } as Day) : d)),
    }));
  }
  function addPhase() {
    if (!program) return;
    const nextIndex = program.phases.length;
    const newPhases = [...program.phases, blankPhase(`Phase ${nextIndex + 1}`)];
    updateProgram(program.id, { phases: newPhases });
    const firstDayId = newPhases[nextIndex].days[0]?.id;
    setPhaseIdx(nextIndex);
    setSelectedDayId(firstDayId);
  }
  function removeDay(dayId: string) {
    mutatePhase((ph) => ({
      ...ph,
      days: ph.days.filter((d) => d.id !== dayId),
    }));
    // ensure selection remains valid
    const newPhase = program!.phases[phaseIdx];
    const next = newPhase?.days[0]?.id;
    setSelectedDayId(next);
  }

  const currentDay =
    phase.days.find((d) => d.id === selectedDayId) ?? phase.days[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 80 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 8, borderRadius: 999 }}
          >
            <Ionicons name="chevron-back" size={22} color={text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <H1>{program.title}</H1>
            <H2 color="primary">Editor</H2>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

        <PhaseBar
          phases={program.phases}
          activeIndex={phaseIdx}
          onChange={(i) => {
            setPhaseIdx(i);
            setSelectedDayId(program.phases[i].days[0]?.id);
          }}
          onAddPhase={addPhase}
        />

        {/* Days */}
        <DayList
          days={phase.days}
          selectedId={currentDay?.id}
          onSelect={setSelectedDayId}
          onAddWorkout={addWorkoutDay}
          onAddRest={addRestDay}
          onRemoveDay={removeDay}
        />

        <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

        {/* Editors */}
        {currentDay?.type === "workout" ? (
          <WorkoutDayEditor
            value={currentDay}
            onChange={(patch) => patchDay(currentDay.id, patch)}
          />
        ) : (
          <RestDayEditor
            value={currentDay as RestDay}
            onChange={(patch) => patchDay(currentDay.id, patch)}
          />
        )}

        <View style={{ height: 8 }} />
        <Button title="Back" variant="ghost" onPress={() => router.back()} />
        <Button
          title="Delete program"
          variant="warning"
          onPress={() => {
            removeProgram(program.id);
            router.replace("/");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
