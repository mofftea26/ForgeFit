import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View } from "react-native";

export const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
      }}
    >
      <P color="muted">{label}</P>
      <P style={{ color: text }}>{value}</P>
    </View>
  );
};
