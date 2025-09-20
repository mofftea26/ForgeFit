import { Info } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";

import { useThemeColor } from "@/hooks/use-theme-color";
import { H3, P } from "../Typography";
import { Field, type FieldProps } from "./Field";
import { TextField } from "./TextField";

type TempoTuple = [string, string, string, string];

export type TempoInputsProps = Omit<FieldProps, "children" | "helper"> & {
  value: TempoTuple; // ["3","0","1","0"] or "X" allowed in any slot
  onChange: (t: TempoTuple) => void;
};

export const TempoInputs: React.FC<TempoInputsProps> = ({
  label = "Tempo",
  error,
  required,
  value,
  onChange,
  style,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const sheetBg = useThemeColor({}, "background");
  const icon = useThemeColor({}, "icon");
  const [openInfo, setOpenInfo] = useState(false);

  // sanitize: allow digits or 'X'/'x'; keep max length 2 (so "10" is fine, "X" is 1)
  const setAt = (i: number, raw: string) => {
    let t = raw.toUpperCase();
    // allow only digits and a single 'X'
    t = t.replace(/[^0-9X]/g, "");
    // prevent values like "XX" (keep first char if both X)
    if (t.length >= 2 && t[0] === "X") t = "X";
    // trim to 2 chars for numeric, 1 for X
    if (t.startsWith("X")) t = "X";
    else if (t.length > 2) t = t.slice(0, 2);

    const next: TempoTuple = [...value] as any;
    next[i] = t;
    onChange(next);
  };

  const Box: React.FC<{
    index: 0 | 1 | 2 | 3;
    placeholder?: string;
  }> = ({ index, placeholder }) => (
    <TextField
      value={value[index]}
      onChangeText={(t) => setAt(index, t)}
      // default keyboard so 'X' is typeable on both platforms
      keyboardType="default"
      autoCapitalize="characters"
      placeholder={placeholder}
      placeholderTextColor={muted}
      maxLength={2}
      style={{
        width: 48,
        textAlign: "center",
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 10,
        backgroundColor: surface,
        color: text,
        paddingVertical: 8,
        fontFamily: "WorkSans_600SemiBold",
        fontSize: 16,
      }}
    />
  );

  const Slash = () => (
    <P style={{ color: muted, fontSize: 18, marginHorizontal: 6 }}>/</P>
  );

  // Info content (same tone as your SelectField modal)
  const infoText = useMemo(
    () =>
      "Tempo format: Eccentric / Bottom Pause / Concentric / Top Pause.\n" +
      "Use numbers in seconds (e.g., 3/0/1/0). Use X for explosive (≈ 0 sec).",
    []
  );

  return (
    <Field
      /* no helper text; we do our own info icon */ error={error}
      required={required}
      style={style}
    >
      {/* Header row with label + info icon */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <P
          style={{
            color: text,
            fontFamily: "WorkSans_600SemiBold",
            fontSize: 14,
            flexShrink: 1,
          }}
        >
          {label}{" "}
          {required ? <P style={{ color: muted, opacity: 0.9 }}>*</P> : null}
        </P>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => setOpenInfo(true)}
          hitSlop={8}
          style={{ padding: 4 }}
        >
          <Info size={16} color={muted} />
        </Pressable>
      </View>

      {/* Inputs */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Box index={0} placeholder="Ecc" />
        <Slash />
        <Box index={1} placeholder="Pause" />
        <Slash />
        <Box index={2} placeholder="Con" />
        <Slash />
        <Box index={3} placeholder="Pause" />
      </View>

      {/* Info modal */}
      <Modal visible={openInfo} animationType="slide" transparent>
        <Pressable
          onPress={() => setOpenInfo(false)}
          style={{ flex: 1, backgroundColor: "#0007" }}
        />
        <View
          style={{
            maxHeight: "60%",
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
          <H3
            style={{
              color: text,
              fontFamily: "WorkSans_600SemiBold",
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            Tempo guide
          </H3>
          <P
            style={{
              color: icon,
              fontFamily: "WorkSans_400Regular",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            {infoText}
          </P>

          <Pressable
            onPress={() => setOpenInfo(false)}
            style={{
              padding: 12,
              alignItems: "center",
              marginTop: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: outline,
            }}
          >
            <P style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
              Close
            </P>
          </Pressable>
        </View>
      </Modal>
    </Field>
  );
};
