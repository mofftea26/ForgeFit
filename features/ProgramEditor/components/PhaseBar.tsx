import { Phase } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export const PhaseBar: React.FC<{
  phases: Phase[];
  activeIndex: number;
  onChange: (idx: number) => void;
}> = ({ phases, activeIndex, onChange }) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 999, // pill container
        backgroundColor: surface,
        overflow: "hidden",
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 8, gap: 8, alignItems: "center" }}
      >
        {phases.map((p, i) => {
          const active = i === activeIndex;
          return (
            <Pressable
              key={p.id}
              onPress={() => onChange(i)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999, // pill
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: active ? tint : "transparent",
              }}
            >
              <Text
                style={{
                  color: active ? "#fff" : text,
                  fontFamily: "WorkSans_600SemiBold",
                }}
              >
                {p.title || `Phase ${i + 1}`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
