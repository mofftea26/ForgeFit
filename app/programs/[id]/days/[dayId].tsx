// app/programs/[id]/day/[dayId].tsx
import { H2, P } from "@/components/ui/Typography";
import { SeriesCard } from "@/features/WorkoutDay/components/SeriesCard";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores/programStore";
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

export default function DayView() {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header image with dim + gradient bottom */}
        <View style={{ marginBottom: 12 }}>
          <ImageBackground
            source={
              day.type === "workout" && (day as any).imageUrl
                ? { uri: (day as any).imageUrl }
                : require("@/assets/images/program-placeholder.webp")
            }
            style={{ width: "100%", height: 260, justifyContent: "flex-start" }}
            resizeMode="cover"
          >
            {/* Dim layer */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(0,0,0,0.35)",
              }}
            />

            {/* Top bar: back + title + meta */}
            <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={() => router.back()}
                  style={{ padding: 8, borderRadius: 999, marginRight: 6 }}
                >
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </Pressable>

                <View style={{ flex: 1 }}>
                  <H2 style={{ color: "#fff" }}>
                    {day.title ||
                      (day.type === "workout" ? "Workout day" : "Rest day")}
                  </H2>
                  <P style={{ color: "rgba(255,255,255,0.86)" }}>
                    {day.type}{" "}
                    {day.type === "workout" ? `• ${day.durationMin}m` : ""}
                  </P>
                </View>
              </View>
            </View>

            {/* Bottom description with gradient fade */}
            {(day.description || "").length > 0 && (
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
                  style={{ color: "rgba(255,255,255,0.95)" }}
                  numberOfLines={3}
                >
                  {day.description}
                </P>
              </LinearGradient>
            )}
          </ImageBackground>
        </View>

        {/* Meta chips */}
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {day.type === "workout" && (
            <>
              {!!day.targetMuscleGroups?.length && (
                <ChipRow label="Targets" items={day.targetMuscleGroups} />
              )}
              {!!day.equipmentNeeded?.length && (
                <ChipRow label="Equipment" items={day.equipmentNeeded} />
              )}
            </>
          )}
        </View>

        {/* Series list */}
        <View style={{ padding: 16, gap: 12 }}>
          {day.type === "workout" && day.series?.length ? (
            day.series.map((s) => <SeriesCard key={s.id} series={s as any} />)
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
              <P color="muted">No series yet.</P>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ChipRow: React.FC<{ label: string; items: string[] }> = ({
  label,
  items,
}) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const tint = useThemeColor({}, "primarySoft");

  return (
    <View style={{ gap: 6 }}>
      <P color="muted" style={{ fontFamily: "WorkSans_600SemiBold" }}>
        {label}
      </P>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {items.map((t) => (
          <View
            key={t}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: outline,
              backgroundColor: tint,
            }}
          >
            <P style={{ color: "#fff" }}>{t}</P>
          </View>
        ))}
      </View>
    </View>
  );
};
