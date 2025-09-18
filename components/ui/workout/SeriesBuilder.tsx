import * as ImagePicker from "expo-image-picker";
import { Image as ImageIcon, Lightbulb, Trash2 } from "lucide-react-native";
import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { TempoInputs } from "@/components/ui/forms/Tempo";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import { useThemeColor } from "@/hooks/use-theme-color";

import { SetTypes } from "@/entities/program/constants";
import type { SetType } from "@/entities/program/types";
import type { Exercise, Series } from "@/entities/program/zod";

// RN-safe id (or import your exported id() if available)
const rid = () => Math.random().toString(36).slice(2, 10).toUpperCase();

type Props = {
  value: Series[];
  onChange: (next: Series[]) => void;
  /** Day-level targets to present as toggle chips in exercises */
  selectedTargets: string[];
};

export function SeriesBuilder({ value, onChange, selectedTargets }: Props) {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const muted = useThemeColor({}, "muted");

  const bump = (next: Series[]) => onChange(next);
  const autoSeriesLabel = (idx: number) =>
    String.fromCharCode("A".charCodeAt(0) + idx);

  const addSeries = () => {
    const label = autoSeriesLabel(value.length);
    const nextSeries: Series = { id: rid(), label, items: [], trainerNote: "" };
    bump([...value, nextSeries]);
  };

  const removeSeries = (seriesId: string) =>
    bump(value.filter((s) => s.id !== seriesId));

  const addExercise = (seriesIndex: number) => {
    const next = value.map((s, i) => {
      if (i !== seriesIndex) return s;
      const newExercise: Exercise = {
        id: rid(),
        title: "",
        imageUrl: "",
        sets: [],
        tempo: ["3", "0", "1", "0"],
        targetMuscles: [],
        trainerNote: "",
      };
      return { ...s, items: [...s.items, newExercise] };
    });
    bump(next);
  };

  const patchExercise = (
    seriesIndex: number,
    exId: string,
    patch: Partial<Exercise>
  ) => {
    const next = value.map((s, i) => {
      if (i !== seriesIndex) return s;
      return {
        ...s,
        items: s.items.map((e) => (e.id === exId ? { ...e, ...patch } : e)),
      };
    });
    bump(next);
  };

  return (
    <View style={{ gap: 12 }}>
      {value.map((s, si) => (
        <View
          key={s.id}
          style={{
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 12,
            padding: 12,
            backgroundColor: surface,
            gap: 10,
          }}
        >
          {/* Header: "Series A" + remove (auto label) */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: text, fontWeight: "700", fontSize: 16 }}>
              Series {autoSeriesLabel(si)}
            </Text>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => removeSeries(s.id)} hitSlop={8}>
              <Trash2 size={18} color={muted} />
            </Pressable>
          </View>

          {/* Exercises list */}
          <View style={{ gap: 10 }}>
            {s.items.length === 0 ? (
              <Text style={{ color: muted }}>No exercises.</Text>
            ) : (
              s.items.map((ex, ei) => (
                <ExerciseRow
                  key={ex.id}
                  code={`${autoSeriesLabel(si)}${ei + 1}`} // A1, A2 / B1, B2 ...
                  ex={ex}
                  onPatch={(patch) => patchExercise(si, ex.id, patch)}
                  dayTargets={selectedTargets}
                />
              ))
            )}
          </View>

          <Button title="Add exercise" onPress={() => addExercise(si)} />
        </View>
      ))}

      <Button title="Add series" variant="primary" onPress={addSeries} />
    </View>
  );
}

/* ===================================== Exercise Row ===================================== */

