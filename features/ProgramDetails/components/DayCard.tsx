import { P } from "@/components/ui/Typography";
import { Day } from "@/entities/program/zod";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, View } from "react-native";

type Props = {
  day: Day;
  outline: string;
  surface: string;
  onPress: () => void;
};

export function DayCard({ day, outline, surface, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: surface,
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <P style={{ fontFamily: "WorkSans_600SemiBold" }}>
            {day.type === "workout" ? day.title || "Workout day" : "Rest day"}
          </P>
          <P color="muted" style={{ fontSize: 12 }}>
            {day.type}
            {day.type === "workout" ? ` • ${day.durationMin}m` : ""}
          </P>
        </View>

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
          {day.type === "workout" && (day as any).imageUrl ? (
            <Image
              source={{ uri: (day as any).imageUrl }}
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
              <Ionicons name="image-outline" size={18} color={outline} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
