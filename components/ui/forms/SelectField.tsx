import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, Pressable, View } from "react-native";
import { BottomSheet } from "../BottomSheet";
import { P } from "../Typography";
import { Field, FieldProps } from "./Field";
import { TextField } from "./TextField";

export type SelectOption<T extends string | number> = {
  label: string;
  value: T;
  description?: string;
  icon?: React.ReactNode;
};

export type SelectFieldProps<T extends string | number> = Omit<
  FieldProps,
  "children"
> & {
  options: SelectOption<T>[];
  value?: T;
  onChange: (v: T) => void;
  placeholder?: string;
  searchable?: boolean;
};

export function SelectField<T extends string | number>({
  label,
  helper,
  error,
  required,
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchable = true,
}: SelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const bg = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");
  const tint = useThemeColor({}, "primarySoft");
  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!q) return options;
    const qq = q.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(qq) ||
        (o.description?.toLowerCase().includes(qq) ?? false)
    );
  }, [q, options]);

  return (
    <Field label={label} helper={helper} error={error} required={required}>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          backgroundColor: bg,
          borderColor: outline,
          borderWidth: 1,
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 12,
          minHeight: 48,
          justifyContent: "center",
        }}
      >
        <P
          style={{
            color: selected ? text : muted,
            fontFamily: "WorkSans_400Regular",
            fontSize: 16,
          }}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </P>
      </Pressable>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        scrollable={false}
      >
        <View style={{ gap: 12 }}>
          {searchable ? (
            <TextField
              placeholder="Search…"
              placeholderTextColor={muted}
              value={q}
              onChangeText={setQ}
              autoFocus={Platform.OS !== "android"}
              style={{
                borderColor: outline,
                borderRadius: 12,
                marginBottom: 8,
                color: text,
                fontFamily: "WorkSans_400Regular",
              }}
            />
          ) : null}
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => {
              const active = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: active ? tint : "transparent",
                    marginVertical: 4,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {item.icon}
                  <View style={{ flex: 1 }}>
                    <P
                      style={{
                        color: active ? "#fff" : text,
                        fontFamily: "WorkSans_600SemiBold",
                        fontSize: 16,
                      }}
                    >
                      {item.label}
                    </P>
                    {item.description ? (
                      <P
                        style={{
                          color: active ? "#fff" : muted,
                          fontFamily: "WorkSans_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {item.description}
                      </P>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </BottomSheet>
    </Field>
  );
}
