import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/forms/TextArea";
import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Modal, View } from "react-native";

export function NoteSheet({
  open,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  value: string;
  onChange: (t: string) => void;
  onClose: () => void;
}) {
  const sheetBg = useThemeColor({}, "surface");
  const sheetOutline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
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
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "65%",
            borderWidth: 1,
            borderColor: sheetOutline,
            padding: 12,
            gap: 8,
          }}
        >
          <P style={{ color: text, fontWeight: "700", fontSize: 15 }}>
            Trainer&apos;s Note
          </P>
          <TextArea
            label=""
            value={value}
            onChangeText={onChange}
            placeholder="Cues, ranges, breathing, intent…"
            multiline
            style={{ minHeight: 110, textAlignVertical: "top" }}
          />
          <Button title="Close" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
