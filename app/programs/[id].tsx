import { H2, P } from "@/components/ui/Typography";
import { PhaseSwitcher } from "@/features/ProgramEditor/components";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores/programStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProgramDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const router = useRouter();

  const program = useProgramStore((s) => s.programs.find((p) => p.id === id));
  const update = useProgramStore((s) => s.updateProgram);
  const removeProgram = useProgramStore((s) => s.removeProgram);

  const [phaseIdx, setPhaseIdx] = React.useState(0);
  const [menuOpen, setMenuOpen] = React.useState(false);

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

  const goDayView = (dayId: string) =>
    router.push(`/programs/${program.id}/days/${dayId}`);
  const goEditDay = (dayId: string) =>
    router.push({
      pathname: `/programs/${program.id}/edit` as any,
      params: { phase: String(phaseIdx), day: dayId },
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header with image background */}
        {/* Header with image background (dimmed), top info, bottom description */}
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
            {/* Dim layer for overall fade */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.35)",
              }}
            />

            {/* Top bar: back, title, goal/duration, menu */}
            <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={() => router.back()}
                  style={{ padding: 8, borderRadius: 999, marginRight: 6 }}
                >
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </Pressable>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "Syne_700Bold",
                      fontSize: 22,
                    }}
                    numberOfLines={1}
                  >
                    {program.title}
                  </Text>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.86)",
                      fontFamily: "WorkSans_500Medium",
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                  >
                    Goal: {program.goal} • {program.lengthWeeks} weeks
                  </Text>
                </View>

                <Pressable
                  onPress={() => setMenuOpen((v) => !v)}
                  style={{ padding: 8, borderRadius: 999 }}
                >
                  <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
                </Pressable>
              </View>
            </View>

            {/* Bottom description with gradient fade */}
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
              <Text
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontFamily: "WorkSans_400Regular",
                  fontSize: 14,
                }}
                numberOfLines={3}
              >
                {program.description || "No program description yet."}
              </Text>
            </LinearGradient>
          </ImageBackground>

          {/* Actions menu */}
          {menuOpen ? (
            <View
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: surface,
                borderColor: outline,
                borderWidth: 1,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <MenuItem
                label="Edit program"
                onPress={() => {
                  goEditDay(phase.days[0].id);
                  setMenuOpen(false);
                }}
              />
              <MenuItem
                label="Export (soon)"
                onPress={() => setMenuOpen(false)}
              />
              <MenuItem
                label="Share as… (soon)"
                onPress={() => setMenuOpen(false)}
              />
              <MenuItem
                label="Delete program"
                destructive
                onPress={() => {
                  setMenuOpen(false);
                  removeProgram(program.id);
                  router.replace("/");
                }}
              />
            </View>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 16, gap: 14 }}>
          {/* Phase switcher pill container (rounded like pills) */}
          <View
            style={{
              borderWidth: 1,
              borderColor: outline,
              borderRadius: 999, // pill container
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

          {/* Days for current phase */}
          <View style={{ gap: 10 }}>
            <H2>{phase.title || `Phase ${phaseIdx + 1}`}</H2>
            {phase.days.length === 0 ? (
              <P color="muted">No days yet.</P>
            ) : (
              phase.days.map((d) => (
                <Pressable
                  key={d.id}
                  onPress={() => goDayView(d.id)}
                  style={{
                    borderWidth: 1,
                    borderColor: outline,
                    backgroundColor: surface,
                    borderRadius: 12,
                    padding: 10,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    {/* Left: title + meta */}
                    <View style={{ flex: 1 }}>
                      <P style={{ fontFamily: "WorkSans_600SemiBold" }}>
                        {d.type === "workout"
                          ? d.title || "Workout day"
                          : "Rest day"}
                      </P>
                      <P color="muted" style={{ fontSize: 12 }}>
                        {d.type}
                        {d.type === "workout" ? ` • ${d.durationMin}m` : ""}
                      </P>
                    </View>

                    {/* Right: image thumbnail */}
                    <View
                      style={{
                        width: 64,
                        height: 48,
                        borderRadius: 8,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: outline,
                        backgroundColor: surface,
                      }}
                    >
                      {d.type === "workout" && (d as any).imageUrl ? (
                        <Image
                          source={{ uri: (d as any).imageUrl }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name="image-outline"
                            size={18}
                            color={muted}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const MenuItem: React.FC<{
  label: string;
  onPress: () => void;
  destructive?: boolean;
}> = ({ label, onPress, destructive }) => {
  const text = useThemeColor({}, "text");
  const accentAlt = useThemeColor({}, "accentAlt");
  return (
    <Pressable
      onPress={onPress}
      style={{ paddingVertical: 10, paddingHorizontal: 12 }}
    >
      <Text
        style={{
          color: destructive ? accentAlt : text,
          fontFamily: "WorkSans_600SemiBold",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};
