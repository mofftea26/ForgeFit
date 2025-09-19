import { useThemeColor } from "@/hooks/use-theme-color";
import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { ChipCapsule } from "./atoms/ChipCapsule";

export const InfoSection: React.FC<{
  title: string;
  Icon: LucideIcon;
  items: string[];
}> = ({ title, Icon, items }) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  if (!items?.length) return null;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: surface,
        borderRadius: 12,
        padding: 12,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon size={16} color={text} />
        <Text style={{ color: text, fontWeight: "700" }}>{title}</Text>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {items.map((t) => (
          <ChipCapsule key={t} label={t} />
        ))}
      </View>

      {/* graceful hint for long lists */}
      {items.length > 12 ? (
        <Text style={{ color: muted, fontSize: 12 }}>
          Showing {items.length} items
        </Text>
      ) : null}
    </View>
  );
};
