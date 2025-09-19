import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  label: string; // e.g., "A", "B"...
  onRemove: () => void;
};

export const SeriesHeader: React.FC<Props> = ({ label, onRemove }) => {
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <P style={{ color: text, fontWeight: "700", fontSize: 14 }}>
        Series {label}
      </P>
      <View style={{ flex: 1 }} />
      <Pressable onPress={onRemove} hitSlop={8}>
        <Trash2 size={16} color={muted} />
      </Pressable>
    </View>
  );
};
