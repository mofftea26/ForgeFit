import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Field, FieldProps } from "./Field";

export type MultiOption<T extends string | number> = {
  label: string;
  value: T;
};

export type MultiSelectFieldProps<T extends string | number> = Omit<
  FieldProps,
  "children"
> & {
  options: MultiOption<T>[];
  value: T[];
  onChange: (v: T[]) => void;
  placeholder?: string;
  searchable?: boolean;
};

export function MultiSelectField<T extends string | number>({
  label,
  helper,
  error,
  required,
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchable = true,
}: MultiSelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const bg = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");
  const tint = useThemeColor({}, "primarySoft");
  const sheetBg = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, 12);
  const selectedLabels = useMemo(
    () =>
      options
        .filter((o) => value.includes(o.value))
        .map((o) => o.label)
        .join(", "),
    [options, value]
  );

  const filtered = useMemo(() => {
    if (!q) return options;
    const qq = q.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(qq));
  }, [q, options]);

  const toggle = (v: T) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };

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
            color: selectedLabels ? text : muted,
            fontFamily: "WorkSans_400Regular",
            fontSize: 16,
          }}
          numberOfLines={1}
        >
          {selectedLabels || placeholder}
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
            data={filtered}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => {
              const active = value.includes(item.value);
              return (
                <Pressable
                  onPress={() => toggle(item.value)}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: active ? tint : "transparent",
                    marginVertical: 4,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: active ? "#fff" : text,
                      fontFamily: "WorkSans_600SemiBold",
                      fontSize: 16,
                    }}
                  >
                    {item.label}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  ) : null}
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
              marginBottom: safeBottom,
            }}
          >
            <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
              Done
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Field>
  );
}
