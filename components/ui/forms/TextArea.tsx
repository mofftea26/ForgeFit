import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { Field, FieldProps } from "./Field";

export type TextAreaProps = Omit<FieldProps, "children"> &
  Omit<TextInputProps, "style" | "onChangeText"> & {
    value?: string;
    onChangeText?: (t: string) => void;
    rows?: number;
    style?: TextInputProps["style"];
  };

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onChangeText,
  rows = 4,
  style,
  ...rest
}) => {
  const bg = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={rows}
        placeholderTextColor={muted}
        style={[
          {
            backgroundColor: bg,
            borderColor: outline,
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: text,
            fontFamily: "WorkSans_400Regular",
            fontSize: 16,
            textAlignVertical: "top",
            minHeight: rows * 22 + 20,
          },
          style,
        ]}
        {...rest}
      />
    </Field>
  );
};