const ExerciseRow: React.FC<{
  code: string; // e.g., "A1"
  ex: Exercise;
  onPatch: (patch: Partial<Exercise>) => void;
  dayTargets: string[];
}> = ({ code, ex, onPatch, dayTargets }) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const muted = useThemeColor({}, "muted");
  const primarySoft = useThemeColor({}, "primarySoft");

  const [noteOpen, setNoteOpen] = React.useState(false);

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      onPatch({ imageUrl: res.assets[0].uri });
    }
  }

  /* -------------------- Sets helpers -------------------- */

  const addSet = () =>
    onPatch({
      sets: [
        ...(ex.sets ?? []),
        { id: rid(), type: "working" as SetType, reps: 10, rest: 60 },
      ],
    });

  const removeSet = (setId: string) =>
    onPatch({ sets: (ex.sets ?? []).filter((s) => s.id !== setId) });

  const patchSet = (
    setId: string,
    patch: Partial<{ type: SetType; reps: number; rest: number }>
  ) =>
    onPatch({
      sets: (ex.sets ?? []).map((s) =>
        s.id === setId ? { ...s, ...patch } : s
      ),
    });

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 10,
        padding: 10,
        gap: 10,
        backgroundColor: surface,
      }}
    >
      {/* Exercise code line (A1) + note button (light bulb) */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: text,
            fontWeight: "700",
            fontSize: 14,
          }}
        >
          {code}
        </Text>

        <Pressable onPress={() => setNoteOpen(true)} hitSlop={8}>
          <Lightbulb size={18} color={muted} />
        </Pressable>
      </View>

      {/* Title + Image aligned in one row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField
            label="Exercise"
            value={ex.title}
            onChangeText={(t) => onPatch({ title: t })}
            required
          />
        </View>

        <Pressable
          onPress={pickImage}
          style={{
            width: 54,
            height: 54,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: outline,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {ex.imageUrl ? (
            <Image
              source={{ uri: ex.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <ImageIcon size={20} color={muted} />
          )}
        </Pressable>
      </View>

      {/* Targets chips (always visible) */}
      <TargetsChips
        options={dayTargets}
        value={ex.targetMuscles ?? []}
        onToggle={(val) => {
          const has = (ex.targetMuscles ?? []).includes(val);
          const next = has
            ? (ex.targetMuscles ?? []).filter((v) => v !== val)
            : [...(ex.targetMuscles ?? []), val];
          onPatch({ targetMuscles: next });
        }}
      />

      {/* Sets table: header ONCE, then rows */}
      <View style={{ gap: 6 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 4,
            marginBottom: 2,
          }}
        >
          <Text
            style={{
              width: 56,
              color: muted,
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            Type
          </Text>
          <Text
            style={{
              width: 40,
              color: muted,
              fontWeight: "600",
            }}
          >
            {/* trash column */}
          </Text>
          <Text
            style={{
              width: 88,
              color: muted,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Reps
          </Text>
          <Text
            style={{
              width: 96,
              color: muted,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Rest
          </Text>
          <View style={{ flex: 1 }} />
        </View>

        {/* Rows */}
        {(ex.sets ?? []).length === 0 ? (
          <Text style={{ color: muted, marginLeft: 4 }}>No sets yet.</Text>
        ) : (
          (ex.sets ?? []).map((st) => (
            <View
              key={st.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Type circle select */}
              <SetTypePill
                value={st.type as SetType}
                onChange={(t) => patchSet(st.id, { type: t })}
              />

              {/* Trash close to the left */}
              <Pressable onPress={() => removeSet(st.id)} hitSlop={8}>
                <Trash2 size={18} color={muted} />
              </Pressable>

              <View style={{ width: 88 }}>
                <NumberInput
                  label=""
                  value={st.reps}
                  onChange={(n) => patchSet(st.id, { reps: n })}
                  min={1}
                  max={99}
                  step={1}
                />
              </View>

              <View style={{ width: 96 }}>
                <NumberInput
                  label=""
                  value={st.rest}
                  onChange={(n) => patchSet(st.id, { rest: n })}
                  min={0}
                  max={600}
                  step={5}
                  unit="s"
                />
              </View>

              <View style={{ flex: 1 }} />
            </View>
          ))
        )}

        <Button title="Add set" variant="ghost" onPress={addSet} />
      </View>

      {/* Tempo AFTER sets */}
      <TempoInputs
        label="Tempo"
        value={ex.tempo as any}
        onChange={(t: any) => onPatch({ tempo: t as any })}
      />

      {/* Trainer note display (small, bottom) */}
      {!!ex.trainerNote && (
        <Text style={{ color: muted, fontSize: 12 }}>
          Note: {ex.trainerNote}
        </Text>
      )}

      {/* Trainer note modal */}
      <Modal visible={noteOpen} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#111827",
              padding: 14,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "65%",
              gap: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Trainer's Note
            </Text>
            <TextArea
              label=""
              value={ex.trainerNote ?? ""}
              onChangeText={(t) => onPatch({ trainerNote: t })}
              placeholder="Cues, ranges, breathing, intent…"
              multiline
              style={{ minHeight: 120, textAlignVertical: "top" }}
            />
            <Button
              title="Close"
              variant="ghost"
              onPress={() => setNoteOpen(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ================================== Set Type Controls ================================== */

const SetTypePill: React.FC<{
  value: SetType;
  onChange: (v: SetType) => void;
}> = ({ value, onChange }) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");

  const [open, setOpen] = React.useState(false);

  const CurrentIcon = SetTypes[value]?.icon ?? ImageIcon;

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          width: 36,
          height: 36,
          borderRadius: 36,
          borderWidth: 1,
          borderColor: outline,
          backgroundColor: tint,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CurrentIcon size={18} color="#fff" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#111827",
              padding: 14,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
            }}
          >
            <ScrollView contentContainerStyle={{ gap: 10 }}>
              {Object.entries(SetTypes).map(([key, meta]) => {
                const Icon = meta.icon;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => {
                      onChange(key as SetType);
                      setOpen(false);
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Icon size={20} color="#fff" />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          marginBottom: 2,
                        }}
                      >
                        {meta.title}
                      </Text>
                      <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                        {meta.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={{ height: 10 }} />
            <Button
              title="Close"
              variant="ghost"
              onPress={() => setOpen(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

/* ==================================== Targets Chips ==================================== */

const TargetsChips: React.FC<{
  options: string[];
  value: string[];
  onToggle: (val: string) => void;
}> = ({ options, value, onToggle }) => {
  const outline = useThemeColor({}, "outline");
  const tint = useThemeColor({}, "primarySoft");
  const text = useThemeColor({}, "text");

  if (!options?.length) return null;

  return (
    <View>
      <Text style={{ color: text, fontWeight: "600", marginBottom: 6 }}>
        Target muscles
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: active ? tint : "transparent",
              }}
            >
              <Text style={{ color: active ? "#fff" : text }}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
