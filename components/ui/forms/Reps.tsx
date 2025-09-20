import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, View } from "react-native";
import { P } from "../Typography";
import { Field, FieldProps } from "./Field";
import { TextField } from "./TextField";

export type RepsSetsFieldProps = Omit<FieldProps, "children"> & {
  value: number[]; // e.g. [12,12,10,10]
  onChange: (reps: number[]) => void;
  maxSets?: number;
};

export const RepsSetsField: React.FC<RepsSetsFieldProps> = ({
  label = "Reps (per set)",
  helper,
  error,
  required,
  value,
  onChange,
  maxSets = 12,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primarySoft");
  const accentAlt = useThemeColor({}, "accentAlt");

  const setAt = (i: number, v: string) => {
    const n = Number(v.replace(/[^\d]/g, ""));
    const next = [...value];
    next[i] = Number.isFinite(n) ? n : 0;
    onChange(next);
  };

  const addSet = () => {
    if (value.length >= maxSets) return;
    onChange([...value, value[value.length - 1] ?? 10]);
  };

  const removeSet = (i: number) => {
    const next = value.filter((_, idx) => idx !== i);
    onChange(next);
  };

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {value.map((val, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              borderWidth: 1,
              borderColor: outline,
              backgroundColor: surface,
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
          >
            <P style={{ color: muted, fontFamily: "WorkSans_600SemiBold" }}>
              Set {i + 1}
            </P>
            <TextField
              value={String(val ?? "")}
              onChangeText={(t) => setAt(i, t)}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={muted}
              style={{
                minWidth: 40,
                color: text,
                fontFamily: "WorkSans_600SemiBold",
                fontSize: 16,
                textAlign: "center",
                paddingVertical: 2,
              }}
            />
            <Pressable onPress={() => removeSet(i)}>
              <P
                style={{ color: accentAlt, fontFamily: "WorkSans_600SemiBold" }}
              >
                ×
              </P>
            </Pressable>
          </View>
        ))}

        <Pressable
          onPress={addSet}
          style={{
            borderWidth: 1,
            borderColor: outline,
            backgroundColor: "transparent",
            borderStyle: "dashed",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <P style={{ color: primary, fontFamily: "WorkSans_600SemiBold" }}>
            + Add set
          </P>
        </Pressable>
      </View>
    </Field>
  );
};
