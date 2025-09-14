import { Day } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

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
  const danger = useThemeColor({}, "accentAlt");

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable
          onPress={onAddWorkout}
          style={{
            borderWidth: 1,
            borderColor: outline,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
            + Workout day
          </Text>
        </Pressable>
        <Pressable
          onPress={onAddRest}
          style={{
            borderWidth: 1,
            borderColor: outline,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
            + Rest day
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {days.map((d, idx) => {
          const active = d.id === selectedId;
          return (
            <View
              key={d.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: active ? tint : surface,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
            >
              <Pressable
                onPress={() => onSelect(d.id)}
                style={{ maxWidth: 180 }}
              >
                <Text
                  style={{
                    color: active ? "#fff" : text,
                    fontFamily: "WorkSans_600SemiBold",
                  }}
                >
                  {d.type === "workout" ? d.title || `Day ${idx + 1}` : "Rest"}
                </Text>
                <Text style={{ color: active ? "#fff" : muted, fontSize: 12 }}>
                  {d.type}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onRemoveDay(d.id)}
                style={{ padding: 4 }}
              >
                <Ionicons name="trash-outline" size={16} color={danger} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};
