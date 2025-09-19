import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable } from "react-native";

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
      <P
        style={{
          color: destructive ? accentAlt : text,
          fontFamily: "WorkSans_600SemiBold",
        }}
      >
        {label}
      </P>
    </Pressable>
  );
}
