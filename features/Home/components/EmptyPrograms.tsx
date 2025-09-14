import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, View } from "react-native";

export const EmptyPrograms: React.FC = () => {
  const muted = useThemeColor({}, "muted");
  return (
    <View style={{ alignItems: "center", paddingVertical: 24 }}>
      <Text style={{ color: muted, fontFamily: "WorkSans_400Regular" }}>
        No programs yet. Tap + to create your first.
      </Text>
    </View>
  );
};
