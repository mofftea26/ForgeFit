import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, View } from "react-native";
import { P } from "../Typography";

export const PillChecklist: React.FC<{
  options: { label: string; value: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}> = ({ options, value, onChange }) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");

  function toggle(v: string) {
    const has = value.includes(v);
    onChange(has ? value.filter((x) => x !== v) : [...value, v]);
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <Pressable
            key={opt.value}
            onPress={() => toggle(opt.value)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
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
              {opt.label}
            </P>
          </Pressable>
        );
      })}
    </View>
  );
};
