import * as Haptics from "expo-haptics";
import { Image as ImageIcon } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { P } from "@/components/ui/Typography";
import { SetTypes } from "@/entities/program/constants";
import type { SetType } from "@/entities/program/types";
import { useThemeColor } from "@/hooks/use-theme-color";

type Mode = "select" | "info";

export const SetTypePill: React.FC<{
  value: SetType;
  onChange?: (v: SetType) => void; // optional in info mode
  mode?: Mode; // "select" (default) | "info"
}> = ({ value, onChange, mode = "select" }) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");
  const sheetOutline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");
  const onTint = useThemeColor({}, "onTint");

  const [open, setOpen] = React.useState(false);
  const CurrentIcon = SetTypes[value]?.icon ?? ImageIcon;

  const openSheet = async () => {
    setOpen(true);
    await Haptics.selectionAsync();
  };

  return (
    <>
      <TouchableOpacity
        onPress={openSheet}
        style={{
          width: 36,
          height: 36,
          borderRadius: 36,
          borderWidth: 1,
          borderColor: outline,
          backgroundColor: tint,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CurrentIcon size={16} color={onTint} />
      </TouchableOpacity>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={mode === "info" ? SetTypes[value].title : "Choose a set type"}
        infoText={mode === "info" ? SetTypes[value].description : undefined}
      >
        {mode === "select" ? (
          <ScrollView contentContainerStyle={{ gap: 8, padding: 12 }}>
            {Object.entries(SetTypes).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={async () => {
                    onChange?.(key as SetType);
                    setOpen(false);
                    await Haptics.selectionAsync();
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: sheetOutline,
                    borderRadius: 12,
                    padding: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Icon size={18} color={text} />
                  <View style={{ flex: 1 }}>
                    <P
                      style={{
                        color: text,
                        fontWeight: "700",
                        marginBottom: 2,
                        fontSize: 14,
                      }}
                    >
                      {meta.title}
                    </P>
                    <P style={{ color: muted, fontSize: 13 }}>
                      {meta.description}
                    </P>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}
      </BottomSheet>
    </>
  );
};
