import { TextArea } from "@/components/ui/forms/TextArea";
import { P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { BottomSheet } from "../../../BottomSheet";

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
  const text = useThemeColor({}, "text");

  return (
    <BottomSheet open={open} onClose={onClose}>
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
    </BottomSheet>
  );
}
