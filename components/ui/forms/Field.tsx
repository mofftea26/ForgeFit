import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View, ViewStyle } from "react-native";
import { P } from "../Typography";

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
        <P
          style={{
            color: text,
            fontFamily: "WorkSans_600SemiBold",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          {label} {required ? <P style={{ color: accentAlt }}>*</P> : null}
        </P>
      ) : null}

      {children}

      {error ? (
        <P
          style={{
            color: accentAlt,
            marginTop: 6,
            fontFamily: "WorkSans_400Regular",
            fontSize: 12,
          }}
        >
          {error}
        </P>
      ) : helper ? (
        <P
          style={{
            color: muted,
            marginTop: 6,
            fontFamily: "WorkSans_400Regular",
            fontSize: 12,
          }}
        >
          {helper}
        </P>
      ) : null}
    </View>
  );
};
