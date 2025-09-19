import { Button } from "@/components/ui/Button";
import { H2, H4 } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FooterBarProps = {
  summaryText: string;
  estimatedMinutes?: number;
  onSave: () => void;
};

export const FooterBar: React.FC<FooterBarProps> = ({
  summaryText,
  estimatedMinutes,
  onSave,
}) => {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const insets = useSafeAreaInsets();

  const isRest = summaryText.toLowerCase().includes("rest");

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: surface,
        borderTopWidth: 1,
        borderTopColor: outline,
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      {/* Summary */}
      <View style={{ flex: 1, gap: isRest ? 0 : 2 }}>
        {isRest ? (
          <H2 style={{ color: text, marginBottom: 10 }}>{summaryText}</H2>
        ) : (
          <View style={{ gap: 2 }}>
            <H4 style={{ color: text, fontWeight: "600", marginBottom: 2 }}>
              {summaryText}
            </H4>
            {estimatedMinutes !== undefined && (
              <H4 style={{ color: muted, fontSize: 12, marginBottom: 2 }}>
                Est. {estimatedMinutes} min
              </H4>
            )}
          </View>
        )}
      </View>

      {/* Save button */}
      <View style={{ width: 120 }}>
        <Button title="Save" variant="primary" onPress={onSave} fullWidth />
      </View>
    </View>
  );
};
