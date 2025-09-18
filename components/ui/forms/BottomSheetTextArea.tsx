// components/forms/BottomSheetTextArea.tsx
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo, useState } from "react";
import { StyleProp, TextInputProps, TextStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Field, FieldProps } from "./Field";

export type BottomSheetTextAreaProps = Omit<FieldProps, "children"> &
  Omit<
    TextInputProps,
    "style" | "onChangeText" | "multiline" | "numberOfLines"
  > & {
    value?: string;
    onChangeText?: (t: string) => void;
    rows?: number; // starting rows (default 4)
    minRows?: number; // min rows when autoGrow=true
    maxRows?: number; // max rows when autoGrow=true
    autoGrow?: boolean; // default true
    scrollInside?: boolean; // allow inner scrolling (default false so sheet scrolls)
    style?: StyleProp<TextStyle>;
  };

export const BottomSheetTextArea = forwardRef<
  React.ComponentRef<typeof BottomSheetTextInput>,
  BottomSheetTextAreaProps
>(
  (
    {
      label,
      helper,
      error,
      required,
      value,
      onChangeText,
      rows = 4,
      minRows,
      maxRows,
      autoGrow = true,
      scrollInside = false,
      style,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const bg = useThemeColor({}, "surface");
    const text = useThemeColor({}, "text");
    const outline = useThemeColor({}, "outline");
    const muted = useThemeColor({}, "muted");
    const primary = useThemeColor({}, "primarySoft");

    // Border focus animation
    const border = useSharedValue(0);
    const aStyle = useAnimatedStyle(() => ({
      borderColor: border.value ? primary : outline,
      borderWidth: 1,
      borderRadius: 14,
      backgroundColor: bg,
    }));

    // Auto-grow height logic
    const lineHeight = 22; // keep in sync with fontSize/lineHeight
    const verticalPad = 10 + 10; // paddingVertical top+bottom
    const baseMinRows = useMemo(
      () => Math.max(rows, minRows ?? rows),
      [rows, minRows]
    );
    const baseMaxRows = useMemo(
      () => Math.max(baseMinRows, maxRows ?? 12),
      [baseMinRows, maxRows]
    );

    const minHeight = baseMinRows * lineHeight + verticalPad;
    const maxHeight = baseMaxRows * lineHeight + verticalPad;

    const [height, setHeight] = useState<number>(minHeight);

    return (
      <Field label={label} helper={helper} error={error} required={required}>
        <Animated.View
          style={[{ paddingHorizontal: 12, paddingVertical: 10 }, aStyle]}
        >
          <BottomSheetTextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={muted}
            multiline
            // Let the sheet handle scrolling by default
            scrollEnabled={scrollInside}
            // Focus styles
            onFocus={() => (border.value = withTiming(1, { duration: 120 }))}
            onBlur={() => (border.value = withTiming(0, { duration: 120 }))}
            // Auto-grow (no inner scroll until max)
            onContentSizeChange={(e) => {
              if (!autoGrow) return;
              const next = e.nativeEvent.contentSize.height;
              // clamp height between min/max (prevents jumpy sheet)
              const clamped = Math.max(
                minHeight,
                Math.min(next + 2, maxHeight)
              );
              setHeight(clamped);
            }}
            style={[
              {
                // Text styles
                color: text,
                fontFamily: "WorkSans_400Regular",
                fontSize: 16,
                lineHeight,
                textAlignVertical: "top",
                // Box sizing
                minHeight,
                ...(autoGrow ? { height } : { height: minHeight }),
              },
              style,
            ]}
            // Quality-of-life defaults (override via ...rest)
            numberOfLines={rows}
            returnKeyType="default"
            blurOnSubmit={false}
            {...rest}
          />
        </Animated.View>
      </Field>
    );
  }
);

BottomSheetTextArea.displayName = "BottomSheetTextArea";
export default BottomSheetTextArea;
