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
  Text,
  View,
} from "react-native";

import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { TempoInputs } from "@/components/ui/forms/Tempo";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import { useThemeColor } from "@/hooks/use-theme-color";

import type { SetType } from "@/entities/program/types";
import type { Exercise } from "@/entities/program/zod";
import { useExerciseOps } from "../hooks/useExerciseOps";
import { SetTypePill } from "./SetTypePill";
import { TargetsChips } from "./TargetsChips";

type Props = {
  code: string; // e.g., "A1"
  value: Exercise;
  onPatch: (patch: Partial<Exercise>) => void;
  onRemove: () => void;
  dayTargets: string[];
};

export const ExerciseCard: React.FC<Props> = ({
  code,
  value,
  onPatch,
  onRemove,
  dayTargets,
}) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const muted = useThemeColor({}, "muted");
  const primarySoft = useThemeColor({}, "primarySoft");
  const sheetBg = useThemeColor({}, "surface");
  const sheetOutline = useThemeColor({}, "outline");

  const {
    noteOpen,
    setNoteOpen,
    titleHeight,
    setTitleMeasuredHeight,
    pickImage,
    addSet,
    removeSet,
    patchSet,
  } = useExerciseOps(value, onPatch);

  const onTitleLayout = (e: LayoutChangeEvent) =>
    setTitleMeasuredHeight(e.nativeEvent.layout.height);

  // Image box: square; slightly smaller than title height for compactness
  const imageSide = Math.max(44, Math.round(titleHeight * 0.65));

  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: primarySoft,
        borderRadius: 12,
        padding: 10,
        paddingTop: 12,
        gap: 8,
        backgroundColor: surface,
      }}
    >
      {/* Exercise trash in top-right corner */}
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        style={{ position: "absolute", top: 8, right: 8, padding: 6 }}
      >
        <Trash2 size={16} color={muted} />
      </Pressable>

      {/* Code row: A1 + bulb on left */}
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

      {/* Title + Image aligned bottom */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 8 }}>
        <View style={{ flex: 1 }} onLayout={onTitleLayout}>
          <TextField
            label="Exercise"
            value={value.title}
            onChangeText={(t) => onPatch({ title: t })}
            required
            style={{ fontSize: 14 }}
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
          {value.imageUrl ? (
            <Image
              source={{ uri: value.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <ImageIcon size={18} color={muted} />
          )}
        </Pressable>
      </View>

      {/* Targets */}
      <TargetsChips
        options={dayTargets}
        value={value.targetMuscles ?? []}
        onToggle={(val: string) => {
          const has = (value.targetMuscles ?? []).includes(val);
          const next = has
            ? (value.targetMuscles ?? []).filter((v) => v !== val)
            : [...(value.targetMuscles ?? []), val];
          onPatch({ targetMuscles: next });
        }}
      />

      {/* Sets (full width; smaller controls) */}
      <View style={{ gap: 6 }}>
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

        {(value.sets ?? []).length === 0 ? (
          <Text style={{ color: muted, fontSize: 12 }}>No sets yet.</Text>
        ) : (
          (value.sets ?? []).map((st) => (
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

              <View style={{ flex: 1, transform: [{ scale: 0.92 }] }}>
                <NumberInput
                  label=""
                  value={st.reps}
                  onChange={(n) => patchSet(st.id, { reps: n })}
                  min={1}
                  max={99}
                />
              </View>

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

      {/* Tempo (smaller) */}
      <View style={{ transform: [{ scale: 0.93 }], alignSelf: "flex-start" }}>
        <TempoInputs
          label="Tempo"
          value={value.tempo as any}
          onChange={(t: any) => onPatch({ tempo: t as any })}
        />
      </View>

      {/* Trainer note preview */}
      {!!value.trainerNote && (
        <Text style={{ color: muted, fontSize: 12 }}>
          Note: {value.trainerNote}
        </Text>
      )}

      {/* Trainer note modal */}
      <Modal visible={!!(useExerciseOps as any)._noop && false} />

      {/* Controlled modal */}
      {noteOpen && (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setNoteOpen(false)}
        >
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
                value={value.trainerNote ?? ""}
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
      )}
    </View>
  );
};
