import { ImagePreviewModal } from "@/components/media/ImagePreviewModal";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SetTypePill } from "@/components/ui/workout/SeriesBuilder/components/SetTypePill";
import type { SetType } from "@/entities/program/types";
import type { Exercise } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Hourglass, Lightbulb, Timer } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

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
  const icon = useThemeColor({}, "icon"); // for icons
  const noteText = (exercise.trainerNote || "").trim();
  const [noteOpen, setNoteOpen] = React.useState(false);
  const sets = exercise.sets ?? [];
  const tempoString = (exercise.tempo ?? []).join("/");

  const [tempoOpen, setTempoOpen] = React.useState(false);
  const [imgOpen, setImgOpen] = React.useState(false);

  const thumbSize = 48;

  return (
    <View style={{ gap: 10 }}>
      {/* Header row — subtle emphasis (no loud tint): elevated bg + tint border chip */}
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
          {/* Code chip with subtle accent */}
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
            <Text style={{ color: tint, fontWeight: "800", fontSize: 12 }}>
              {code}
            </Text>
          </View>

          {/* Title */}
          <View style={{ flex: 1 }}>
            <Text
              style={{ color: text, fontWeight: "800", fontSize: 15 }}
              numberOfLines={1}
            >
              {exercise.title || `Exercise ${index + 1}`}
            </Text>
          </View>

          {/* Thumbnail (opens preview, not editable here) */}
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
      {/* Space before sets so header never touches following content */}
      <View style={{ paddingTop: 6, gap: 8 }}>
        {/* Vertical sets: compact row with balanced spacing (no wasted right space) */}
        {sets.length === 0 ? (
          <Text style={{ color: muted, fontSize: 12 }}>No sets.</Text>
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
              {/* type icon (info mode) */}
              <SetTypePill value={st.type as SetType} mode="info" />

              {/* reps (takes available space) */}
              <Text style={{ color: text, fontWeight: "600", flexShrink: 1 }}>
                Reps {st.reps}
              </Text>

              {/* right-side rest (tight, no extra whitespace) */}
              <View
                style={{
                  marginLeft: "auto",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Timer size={14} color={muted} />
                <Text style={{ color: text, fontWeight: "600" }}>
                  {st.rest}s
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Tempo row + unified bottom sheet */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginTop: 2,
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

        <Text style={{ color: muted, fontSize: 12 }}>Tempo</Text>
        <Text style={{ color: text, fontWeight: "700" }}>{tempoString}</Text>
      </View>

      <BottomSheet
        open={tempoOpen}
        onClose={() => setTempoOpen(false)}
        title="Tempo guide"
        infoText={
          "Eccentric / Bottom Pause / Concentric / Top Pause.\n" +
          "Use numbers in seconds (e.g., 3/0/1/0). X is for explosiveness (≈ 0s)."
        }
      />

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
