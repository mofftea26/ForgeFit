import { ImagePreviewModal } from "@/components/media/ImagePreviewModal";
import { P } from "@/components/ui/Typography";
import { Day } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as Haptics from "expo-haptics";
import {
  Dumbbell,
  Image as ImageIcon,
  Moon,
  Timer,
  Trash2,
} from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";

type Props = {
  days: Day[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddWorkout: () => void;
  onAddRest: () => void;
  onRemoveDay: (id: string) => void;
  onChangeDayImage?: (id: string, uri: string) => void;
};

export const DaysPanel: React.FC<Props> = ({
  days,
  selectedId,
  onSelect,
  onAddWorkout,
  onAddRest,
  onRemoveDay,
  onChangeDayImage,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");
  const tint = useThemeColor({}, "primarySoft");
  const primaryTint = useThemeColor({}, "primaryTint");

  // preview modal state
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewUri, setPreviewUri] = React.useState<string | undefined>();
  const [previewDayId, setPreviewDayId] = React.useState<string | undefined>();

  const openPreview = (dayId: string, uri?: string) => {
    setPreviewDayId(dayId);
    setPreviewUri(uri);
    setPreviewOpen(true);
  };
  const closePreview = () => setPreviewOpen(false);

  const onAddWorkoutPress = async () => {
    onAddWorkout();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const onAddRestPress = async () => {
    onAddRest();
    await Haptics.selectionAsync();
  };
  const onSelectPress = async (id: string) => {
    onSelect(id);
    await Haptics.selectionAsync();
  };
  const onRemovePress = async (id: string) => {
    onRemoveDay(id);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={{ gap: 8 }}>
      {/* Divider above */}
      <View
        style={{
          height: 1,
          backgroundColor: outline,
          opacity: 0.6,
          marginBottom: 6,
        }}
      />

      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 2,
        }}
      >
        <P
          style={{
            color: text,
            fontFamily: "WorkSans_600SemiBold",
            fontSize: 14,
          }}
        >
          Days
        </P>

        <View style={{ flex: 1 }} />

        {/* + Workout (round) */}
        <Pressable
          onPress={onAddWorkoutPress}
          hitSlop={8}
          style={{
            width: 32,
            height: 32,
            borderRadius: 32,
            borderWidth: 1,
            borderColor: outline,
            backgroundColor: tint,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
          }}
        >
          <Dumbbell size={15} color="#fff" />
        </Pressable>

        {/* + Rest (round, ghost) */}
        <Pressable
          onPress={onAddRestPress}
          hitSlop={8}
          style={{
            width: 32,
            height: 32,
            borderRadius: 32,
            borderWidth: 1,
            borderColor: outline,
            backgroundColor: surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Moon size={15} color={primary} />
        </Pressable>
      </View>

      {/* Window container (smaller, vertical scroll) */}
      <View
        style={{
          borderWidth: 1,
          borderColor: outline,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: surface,
          height: 180, // smaller window height
        }}
      >
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={{ padding: 8, gap: 6 }}
          showsVerticalScrollIndicator
        >
          {days.length === 0 ? (
            <P style={{ color: muted, fontSize: 13 }}>
              No days yet. Use the buttons above to add workout or rest days.
            </P>
          ) : (
            days.map((d, idx) => {
              const active = d.id === selectedId;
              const baseCard = {
                borderWidth: 1,
                borderColor: active ? primary : outline,
                backgroundColor: active ? primaryTint : surface,
                borderRadius: 12,
                paddingVertical: 8, // tighter
                paddingHorizontal: 10,
              } as const;

              // Make rest day clickable too
              if (d.type === "rest") {
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => onSelectPress(d.id)}
                    style={[baseCard, { opacity: 0.95 }]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Left: icon (no border) + "Rest" */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Moon size={18} color={muted} />
                        </View>
                        <P
                          style={{
                            color: active ? "#fff" : text,
                            fontFamily: "WorkSans_600SemiBold",
                          }}
                        >
                          Rest
                        </P>
                      </View>

                      {/* Trash */}
                      <Pressable
                        onPress={() => onRemovePress(d.id)}
                        hitSlop={8}
                      >
                        <Trash2 size={16} color={active ? "#fff" : text} />
                      </Pressable>
                    </View>
                  </Pressable>
                );
              }

              const imageUri =
                (d as any).imageUrl && typeof (d as any).imageUrl === "string"
                  ? (d as any).imageUrl
                  : undefined;

              return (
                <Pressable
                  key={d.id}
                  onPress={() => onSelectPress(d.id)}
                  style={baseCard}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {/* Small image — opens modal */}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        openPreview(d.id, imageUri);
                      }}
                      hitSlop={6}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: outline,
                        overflow: "hidden",
                        backgroundColor: surface,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {imageUri ? (
                        <Image
                          source={{ uri: imageUri }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      ) : (
                        <ImageIcon size={16} color={muted} />
                      )}
                    </Pressable>

                    <View style={{ flex: 1 }}>
                      <P
                        style={{
                          color: active ? "#fff" : text,
                          fontFamily: "WorkSans_600SemiBold",
                        }}
                        numberOfLines={1}
                      >
                        {d.title || `Day ${idx + 1}`}
                      </P>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <P
                          style={{
                            color: active ? "#fff" : muted,
                            fontSize: 12,
                          }}
                        >
                          workout
                        </P>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Timer size={13} color={active ? "#fff" : muted} />
                          <P
                            style={{
                              color: active ? "#fff" : muted,
                              fontSize: 12,
                            }}
                          >
                            {d.durationMin}m
                          </P>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onRemovePress(d.id);
                      }}
                      hitSlop={8}
                    >
                      <Trash2 size={16} color={active ? "#fff" : text} />
                    </Pressable>
                  </View>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      </View>

      {/* Preview modal */}
      <ImagePreviewModal
        visible={previewOpen}
        uri={previewUri}
        onRequestClose={closePreview}
        onChange={(next) => {
          if (previewDayId && onChangeDayImage)
            onChangeDayImage(previewDayId, next);
          setPreviewUri(next);
        }}
      />
    </View>
  );
};
