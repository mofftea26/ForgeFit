import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import {
  Image as ImageIcon,
  Lightbulb,
  Plus,
  Trash2,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  LayoutChangeEvent,
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
  const primaryTint = useThemeColor({}, "primaryTint");
  const primarySoft = useThemeColor({}, "primarySoft");
  const bump = (next: Series[]) => onChange(next);
  const autoSeriesLabel = (idx: number) =>
    String.fromCharCode("A".charCodeAt(0) + idx);

  const addSeries = async () => {
    const label = autoSeriesLabel(value.length);
    const nextSeries: Series = { id: rid(), label, items: [], trainerNote: "" };
    bump([...value, nextSeries]);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeSeries = async (seriesId: string) => {
    bump(value.filter((s) => s.id !== seriesId));
    await Haptics.selectionAsync();
  };

  const addExercise = async (seriesIndex: number) => {
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
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const removeExercise = async (seriesIndex: number, exId: string) => {
    const next = value.map((s, i) =>
      i !== seriesIndex
        ? s
        : { ...s, items: s.items.filter((e) => e.id !== exId) }
    );
    bump(next);
    await Haptics.selectionAsync();
  };

  return (
    <View style={{ gap: 10 }}>
      {value.map((s, si) => (
        <View
          key={s.id}
          style={{
            borderWidth: 1,
            borderColor: primaryTint,
            borderRadius: 12,
            padding: 10,
            backgroundColor: surface,
            gap: 10,
          }}
        >
          {/* Header: "Series A" (auto) + remove */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: text, fontWeight: "700", fontSize: 14 }}>
              Series {autoSeriesLabel(si)}
            </Text>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => removeSeries(s.id)} hitSlop={8}>
              <Trash2 size={16} color={muted} />
            </Pressable>
          </View>

          {/* Exercises list */}
          <View style={{ gap: 8 }}>
            {s.items.length === 0 ? (
              <Text style={{ color: muted, fontSize: 13 }}>No exercises.</Text>
            ) : (
              s.items.map((ex, ei) => (
                <ExerciseRow
                  key={ex.id}
                  code={`${autoSeriesLabel(si)}${ei + 1}`} // A1, A2 / B1, B2 ...
                  ex={ex}
                  onPatch={(patch) => patchExercise(si, ex.id, patch)}
                  onRemove={() => removeExercise(si, ex.id)} // ✅ exercise-level trash
                  dayTargets={selectedTargets}
                />
              ))
            )}
          </View>

          {/* smaller ghost + Add exercise */}
          <Pressable
            onPress={() => addExercise(si)}
            style={{
              alignSelf: "flex-start",
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: outline,
              opacity: 0.9,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={14} color={muted} />
            <Text style={{ color: muted, fontSize: 13 }}>Add exercise</Text>
          </Pressable>
        </View>
      ))}

      {/* smaller primary + Add series */}
      <Pressable
        onPress={addSeries}
        style={{
          alignSelf: "flex-start",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: outline,
          backgroundColor: primarySoft,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Plus size={14} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 13 }}>Add series</Text>
      </Pressable>
    </View>
  );
}

/* ===================================== Exercise Row ===================================== */

const ExerciseRow: React.FC<{
  code: string; // e.g., "A1"
  ex: Exercise;
  onPatch: (patch: Partial<Exercise>) => void;
  onRemove: () => void; // ✅ remove exercise
  dayTargets: string[];
}> = ({ code, ex, onPatch, onRemove, dayTargets }) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const muted = useThemeColor({}, "muted");
  const primarySoft = useThemeColor({}, "primarySoft");
  const sheetBg = useThemeColor({}, "surface");
  const sheetOutline = useThemeColor({}, "outline");

  const [noteOpen, setNoteOpen] = React.useState(false);
  const [titleH, setTitleH] = React.useState(52); // measured height of title area

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled && res.assets?.[0]?.uri) {
      onPatch({ imageUrl: res.assets[0].uri });
      await Haptics.selectionAsync();
    }
  }

  const onTitleLayout = (e: LayoutChangeEvent) => {
    const h = Math.max(44, Math.round(e.nativeEvent.layout.height));
    setTitleH(h);
  };

  /* -------------------- Sets helpers -------------------- */

  const addSet = async () => {
    onPatch({
      sets: [
        ...(ex.sets ?? []),
        { id: rid(), type: "working" as SetType, reps: 10, rest: 60 },
      ],
    });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeSet = async (setId: string) => {
    onPatch({ sets: (ex.sets ?? []).filter((s) => s.id !== setId) });
    await Haptics.selectionAsync();
  };

  const patchSet = async (
    setId: string,
    patch: Partial<{ type: SetType; reps: number; rest: number }>
  ) => {
    onPatch({
      sets: (ex.sets ?? []).map((s) =>
        s.id === setId ? { ...s, ...patch } : s
      ),
    });
    await Haptics.selectionAsync();
  };

  const imageSide = titleH * 0.65; // keep image square, match title block height

  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: primarySoft, // primary border
        borderRadius: 12,
        padding: 10,
        paddingTop: 12,
        gap: 8,
        backgroundColor: surface,
      }}
    >
      {/* Absolute exercise trash in top-right corner */}
      <Pressable
        onPress={async () => {
          await Haptics.selectionAsync();
          onRemove();
        }}
        hitSlop={8}
        style={{ position: "absolute", top: 8, right: 8, padding: 6 }}
      >
        <Trash2 size={16} color={muted} />
      </Pressable>

      {/* Code row: A1 + note (lightbulb) on the left */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ color: text, fontWeight: "700", fontSize: 13 }}>
            {code}
          </Text>
          <Pressable onPress={() => setNoteOpen(true)} hitSlop={8}>
            <Lightbulb size={16} color={muted} />
          </Pressable>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      {/* Title + Image aligned to bottom; image matches title height & square */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
        <View style={{ flex: 1 }} onLayout={onTitleLayout}>
          <TextField
            label="Exercise"
            value={ex.title}
            onChangeText={(t) => onPatch({ title: t })}
            required
            style={{ fontSize: 14 }} // slightly smaller
          />
        </View>

        <Pressable
          onPress={pickImage}
          style={{
            width: imageSide,
            height: imageSide,
            borderRadius: 10,
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
            <ImageIcon size={18} color={muted} />
          )}
        </Pressable>
      </View>

      {/* Targets chips (always visible) */}
      <TargetsChips
        options={dayTargets}
        value={ex.targetMuscles ?? []}
        onToggle={async (val) => {
          const has = (ex.targetMuscles ?? []).includes(val);
          const next = has
            ? (ex.targetMuscles ?? []).filter((v) => v !== val)
            : [...(ex.targetMuscles ?? []), val];
          onPatch({ targetMuscles: next });
          await Haptics.selectionAsync();
        }}
      />

      {/* Sets section: use full width; smaller inputs via transform scale */}
      <View style={{ gap: 6 }}>
        {/* Header (use flex so it spans full width) */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Text
            style={{ width: 52, color: muted, fontWeight: "600", fontSize: 12 }}
          >
            Type
          </Text>
          <Text
            style={{
              flex: 1,
              color: muted,
              fontWeight: "600",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Reps
          </Text>
          <Text
            style={{
              flex: 1,
              color: muted,
              fontWeight: "600",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Rest
          </Text>
          <Text style={{ width: 28, color: "transparent" }}>.</Text>
        </View>

        {(ex.sets ?? []).length === 0 ? (
          <Text style={{ color: muted, fontSize: 12 }}>No sets yet.</Text>
        ) : (
          (ex.sets ?? []).map((st) => (
            <View
              key={st.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                width: "100%",
              }}
            >
              <SetTypePill
                value={st.type as SetType}
                onChange={(t) => patchSet(st.id, { type: t })}
              />

              {/* Reps (smaller via transform), takes half of remaining width */}
              <View style={{ flex: 1, transform: [{ scale: 0.92 }] }}>
                <NumberInput
                  label=""
                  value={st.reps}
                  onChange={(n) => patchSet(st.id, { reps: n })}
                  max={99}
                />
              </View>

              {/* Rest (smaller via transform), takes half of remaining width */}
              <View style={{ flex: 1, transform: [{ scale: 0.92 }] }}>
                <NumberInput
                  label=""
                  value={st.rest}
                  onChange={(n) => patchSet(st.id, { rest: n })}
                  min={0}
                  max={600}
                  unit="s"
                />
              </View>

              {/* trash can at end of row (type-reps-rest-trash) */}
              <Pressable
                onPress={() => removeSet(st.id)}
                hitSlop={8}
                style={{ width: 28, alignItems: "center" }}
              >
                <Trash2 size={16} color={muted} />
              </Pressable>
            </View>
          ))
        )}

        {/* Smaller "+ Add set" button */}
        <Pressable
          onPress={addSet}
          style={{
            alignSelf: "flex-start",
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: outline,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginTop: 2,
          }}
        >
          <Plus size={12} color={muted} />
          <Text style={{ color: muted, fontSize: 12 }}>Add set</Text>
        </Pressable>
      </View>

      {/* Tempo AFTER sets — slightly smaller via scaling */}
      <View style={{ transform: [{ scale: 0.93 }], alignSelf: "flex-start" }}>
        <TempoInputs
          label="Tempo"
          value={ex.tempo as any}
          onChange={async (t: any) => {
            onPatch({ tempo: t as any });
            await Haptics.selectionAsync();
          }}
        />
      </View>

      {/* Trainer note display (small, bottom) */}
      {!!ex.trainerNote && (
        <Text style={{ color: muted, fontSize: 12 }}>
          Note: {ex.trainerNote}
        </Text>
      )}

      {/* Trainer note modal — themed */}
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
              backgroundColor: sheetBg,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "65%",
              borderWidth: 1,
              borderColor: sheetOutline,
              padding: 12,
              gap: 8,
            }}
          >
            <Text style={{ color: text, fontWeight: "700", fontSize: 15 }}>
              Trainer&apos;s Note
            </Text>
            <TextArea
              label=""
              value={ex.trainerNote ?? ""}
              onChangeText={(t) => onPatch({ trainerNote: t })}
              placeholder="Cues, ranges, breathing, intent…"
              multiline
              style={{ minHeight: 110, textAlignVertical: "top" }}
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
  const text = useThemeColor({}, "text");
  const sheetBg = useThemeColor({}, "surface");
  const sheetOutline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");

  const [open, setOpen] = React.useState(false);

  const CurrentIcon = SetTypes[value]?.icon ?? ImageIcon;

  return (
    <>
      {/* circular type selector */}
      <TouchableOpacity
        onPress={async () => {
          setOpen(true);
          await Haptics.selectionAsync();
        }}
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
        <CurrentIcon size={16} color="#fff" />
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
              backgroundColor: sheetBg,
              padding: 12,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
              borderWidth: 1,
              borderColor: sheetOutline,
            }}
          >
            <ScrollView contentContainerStyle={{ gap: 8 }}>
              {Object.entries(SetTypes).map(([key, meta]) => {
                const Icon = meta.icon;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={async () => {
                      onChange(key as SetType);
                      setOpen(false);
                      await Haptics.selectionAsync();
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: sheetOutline,
                      borderRadius: 12,
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Icon size={18} color={text} />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: text,
                          fontWeight: "700",
                          marginBottom: 2,
                          fontSize: 14,
                        }}
                      >
                        {meta.title}
                      </Text>
                      <Text style={{ color: muted, fontSize: 13 }}>
                        {meta.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={{ height: 8 }} />
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
      <Text
        style={{
          color: text,
          fontWeight: "600",
          marginBottom: 6,
          fontSize: 13,
        }}
      >
        Target muscles
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: active ? tint : "transparent",
              }}
            >
              <Text style={{ color: active ? "#fff" : text, fontSize: 12 }}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
