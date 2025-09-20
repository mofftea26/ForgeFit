import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View } from "react-native";

export const Divider: React.FC = () => {
  const outline = useThemeColor({}, "outline");
  return (
    <View
      style={{
        height: 1,
        backgroundColor: outline,
        opacity: 1,
        marginVertical: 12,
      }}
    />
  );
};
