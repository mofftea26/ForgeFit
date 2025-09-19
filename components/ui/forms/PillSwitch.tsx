import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, View } from "react-native";
import { P } from "../Typography";
import { Field, FieldProps } from "./Field";

export type PillOption<T extends string | number> = { label: string; value: T };
export type PillSwitchProps<T extends string | number = string> = Omit<
  FieldProps,
  "children"
> & {
  options: PillOption<T>[];
  value: T;
  onChange: (v: T) => void;
};

export function PillSwitch<T extends string | number>({
  label,
  helper,
  error,
  required,
  options,
  value,
  onChange,
}: PillSwitchProps<T>) {
  const bg = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const primary = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: outline,
          borderRadius: 999,
          padding: 4,
        }}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <Pressable
              key={`${opt.value}`}
              onPress={() => onChange(opt.value)}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                backgroundColor: active ? primary : "transparent",
                alignItems: "center",
              }}
            >
              <P
                style={{
                  color: active ? "#fff" : text,
                  fontFamily: "WorkSans_600SemiBold",
                }}
              >
                {opt.label}
              </P>
            </Pressable>
          );
        })}
      </View>
    </Field>
  );
}
