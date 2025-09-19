import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, View } from "react-native";

export const ReadOnlySummary: React.FC<{ text: string }> = ({ text }) => {
  const outline = useThemeColor({}, "outline");
  const bg = useThemeColor({}, "surface");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: bg,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ color: muted }}>{text}</Text>
      <Text style={{ color: primary, fontWeight: "600" }}>Read-only</Text>
    </View>
  );
};
