import { ImagePreviewModal } from "@/components/media/ImagePreviewModal";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { P } from "@/components/ui/Typography";
import { SetTypePill } from "@/components/ui/workout/SeriesBuilder/components/SetTypePill";
import type { SetType } from "@/entities/program/types";
import type { Exercise } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Hourglass, Lightbulb, Target, Timer } from "lucide-react-native"; // 👈 added Target
import React from "react";
import { Image, Pressable, View } from "react-native";

export const ExerciseItem: React.FC<{
  exercise: Exercise;
  index: number;
  code: string; // e.g. "A1"
}> = ({ exercise, index, code }) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const surface = useThemeColor({}, "surface");
  const surfaceElevated = useThemeColor({}, "surfaceElevated");
  const tint = useThemeColor({}, "tint");
  const primary = useThemeColor({}, "primary");
  const icon = useThemeColor({}, "icon");

  const noteText = (exercise.trainerNote || "").trim();
  const sets = exercise.sets ?? [];
  const tempoString = (exercise.tempo ?? []).join("/");

  const [noteOpen, setNoteOpen] = React.useState(false);
  const [tempoOpen, setTempoOpen] = React.useState(false);
  const [imgOpen, setImgOpen] = React.useState(false);
  const [targetsOpen, setTargetsOpen] = React.useState(false); // 👈 new

  const thumbSize = 48;

  return (
    <View style={{ gap: 10 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 8,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: outline,
            backgroundColor: surfaceElevated,
            flex: 1,
          }}
        >
          {/* Code chip */}
          <View
            style={{
              minWidth: 36,
              paddingHorizontal: 8,
              height: 24,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: tint,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <P style={{ color: tint, fontWeight: "800", fontSize: 12 }}>
              {code}
            </P>
          </View>

          {/* Title */}
          <View style={{ flex: 1 }}>
            <P
              style={{ color: text, fontWeight: "800", fontSize: 15 }}
              numberOfLines={1}
            >
              {exercise.title || `Exercise ${index + 1}`}
            </P>
          </View>

          {/* Thumbnail */}
          <Pressable
            onPress={() => setImgOpen(true)}
            style={{
              width: thumbSize,
              height: thumbSize,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: outline,
              overflow: "hidden",
              backgroundColor: surface,
            }}
          >
            {exercise.imageUrl ? (
              <Image
                source={{ uri: exercise.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : null}
          </Pressable>
        </View>

        {/* 👇 ALWAYS show Target button (like the lightbulb style) */}
        <Pressable
          onPress={() => setTargetsOpen(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 50,
            padding: 8,
          }}
        >
          <Target size={20} color={icon} />
        </Pressable>

        {/* Note button (only if note exists) */}
        {noteText ? (
          <Pressable
            onPress={() => setNoteOpen(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: outline,
              borderRadius: 50,
              padding: 8,
            }}
          >
            <Lightbulb size={20} color={icon} />
          </Pressable>
        ) : null}
      </View>

      {/* Sets */}
      <View style={{ paddingTop: 6, gap: 8 }}>
        {sets.length === 0 ? (
          <P style={{ color: muted, fontSize: 12 }}>No sets.</P>
        ) : (
          sets.map((st) => (
            <View
              key={st.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: outline,
                backgroundColor: surface,
                gap: 10,
              }}
            >
              <SetTypePill value={st.type as SetType} mode="info" />
              <P style={{ color: text, fontWeight: "600", flexShrink: 1 }}>
                Reps {st.reps}
              </P>
              <View
                style={{
                  marginLeft: "auto",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Timer size={14} color={muted} />
                <P style={{ color: text, fontWeight: "600" }}>{st.rest}s</P>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Tempo row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 2,
          borderWidth: 1,
          borderColor: outline,
          borderRadius: 10,
          padding: 8,
        }}
      >
        <Pressable
          onPress={() => setTempoOpen(true)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: outline,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: surface,
          }}
        >
          {Hourglass ? (
            <Hourglass size={14} color={text} />
          ) : (
            <Timer size={14} color={text} />
          )}
        </Pressable>

        <P style={{ color: primary, fontSize: 12 }}>Tempo</P>
        <P style={{ color: primary, fontSize: 12, marginLeft: "auto" }}>
          {tempoString}
        </P>
      </View>

      {/* Sheets */}
      <BottomSheet
        open={tempoOpen}
        onClose={() => setTempoOpen(false)}
        title="Tempo guide"
        infoText={
          "Eccentric / Bottom Pause / Concentric / Top Pause.\n" +
          "Use numbers in seconds (e.g., 3/0/1/0). X is for explosiveness (≈ 0s)."
        }
      />

      {/* 👇 Targets sheet with chips (read-only display) */}
      <BottomSheet
        open={targetsOpen}
        onClose={() => setTargetsOpen(false)}
        title="Target muscles"
      >
        <View style={{ paddingHorizontal: 8, paddingVertical: 6 }}>
          {exercise.targetMuscles?.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {exercise.targetMuscles.map((t) => (
                <View
                  key={t}
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: outline,
                    backgroundColor: tint,
                  }}
                >
                  <P style={{ color: "#fff", fontSize: 12 }}>{t}</P>
                </View>
              ))}
            </View>
          ) : (
            <P style={{ color: muted, fontSize: 12 }}>No targets selected.</P>
          )}
        </View>
      </BottomSheet>

      <ImagePreviewModal
        visible={imgOpen}
        uri={exercise.imageUrl}
        onRequestClose={() => setImgOpen(false)}
        isEditable={false}
      />

      <BottomSheet
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        title="Trainer’s note"
        infoText={noteText}
      />
    </View>
  );
};
