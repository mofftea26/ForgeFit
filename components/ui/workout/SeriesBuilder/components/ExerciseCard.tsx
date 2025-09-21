import { ImagePreviewModal } from "@/components/media/ImagePreviewModal";
import { P } from "@/components/ui/Typography";
import { TempoInputs } from "@/components/ui/forms/Tempo";
import { TextField } from "@/components/ui/forms/TextField";
import type { SetType } from "@/entities/program/types";
import type { Exercise } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image as ImageIcon, Lightbulb, Trash2 } from "lucide-react-native";
import React from "react";
import { Image, LayoutChangeEvent, Pressable, View } from "react-native";
import { useExerciseOps } from "../hooks/useExerciseOps";
import { NoteSheet } from "./NoteSheet";
import { SetsTable } from "./SetsTable";
import { TargetsChips } from "./TargetsChips";

type Props = {
  code: string;
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
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const muted = useThemeColor({}, "muted");
  const primarySoft = useThemeColor({}, "primarySoft");
  const outline = useThemeColor({}, "outline");
  const hasNote = !!value.trainerNote?.trim();

  const {
    noteOpen,
    setNoteOpen,
    imageSide,
    setTitleMeasuredHeight,
    addSet,
    removeSet,
    patchSet,
  } = useExerciseOps(value, onPatch);

  const onTitleLayout = (e: LayoutChangeEvent) =>
    setTitleMeasuredHeight(e.nativeEvent.layout.height);

  // 👇 controls the preview modal
  const [imgOpen, setImgOpen] = React.useState(false);

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
      {/* Top-right remove */}
      <Pressable
        onPress={onRemove}
        hitSlop={8}
        style={{ position: "absolute", top: 8, right: 8, padding: 6 }}
      >
        <Trash2 size={16} color={muted} />
      </Pressable>

      {/* Header (code + note) */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <P style={{ color: text, fontWeight: "700", fontSize: 13 }}>{code}</P>
          <Pressable
            onPress={() => setNoteOpen(true)}
            hitSlop={8}
            style={{ position: "relative" }}
          >
            <Lightbulb
              size={16}
              color={hasNote ? primarySoft : muted}
              // Optional: a subtle "glow" effect when note exists
              style={
                hasNote
                  ? {
                      shadowColor: primarySoft,
                      shadowOpacity: 0.6,
                      shadowRadius: 6,
                    }
                  : undefined
              }
            />
            {/* Optional tiny dot badge when note exists */}
            {hasNote && (
              <View
                style={{
                  position: "absolute",
                  right: -2,
                  top: -2,
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: primarySoft,
                }}
              />
            )}
          </Pressable>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      {/* Title + thumbnail (opens modal) */}
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

        {/* Thumbnail that opens preview modal */}
        <Pressable
          onPress={() => setImgOpen(true)}
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
        onToggle={(val) => {
          const has = (value.targetMuscles ?? []).includes(val);
          const next = has
            ? (value.targetMuscles ?? []).filter((v) => v !== val)
            : [...(value.targetMuscles ?? []), val];
          onPatch({ targetMuscles: next });
        }}
      />

      {/* Sets */}
      <SetsTable
        sets={(value.sets as any) ?? []}
        onAdd={addSet}
        onPatch={(id, patch) =>
          patchSet(
            id,
            patch as Partial<{ type: SetType; reps: number; rest: number }>
          )
        }
        onRemove={removeSet}
      />

      {/* Tempo */}
      <View style={{ transform: [{ scale: 0.93 }], alignSelf: "flex-start" }}>
        <TempoInputs
          label="Tempo"
          value={value.tempo as any}
          onChange={(t: any) => onPatch({ tempo: t as any })}
        />
      </View>

      {!!value.trainerNote && (
        <P style={{ color: muted, fontSize: 12 }}>
          {hasNote ? "Note:" : "Trainer note:"} {value.trainerNote}
        </P>
      )}

      {/* Note modal */}
      <NoteSheet
        open={noteOpen}
        value={value.trainerNote ?? ""}
        onChange={(t) => onPatch({ trainerNote: t })}
        onClose={() => setNoteOpen(false)}
      />

      {/* ✅ Image Preview Modal (edits + preview) */}
      <ImagePreviewModal
        visible={imgOpen}
        uri={value.imageUrl}
        onRequestClose={() => setImgOpen(false)}
        onChange={(nextUri) => {
          onPatch({ imageUrl: nextUri });
          setImgOpen(false);
        }}
      />
    </View>
  );
};
