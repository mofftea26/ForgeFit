import { Button } from "@/components/ui/Button";
import { H1, H2, P } from "@/components/ui/Typography";
import { PhaseSwitcher } from "@/features/ProgramEditor/components";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores/programStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgramDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const primary = useThemeColor({}, "primary");
  const router = useRouter();

  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));
  const update = useProgramStore((s) => s.updateProgram);
  const removeProgram = useProgramStore((s) => s.removeProgram);

  const [phaseIdx, setPhaseIdx] = React.useState(0);

  React.useEffect(() => {
    if (!program) return;
    setPhaseIdx((i) => Math.min(i, Math.max(0, program.phases.length - 1)));
  }, [program?.phases.length]);

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

  const deleteDay = (dayId: string) => {
    const phases = program.phases.map((ph, i) =>
      i !== phaseIdx
        ? ph
        : { ...ph, days: ph.days.filter((d) => d.id !== dayId) }
    );
    update(program.id, { phases });
  };

  const goDayView = (dayId: string) => {
    router.push(`/programs/${program.id}/days/${dayId}`);
  };

  const goEditDay = (dayId: string) => {
    // deep-link to editor with phase & day preselected
    router.push({
      pathname: `/programs/${program.id}/edit`,
      params: { phase: String(phaseIdx), day: dayId },
    } as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
      >
        {/* top row: back + titles */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 8, borderRadius: 999 }}
          >
            <Ionicons name="chevron-back" size={22} color={text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <H1>{program.title}</H1>
            <P color="muted">
              Goal: {program.goal} • Length: {program.lengthWeeks} weeks •
              Phases: {program.phases.length}
            </P>
          </View>
        </View>

        {/* program description */}
        <P>{program.description || "No program description yet."}</P>

        {/* actions */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button
            title="Edit program"
            variant="secondary"
            onPress={() => router.push(`/programs/${program.id}/edit`)}
          />
          <Button title="Export (soon)" variant="subtle" onPress={() => {}} />
          <Button
            title="Delete program"
            variant="warning"
            onPress={() => {
              removeProgram(program.id);
              router.replace("/");
            }}
          />
        </View>

        <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

        {/* Phase switcher */}
        <PhaseSwitcher
          phases={program.phases}
          activeIndex={phaseIdx}
          onChange={setPhaseIdx}
        />

        {/* Days for current phase only */}
        <View style={{ gap: 10 }}>
          <H2>{phase.title || `Phase ${phaseIdx + 1}`}</H2>
          {phase.days.length === 0 ? (
            <P color="muted">No days yet.</P>
          ) : (
            phase.days.map((d) => (
              <Pressable
                key={d.id}
                onPress={() => goDayView(d.id)} // open view page (not editor)
                style={{
                  backgroundColor: surface,
                  borderWidth: 1,
                  borderColor: outline,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: text,
                        fontFamily: "Syne_700Bold",
                        fontSize: 16,
                      }}
                    >
                      {d.title}{" "}
                      <Text
                        style={{
                          color: muted,
                          fontFamily: "WorkSans_400Regular",
                        }}
                      >
                        • {d.type}
                      </Text>
                    </Text>
                    {d.type === "workout" ? (
                      <Text style={{ color: muted, marginTop: 2 }}>
                        {d.durationMin} min • {d.numberOfExercises} exercises •{" "}
                        {d.numberOfSets} sets
                      </Text>
                    ) : null}
                  </View>

                  {/* actions on far right */}
                  <Pressable
                    onPress={() => goEditDay(d.id)}
                    style={{ padding: 6, marginLeft: 6 }}
                  >
                    <Ionicons name="create-outline" size={18} color={primary} />
                  </Pressable>
                  <Pressable
                    onPress={() => deleteDay(d.id)}
                    style={{ padding: 6 }}
                  >
                    <Ionicons name="trash-outline" size={18} color={primary} />
                  </Pressable>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
