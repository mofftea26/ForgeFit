import { H2, P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DayCard } from "./components/DayCard";
import { PhaseSwitcher } from "./components/PhaseSwitcher";
import { ProgramMenu } from "./components/ProgramMenu";
import { useClampedPhaseIndex } from "./hooks/useClampedPhaseIndex";

export function ProgramDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const router = useRouter();

  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));
  const update = useProgramStore((s) => s.updateProgram);
  const removeProgram = useProgramStore((s) => s.removeProgram);

  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);

  useClampedPhaseIndex(program, phaseIdx, setPhaseIdx);

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

  const goDayView = (dayId: string) =>
    router.push(`/programs/${program.id}/days/${dayId}`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={{ marginBottom: 12 }}>
          <ImageBackground
            source={
              program.imageUrl
                ? { uri: program.imageUrl }
                : require("@/assets/images/program-placeholder.webp")
            }
            style={{ width: "100%", height: 260, justifyContent: "flex-start" }}
            resizeMode="cover"
          >
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.35)",
              }}
            />

            {/* Top bar */}
            <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={() => router.back()}
                  style={{ padding: 8, borderRadius: 999, marginRight: 6 }}
                >
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </Pressable>

                <View style={{ flex: 1 }}>
                  <P
                    style={{
                      color: "#fff",
                      fontFamily: "Syne_700Bold",
                      fontSize: 22,
                    }}
                    numberOfLines={1}
                  >
                    {program.title}
                  </P>
                  <P
                    style={{
                      color: "rgba(255,255,255,0.86)",
                      fontFamily: "WorkSans_500Medium",
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    Goal: {program.goal} • {program.lengthWeeks} weeks
                  </P>
                </View>

                <Pressable
                  onPress={() => setMenuOpen((v) => !v)}
                  style={{ padding: 8, borderRadius: 999 }}
                >
                  <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
                </Pressable>
              </View>
            </View>

            {/* Bottom description */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <P
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontFamily: "WorkSans_400Regular",
                  fontSize: 14,
                }}
                numberOfLines={3}
              >
                {program.description || "No program description yet."}
              </P>
            </LinearGradient>
          </ImageBackground>

          {menuOpen && (
            <ProgramMenu program={program} onClose={() => setMenuOpen(false)} />
          )}
        </View>

        {/* Phase switcher */}
        <View style={{ paddingHorizontal: 16, gap: 14 }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: outline,
              borderRadius: 999,
              backgroundColor: surface,
              overflow: "hidden",
            }}
          >
            <PhaseSwitcher
              phases={program.phases}
              activeIndex={phaseIdx}
              onChange={setPhaseIdx}
            />
          </View>

          {/* Days list */}
          <View style={{ gap: 10 }}>
            <H2>{phase.title || `Phase ${phaseIdx + 1}`}</H2>
            {phase.days.length === 0 ? (
              <P color="muted">No days yet.</P>
            ) : (
              phase.days.map((d) => (
                <DayCard
                  key={d.id}
                  day={d}
                  outline={outline}
                  surface={surface}
                  onPress={() => goDayView(d.id)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
