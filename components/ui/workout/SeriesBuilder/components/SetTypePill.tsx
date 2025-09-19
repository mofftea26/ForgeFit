import * as Haptics from "expo-haptics";
import { Image as ImageIcon } from "lucide-react-native";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SetTypes } from "@/entities/program/constants";
import type { SetType } from "@/entities/program/types";
import { useThemeColor } from "@/hooks/use-theme-color";

export const SetTypePill: React.FC<{
  value: SetType;
  onChange: (v: SetType) => void;
}> = ({ value, onChange }) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");
  const sheetBg = useThemeColor({}, "surface");
  const sheetOutline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");

  const [open, setOpen] = React.useState(false);

  const CurrentIcon = SetTypes[value]?.icon ?? ImageIcon;

  return (
    <>
      <TouchableOpacity
        onPress={async () => {
          setOpen(true);
          await Haptics.selectionAsync();
        }}
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
        <CurrentIcon size={16} color="#fff" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: sheetBg,
              padding: 12,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
              borderWidth: 1,
              borderColor: sheetOutline,
            }}
          >
            <ScrollView contentContainerStyle={{ gap: 8 }}>
              {Object.entries(SetTypes).map(([key, meta]) => {
                const Icon = meta.icon;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={async () => {
                      onChange(key as SetType);
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
                      <Text
                        style={{
                          color: text,
                          fontWeight: "700",
                          marginBottom: 2,
                          fontSize: 14,
                        }}
                      >
                        {meta.title}
                      </Text>
                      <Text style={{ color: muted, fontSize: 13 }}>
                        {meta.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={{ height: 8 }} />
            <Pressable
              onPress={() => setOpen(false)}
              style={{
                padding: 12,
                alignItems: "center",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: sheetOutline,
              }}
            >
              <Text style={{ color: text, fontWeight: "600" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};
