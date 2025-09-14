import { H1, H2, P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores/programStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DayView() {
  const { id, dayId } = useLocalSearchParams<{ id: string; dayId: string }>();
  const router = useRouter();
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const outline = useThemeColor({}, "outline");

  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));
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

  // find day + its phase index
  let phaseIdx = 0;
  let day: any = null;
  for (let i = 0; i < program.phases.length; i++) {
    const found = program.phases[i].days.find((d) => d.id === dayId);
    if (found) {
      phaseIdx = i;
      day = found;
      break;
    }
  }
  if (!day) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <P>Day not found.</P>
      </SafeAreaView>
    );
  }

  const goEdit = () => {
    router.push({
      pathname: `/programs/${program.id}/edit` as any,
      params: { phase: String(phaseIdx), day: String(day.id) },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }}
      >
        {/* header: back + title + edit */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 8, borderRadius: 999 }}
          >
            <Ionicons name="chevron-back" size={22} color={text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <H1>{day.title}</H1>
            <P color="muted">{day.type}</P>
          </View>
          <Pressable onPress={goEdit} style={{ padding: 8, borderRadius: 999 }}>
            <Ionicons name="create-outline" size={22} color={text} />
          </Pressable>
        </View>

        <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

        {day.type === "rest" ? (
          <View style={{ gap: 8 }}>
            {!!day.trainerNote && <P>{day.trainerNote}</P>}
            {!!day.description && <P color="muted">{day.description}</P>}
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {!!day.description && <P>{day.description}</P>}
            {day.targetMuscleGroups?.length ? (
              <P color="muted">Targets: {day.targetMuscleGroups.join(", ")}</P>
            ) : null}
            {day.equipmentNeeded?.length ? (
              <P color="muted">Equipment: {day.equipmentNeeded.join(", ")}</P>
            ) : null}
            <P color="muted">
              {day.durationMin} min • {day.numberOfExercises} exercises •{" "}
              {day.numberOfSets} sets
            </P>

            <View
              style={{ height: 1, backgroundColor: outline, opacity: 0.6 }}
            />
            {/* series & exercises */}
            {day.series.map((s: any) => (
              <View key={s.id} style={{ gap: 6 }}>
                <H2>Series {s.label}</H2>
                {s.items.map((ex: any, i: number) => (
                  <View key={ex.id} style={{ paddingVertical: 6 }}>
                    <Text
                      style={{
                        color: text,
                        fontFamily: "WorkSans_600SemiBold",
                      }}
                    >
                      {s.label}
                      {i + 1} — {ex.title || "Untitled"}
                    </Text>
                    <Text style={{ color: muted }}>
                      Reps: {ex.reps.join(" / ")} • Tempo: {ex.tempo.join("/")}{" "}
                      • Rest: {ex.restSec ?? 60}s
                    </Text>
                    {!!ex.trainerNote && (
                      <Text style={{ color: muted }}>
                        Note: {ex.trainerNote}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
