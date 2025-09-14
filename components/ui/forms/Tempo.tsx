import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, TextInput, View } from "react-native";
import { Field, FieldProps } from "./Field";

type TempoTuple = [string, string, string, string];

export type TempoInputsProps = Omit<FieldProps, "children"> & {
  value: TempoTuple; // ["3","0","1","0"]
  onChange: (t: TempoTuple) => void;
};

export const TempoInputs: React.FC<TempoInputsProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onChange,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const setAt = (i: number, v: string) => {
    const next: TempoTuple = [...value] as any;
    next[i] = v.replace(/[^\d]/g, "");
    onChange(next);
  };

  const Box: React.FC<{
    index: 0 | 1 | 2 | 3;
    placeholder?: string;
  }> = ({ index, placeholder }) => (
    <TextInput
      value={value[index]}
      onChangeText={(t) => setAt(index, t)}
      keyboardType="number-pad"
      placeholder={placeholder}
      placeholderTextColor={muted}
      maxLength={2}
      style={{
        width: 48,
        textAlign: "center",
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 10,
        backgroundColor: surface,
        color: text,
        paddingVertical: 8,
        fontFamily: "WorkSans_600SemiBold",
        fontSize: 16,
      }}
    />
  );

  const Slash = () => (
    <Text style={{ color: muted, fontSize: 18, marginHorizontal: 6 }}>/</Text>
  );

  return (
    <Field
      label={label ?? "Tempo"}
      helper={helper ?? "Eccentric / Bottom Pause / Concentric / Top Pause"}
      error={error}
      required={required}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Box index={0} placeholder="Ecc" />
        <Slash />
        <Box index={1} placeholder="Pause" />
        <Slash />
        <Box index={2} placeholder="Con" />
        <Slash />
        <Box index={3} placeholder="Pause" />
      </View>
    </Field>
  );
};
