import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Field, FieldProps } from "./Field";

export type NumberInputProps = Omit<FieldProps, "children"> & {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onChange,
  min = -1e9,
  max = 1e9,
  step = 1,
  unit,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primarySoft");

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const setFromText = (t: string) => {
    const n = Number(t.replace(/[^\d.-]/g, ""));
    onChange(Number.isFinite(n) ? clamp(n) : 0);
  };

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          borderWidth: 1,
          borderColor: outline,
          borderRadius: 12,
          backgroundColor: surface,
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <Pressable onPress={() => onChange(clamp(value - step))}>
          <Text
            style={{
              color: primary,
              fontFamily: "WorkSans_600SemiBold",
              fontSize: 18,
            }}
          >
            −
          </Text>
        </Pressable>
        <TextInput
          value={String(value)}
          onChangeText={setFromText}
          keyboardType="numeric"
          style={{
            flex: 1,
            textAlign: "center",
            color: text,
            fontFamily: "WorkSans_600SemiBold",
            fontSize: 16,
            paddingVertical: 4,
          }}
          placeholderTextColor={muted}
        />
        {unit ? (
          <Text style={{ color: muted, fontFamily: "WorkSans_600SemiBold" }}>
            {unit}
          </Text>
        ) : null}
        <Pressable onPress={() => onChange(clamp(value + step))}>
          <Text
            style={{
              color: primary,
              fontFamily: "WorkSans_600SemiBold",
              fontSize: 18,
            }}
          >
            +
          </Text>
        </Pressable>
      </View>
    </Field>
  );
};
