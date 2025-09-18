// components/forms/BottomSheetTextField.tsx
import { useThemeColor } from "@/hooks/use-theme-color";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { forwardRef, useState } from "react";
import { Pressable, TextInputProps, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Field, FieldProps } from "./Field";

export type BottomSheetTextFieldProps = Omit<FieldProps, "children"> &
  Omit<TextInputProps, "style" | "onChangeText"> & {
    value?: string;
    onChangeText?: (t: string) => void;
    left?: React.ReactNode;
    right?: React.ReactNode;
    placeholder?: string;
    style?: TextInputProps["style"];
  };

export const BottomSheetTextField = forwardRef<
  React.ComponentRef<typeof BottomSheetTextInput>,
  BottomSheetTextFieldProps
>(
  (
    {
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
      multiline,
      numberOfLines,
      ...inputProps
    },
    ref
  ) => {
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
              paddingVertical: multiline ? 8 : 10,
              flexDirection: "row",
              alignItems: multiline ? "flex-start" : "center",
            },
            aStyle,
          ]}
        >
          {left ? <View style={{ marginRight: 8 }}>{left}</View> : null}

          <BottomSheetTextInput
            ref={ref}
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
            // important for multiline inside bottom sheet
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines ?? 3 : undefined}
            textAlignVertical={multiline ? "top" : "center"}
            // nice defaults; override via ...inputProps
            returnKeyType={multiline ? "default" : "done"}
            blurOnSubmit={!multiline}
            style={[
              {
                flex: 1,
                color: text,
                fontFamily: "WorkSans_400Regular",
                fontSize: 16,
                paddingVertical: multiline ? 6 : 2,
                // Android caret highlight looks better with slight radius:
                borderRadius: 8,
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
  }
);

BottomSheetTextField.displayName = "BottomSheetTextField";
export default BottomSheetTextField;
