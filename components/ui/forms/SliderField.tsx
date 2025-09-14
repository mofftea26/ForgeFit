import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, View } from "react-native";
import { Field, FieldProps } from "./Field";
// install: pnpm expo install expo-slider
import Slider from "@react-native-community/slider"; // if you use expo-slider, change import to 'expo-slider'

export type SliderFieldProps = Omit<FieldProps, "children"> & {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  unit?: string;
};

export const SliderField: React.FC<SliderFieldProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  unit,
}) => {
  const primary = useThemeColor({}, "primarySoft");
  const tint = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Slider
          style={{ flex: 1, height: 40 }}
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={primary}
          maximumTrackTintColor={muted}
          thumbTintColor={tint}
        />
        {showValue ? (
          <Text
            style={{
              color: text,
              width: 60,
              textAlign: "right",
              fontFamily: "WorkSans_600SemiBold",
            }}
          >
            {value}
            {unit ? ` ${unit}` : ""}
          </Text>
        ) : null}
      </View>
    </Field>
  );
};
