import { Day } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export const DayList: React.FC<{
  days: Day[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddWorkout: () => void;
  onAddRest: () => void;
  onRemoveDay: (id: string) => void;
}> = ({ days, selectedId, onSelect, onAddWorkout, onAddRest, onRemoveDay }) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  return (
    <View style={{ gap: 10 }}>
      {/* same line add buttons */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={onAddWorkout}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 12,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
            + Workout day
          </Text>
        </Pressable>
        <Pressable
          onPress={onAddRest}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 12,
            padding: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
            + Rest day
          </Text>
        </Pressable>
      </View>

      {/* Horizontal day cards, compact height, trash on far right */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingVertical: 2 }}
      >
        {days.map((d, idx) => {
          const active = d.id === selectedId;
          return (
            <Pressable
              key={d.id}
              onPress={() => onSelect(d.id)}
              style={{
                width: 220,
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: active ? tint : surface,
                borderRadius: 12,
                paddingVertical: 8,
                paddingHorizontal: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: active ? "#fff" : text,
                      fontFamily: "WorkSans_600SemiBold",
                    }}
                    numberOfLines={1}
                  >
                    {d.type === "workout"
                      ? d.title || `Day ${idx + 1}`
                      : "Rest"}
                  </Text>
                  <Text
                    style={{ color: active ? "#fff" : muted, fontSize: 12 }}
                    numberOfLines={1}
                  >
                    {d.type}
                    {d.type === "workout" ? ` • ${d.durationMin}m` : ""}
                  </Text>
                </View>
                <Pressable
                  onPress={() => onRemoveDay(d.id)}
                  hitSlop={8}
                  style={{ padding: 4, marginLeft: 6 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={16}
                    color={active ? "#fff" : text}
                  />
                </Pressable>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
