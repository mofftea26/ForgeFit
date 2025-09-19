import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

export function MenuItem({ label, onPress, destructive }: Props) {
  const text = useThemeColor({}, "text");
  const accentAlt = useThemeColor({}, "accentAlt");

  return (
    <Pressable
      onPress={onPress}
      style={{ paddingVertical: 10, paddingHorizontal: 12 }}
    >
      <Text
        style={{
          color: destructive ? accentAlt : text,
          fontFamily: "WorkSans_600SemiBold",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
