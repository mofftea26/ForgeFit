import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Field, FieldProps } from "./Field";

export type NumberStepperProps = Omit<FieldProps, "children"> & {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

export const NumberStepper: React.FC<NumberStepperProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onChange,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  unit,
}) => {
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const primary = useThemeColor({}, "primarySoft");
  const bg = surface;

  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  const Btn: React.FC<{
    children: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
  }> = ({ children, onPress, disabled }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: disabled ? surface : bg,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          color: text,
          fontFamily: "WorkSans_600SemiBold",
          fontSize: 16,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Btn onPress={dec} disabled={value <= min}>
          −
        </Btn>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: outline,
            backgroundColor: surface,
            minWidth: 90,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: text,
              fontFamily: "WorkSans_600SemiBold",
              fontSize: 16,
            }}
          >
            {value}
          </Text>
          {unit ? (
            <Text
              style={{
                color: primary,
                fontFamily: "WorkSans_600SemiBold",
                fontSize: 14,
              }}
            >
              {unit}
            </Text>
          ) : null}
        </View>
        <Btn onPress={inc} disabled={value >= max}>
          +
        </Btn>
      </View>
    </Field>
  );
};
