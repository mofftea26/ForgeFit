import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { P } from "../Typography";
import { Field, FieldProps } from "./Field";
import { TextField } from "./TextField";

export type TagPickerProps = Omit<FieldProps, "children"> & {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
};

export const TagPicker: React.FC<TagPickerProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onChange,
  placeholder = "Add tag and press Enter",
  maxTags,
}) => {
  const [draft, setDraft] = useState("");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const primary = useThemeColor({}, "primarySoft");
  const bg = surface;

  const add = () => {
    const t = draft.trim();
    if (!t) return;
    if (maxTags && value.length >= maxTags) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  };
  const remove = (t: string) => onChange(value.filter((x) => x !== t));

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      {/* input */}
      <View
        style={{
          borderColor: outline,
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 8,
          backgroundColor: bg,
        }}
      >
        <TextField
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={add}
          placeholder={placeholder}
          placeholderTextColor={muted}
          style={{
            color: text,
            fontFamily: "WorkSans_400Regular",
            fontSize: 16,
            paddingVertical: 2,
          }}
        />
      </View>

      {/* chips */}
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}
      >
        {value.map((t) => (
          <View
            key={t}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: primary,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <P style={{ color: "#fff", fontFamily: "WorkSans_600SemiBold" }}>
              {t}
            </P>
            <Pressable onPress={() => remove(t)}>
              <P style={{ color: "#fff", fontFamily: "WorkSans_600SemiBold" }}>
                ×
              </P>
            </Pressable>
          </View>
        ))}
      </View>
    </Field>
  );
};
