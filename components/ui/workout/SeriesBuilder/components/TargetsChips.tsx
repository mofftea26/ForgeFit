import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, View } from "react-native";

export const TargetsChips: React.FC<{
  options: string[];
  value: string[];
  onToggle: (val: string) => void;
}> = ({ options, value, onToggle }) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");

  if (!options?.length) return null;

  return (
    <View>
      <P
        style={{
          color: text,
          fontWeight: "600",
          marginBottom: 6,
          fontSize: 13,
        }}
      >
        Target muscles
      </P>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: active ? tint : "transparent",
              }}
            >
              <P style={{ color: active ? "#fff" : text, fontSize: 12 }}>
                {opt}
              </P>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
