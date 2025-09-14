import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Text, View, ViewStyle } from "react-native";

export type FieldProps = {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
};

export const Field: React.FC<FieldProps> = ({
  label,
  helper,
  error,
  required,
  style,
  children,
}) => {
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const accentAlt = useThemeColor({}, "accentAlt");

  return (
    <View style={[{ width: "100%" }, style]}>
      {label ? (
        <Text
          style={{
            color: text,
            fontFamily: "WorkSans_600SemiBold",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          {label}{" "}
          {required ? <Text style={{ color: accentAlt }}>*</Text> : null}
        </Text>
      ) : null}

      {children}

      {error ? (
        <Text
          style={{
            color: accentAlt,
            marginTop: 6,
            fontFamily: "WorkSans_400Regular",
            fontSize: 12,
          }}
        >
          {error}
        </Text>
      ) : helper ? (
        <Text
          style={{
            color: muted,
            marginTop: 6,
            fontFamily: "WorkSans_400Regular",
            fontSize: 12,
          }}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
};
