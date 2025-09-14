import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Switch, Text, View, ViewStyle } from "react-native";
import { Field, FieldProps } from "./Field";

export type ToggleProps = Omit<FieldProps, "children"> & {
  value: boolean;
  onValueChange: (v: boolean) => void;
  style?: ViewStyle;
};

export const Toggle: React.FC<ToggleProps> = ({
  label,
  helper,
  error,
  required,
  value,
  onValueChange,
  style,
}) => {
  const text = useThemeColor({}, "text");
  const tint = useThemeColor({}, "primarySoft");

  return (
    <Field
      label={label}
      helper={helper}
      error={error}
      required={required}
      style={style}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "transparent",
          paddingVertical: 6,
        }}
      >
        <Text
          style={{
            color: text,
            fontFamily: "WorkSans_400Regular",
            fontSize: 16,
          }}
        >
          {value ? "On" : "Off"}
        </Text>
        <Switch
          trackColor={{ false: "#aaa", true: tint }}
          thumbColor={"#fff"}
          value={value}
          onValueChange={onValueChange}
        />
      </View>
    </Field>
  );
};
