import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Field, FieldProps } from "./Field";

export type TextFieldProps = Omit<FieldProps, "children"> &
  Omit<TextInputProps, "style" | "onChangeText"> & {
    value?: string;
    onChangeText?: (t: string) => void;
    left?: React.ReactNode;
    right?: React.ReactNode;
    placeholder?: string;
    style?: TextInputProps["style"];
  };

export const TextField: React.FC<TextFieldProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onChangeText,
  left,
  right,
  placeholder,
  style,
  ...inputProps
}) => {
  const bg = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const primary = useThemeColor({}, "primarySoft");
  const muted = useThemeColor({}, "muted");

  const [focused, setFocused] = useState(false);
  const border = useSharedValue(0);
  const aStyle = useAnimatedStyle(() => ({
    borderColor: border.value ? primary : outline,
    borderWidth: 1,
  }));

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <Animated.View
        style={[
          {
            backgroundColor: bg,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
          },
          aStyle,
        ]}
      >
        {left ? <View style={{ marginRight: 8 }}>{left}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={muted}
          onFocus={() => {
            setFocused(true);
            border.value = withTiming(1, { duration: 120 });
          }}
          onBlur={() => {
            setFocused(false);
            border.value = withTiming(0, { duration: 120 });
          }}
          style={[
            {
              flex: 1,
              color: text,
              fontFamily: "WorkSans_400Regular",
              fontSize: 16,
              paddingVertical: 2,
            },
            style,
          ]}
          {...inputProps}
        />
        {right ? (
          <Pressable style={{ marginLeft: 8 }}>{right}</Pressable>
        ) : null}
      </Animated.View>
    </Field>
  );
};
