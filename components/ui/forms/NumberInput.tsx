import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Field, FieldProps } from "./Field";

export type NumberInputProps = Omit<FieldProps, "children"> & {
  value?: number; // allow undefined when blank
  onChange: (v?: number) => void;
  min?: number;
  max?: number;
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
  unit,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  // local string state to allow blanks
  const [internal, setInternal] = useState(value?.toString() ?? "");

  useEffect(() => {
    // sync external changes into internal string
    if (value === undefined) {
      setInternal("");
    } else {
      setInternal(value.toString());
    }
  }, [value]);

  const handleChange = (t: string) => {
    setInternal(t);
    if (t.trim() === "") {
      onChange(undefined); // blank
      return;
    }
    const n = Number(t);
    if (Number.isFinite(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
    }
  };

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          borderWidth: 1,
          borderColor: outline,
          borderRadius: 12,
          backgroundColor: surface,
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <TextInput
          value={internal}
          onChangeText={handleChange}
          keyboardType="numeric"
          style={{
            flex: 1,
            textAlign: "center",
            color: text,
            fontFamily: "WorkSans_600SemiBold",
            fontSize: 16,
            paddingVertical: 4,
          }}
          placeholder="—"
          placeholderTextColor={muted}
        />
        {unit ? (
          <Text style={{ color: muted, fontFamily: "WorkSans_600SemiBold" }}>
            {unit}
          </Text>
        ) : null}
      </View>
    </Field>
  );
};
