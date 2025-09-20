import { P } from "@/components/ui/Typography";
import { Phase } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

export const PhaseSwitcher: React.FC<{
  phases: Phase[];
  activeIndex: number;
  onChange: (idx: number) => void;
}> = ({ phases, activeIndex, onChange }) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 14,
        backgroundColor: surface,
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
                borderRadius: 999,
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: active ? tint : "transparent",
              }}
            >
              <P
                style={{
                  color: active ? "#fff" : text,
                  fontFamily: "WorkSans_600SemiBold",
                }}
              >
                {p.title || `Phase ${i + 1}`}
              </P>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
