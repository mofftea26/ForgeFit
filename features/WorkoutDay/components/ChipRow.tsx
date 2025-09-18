import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View } from "react-native";

export const ChipRow: React.FC<{ label: string; items: string[] }> = ({
  label,
  items,
}) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");

  return (
    <View style={{ gap: 6 }}>
      <P color="muted" style={{ fontFamily: "WorkSans_600SemiBold" }}>
        {label}
      </P>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {items.map((t) => (
          <View
            key={t}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: outline,
              backgroundColor: tint,
            }}
          >
            <P style={{ color: "#fff" }}>{t}</P>
          </View>
        ))}
      </View>
    </View>
  );
};
