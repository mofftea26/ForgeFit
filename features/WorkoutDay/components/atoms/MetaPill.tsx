import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, View } from "react-native";

export const MetaPill: React.FC<{
  text: string;
  tone?: "default" | "inverted";
}> = ({ text, tone = "default" }) => {
  const outline = useThemeColor({}, "outline");
  const textColor = useThemeColor({}, "text");
  const chipOnTintBg = useThemeColor({}, "chipOnTintBg");
  const chipOnTintBorder = useThemeColor({}, "chipOnTintBorder");
  const onTint = useThemeColor({}, "onTint");

  const base = {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
  } as const;

  if (tone === "inverted") {
    return (
      <View
        style={{
          ...base,
          borderColor: chipOnTintBorder,
          backgroundColor: chipOnTintBg,
        }}
      >
        <Text style={{ color: onTint, fontWeight: "700", fontSize: 12 }}>
          {text}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ ...base, borderColor: outline }}>
      <Text style={{ color: textColor, fontWeight: "600", fontSize: 12 }}>
        {text}
      </Text>
    </View>
  );
};
