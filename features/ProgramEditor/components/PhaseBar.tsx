import { Button } from "@/components/ui/Button";
import { Phase } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export const PhaseBar: React.FC<{
  phases: Phase[];
  activeIndex: number;
  onChange: (idx: number) => void;
  onAddPhase: () => void;
}> = ({ phases, activeIndex, onChange, onAddPhase }) => {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");

  // height of the bar
  const BAR_H = 56;
  const RIGHT_BTN_W = 88; // room for + Phase button

  return (
    <View
      style={{
        position: "relative",
        width: "100%",
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 14,
        backgroundColor: surface,
        height: BAR_H,
        overflow: "hidden",
      }}
    >
      {/* Scrollable pills area (leaves space on the right for fixed button) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 8,
          paddingRight: RIGHT_BTN_W + 8,
          gap: 8,
          height: BAR_H,
        }}
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
                backgroundColor: active ? tint : "transparent",
                borderWidth: 1,
                borderColor: outline,
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

      {/* Fixed + button on the far right */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          right: 6,
          top: 6,
          bottom: 6,
          justifyContent: "center",
          backgroundColor: surface,
        }}
      >
        <Button title="+ Phase" variant="primary" onPress={onAddPhase} />
      </View>
    </View>
  );
};
