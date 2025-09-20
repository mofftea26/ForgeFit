import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View } from "react-native";

export const ChipCapsule: React.FC<{ label: string }> = ({ label }) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const surfaceElevated = useThemeColor({}, "surfaceElevated");

  return (
    <View
      style={{
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: surfaceElevated,
      }}
    >
      <P style={{ color: text, fontSize: 12 }}>{label}</P>
    </View>
  );
};
