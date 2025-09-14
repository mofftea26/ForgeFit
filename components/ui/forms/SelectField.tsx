import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Field, FieldProps } from "./Field";

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
  const sheetBg = useThemeColor({}, "background");

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
        <Text
          style={{
            color: selected ? text : muted,
            fontFamily: "WorkSans_400Regular",
            fontSize: 16,
          }}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Text>
      </Pressable>

      <Modal visible={open} animationType="slide" transparent>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: "#0007" }}
        />
        <View
          style={{
            maxHeight: "70%",
            backgroundColor: sheetBg,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 12,
          }}
        >
          <View
            style={{
              height: 4,
              width: 40,
              backgroundColor: outline,
              borderRadius: 4,
              alignSelf: "center",
              marginBottom: 12,
            }}
          />
          {searchable ? (
            <TextInput
              placeholder="Search…"
              placeholderTextColor={muted}
              value={q}
              onChangeText={setQ}
              autoFocus={Platform.OS !== "android"} // avoid auto keyboard popping weirdness
              style={{
                borderColor: outline,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
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
                    <Text
                      style={{
                        color: active ? "#fff" : text,
                        fontFamily: "WorkSans_600SemiBold",
                        fontSize: 16,
                      }}
                    >
                      {item.label}
                    </Text>
                    {item.description ? (
                      <Text
                        style={{
                          color: active ? "#fff" : muted,
                          fontFamily: "WorkSans_400Regular",
                          fontSize: 12,
                        }}
                      >
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
          />
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              padding: 12,
              alignItems: "center",
              marginTop: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: outline,
            }}
          >
            <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Field>
  );
}
