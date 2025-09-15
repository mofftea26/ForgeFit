import { Button } from "@/components/ui/Button";
import { PillChecklist } from "@/components/ui/forms/PillChecklist";
import { RepsSetsField } from "@/components/ui/forms/Reps";
import { TempoInputs } from "@/components/ui/forms/Tempo";
import { TextField } from "@/components/ui/forms/TextField";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

export type SeriesExercise = {
  id: string;
  title: string;
  reps: number[];
  tempo: [string, string, string, string];
  restPerSet?: number[];
  target?: string[]; // now multi-select
  imageUrl?: string;
};

export type Series = {
  id: string;
  note?: string; // via modal
  label: string;
  items: SeriesExercise[];
};

type Props = {
  value: Series[];
  onChange: (next: Series[]) => void;
  selectedTargets: string[]; // from WorkoutDayEditor
};

const uid = () => Math.random().toString(36).slice(2, 10);
const blankExercise = (): SeriesExercise => ({
  id: uid(),
  title: "",
  reps: [12, 12, 10, 10],
  tempo: ["3", "0", "1", "0"],
  restPerSet: [60, 60, 60, 60],
  target: [],
  imageUrl: "",
});
const nextLabel = (curr?: string) =>
  !curr ? "A" : String.fromCharCode(curr.charCodeAt(0) + 1);

export const SeriesBuilder: React.FC<Props> = ({
  value,
  onChange,
  selectedTargets,
}) => {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");

  const [noteModal, setNoteModal] = React.useState<{
    open: boolean;
    sid?: string;
    text: string;
  }>({ open: false, text: "" });

  const setSeries = (sid: string, patch: Partial<Series>) =>
    onChange(value.map((s) => (s.id === sid ? { ...s, ...patch } : s)));

  const patchExercise = (
    sid: string,
    xid: string,
    patch: Partial<SeriesExercise>
  ) =>
    onChange(
      value.map((s) =>
        s.id !== sid
          ? s
          : {
              ...s,
              items: s.items.map((e) =>
                e.id === xid ? { ...e, ...patch } : e
              ),
            }
      )
    );

  const addSeries = () => {
    const label = nextLabel(value[value.length - 1]?.label);
    onChange([...value, { id: uid(), label, items: [blankExercise()] }]);
  };
  const removeSeries = (sid: string) =>
    onChange(value.filter((s) => s.id !== sid));
  const addExercise = (sid: string) =>
    onChange(
      value.map((s) =>
        s.id === sid ? { ...s, items: [...s.items, blankExercise()] } : s
      )
    );
  const removeExercise = (sid: string, xid: string) =>
    onChange(
      value.map((s) =>
        s.id === sid ? { ...s, items: s.items.filter((e) => e.id !== xid) } : s
      )
    );

  async function pickImage(sid: string, xid: string) {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]?.uri)
      patchExercise(sid, xid, { imageUrl: res.assets[0].uri });
  }

  return (
    <View style={{ gap: 14 }}>
      {value.map((s) => (
        <View
          key={s.id}
          style={{
            backgroundColor: surface,
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 12,
            padding: 12,
            gap: 10,
          }}
        >
          {/* Header: Series label + lamp for note + trash */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text
              style={{
                color: primary,
                fontFamily: "WorkSans_700Bold",
                fontSize: 16,
              }}
            >
              Series {s.label}
            </Text>
            <Pressable
              onPress={() =>
                setNoteModal({ open: true, sid: s.id, text: s.note ?? "" })
              }
              style={{ padding: 6 }}
            >
              <Ionicons name="bulb-outline" size={18} color={primary} />
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable
              onPress={() => removeSeries(s.id)}
              style={{ padding: 6 }}
            >
              <Ionicons name="trash-outline" size={18} color={primary} />
            </Pressable>
          </View>

          {/* Exercises */}
          <View style={{ gap: 12 }}>
            {s.items.map((ex, ei) => (
              <View
                key={ex.id}
                style={{
                  borderWidth: 1,
                  borderColor: outline,
                  borderRadius: 12,
                  padding: 10,
                  gap: 10,
                }}
              >
                {/* Row: A1 / image icon / delete */}
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Text
                    style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}
                  >
                    {s.label}
                    {ei + 1}
                  </Text>
                  <Pressable
                    onPress={() => pickImage(s.id, ex.id)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: outline,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {ex.imageUrl ? (
                      <Image
                        source={{ uri: ex.imageUrl }}
                        style={{ width: 34, height: 34, borderRadius: 6 }}
                      />
                    ) : (
                      <Ionicons name="image-outline" size={18} color={text} />
                    )}
                  </Pressable>
                  <View style={{ flex: 1 }} />
                  <Pressable
                    onPress={() => removeExercise(s.id, ex.id)}
                    hitSlop={8}
                    style={{ padding: 4 }}
                  >
                    <Ionicons name="trash-outline" size={16} color={text} />
                  </Pressable>
                </View>

                <TextField
                  label="Exercise title"
                  value={ex.title}
                  onChangeText={(t) => patchExercise(s.id, ex.id, { title: t })}
                  required
                />

                <RepsSetsField
                  label="Reps (per set)"
                  value={ex.reps}
                  onChange={(reps: number[]) => {
                    const rest = ex.restPerSet ?? [];
                    const newRest = Array(reps.length)
                      .fill(60)
                      .map((v, i) => rest[i] ?? v);
                    patchExercise(s.id, ex.id, { reps, restPerSet: newRest });
                  }}
                />
                <TempoInputs
                  label="Tempo"
                  value={ex.tempo}
                  onChange={(tempo: [string, string, string, string]) =>
                    patchExercise(s.id, ex.id, { tempo })
                  }
                />
                <RepsSetsField
                  label="Rest per set (sec)"
                  value={ex.restPerSet ?? Array(ex.reps.length).fill(60)}
                  onChange={(restPerSet: number[]) =>
                    patchExercise(s.id, ex.id, { restPerSet })
                  }
                />

                {/* Target muscle as pill checklist based on selectedTargets */}
                <View>
                  <Text
                    style={{
                      color: muted,
                      marginBottom: 6,
                      fontFamily: "WorkSans_600SemiBold",
                    }}
                  >
                    Targets
                  </Text>
                  <PillChecklist
                    options={selectedTargets.map((t) => ({
                      label: t,
                      value: t,
                    }))}
                    value={ex.target ?? []}
                    onChange={(list) =>
                      patchExercise(s.id, ex.id, { target: list })
                    }
                  />
                </View>
              </View>
            ))}
          </View>

          <Button
            title={`+ Add exercise to Series ${s.label}`}
            variant="subtle"
            onPress={() => addExercise(s.id)}
          />

          {!!s.note && (
            <Text style={{ color: muted, fontStyle: "italic" }}>
              Note: {s.note}
            </Text>
          )}
        </View>
      ))}

      <Button title="+ Add series" variant="outline" onPress={addSeries} />

      {/* Note modal */}
      <Modal
        transparent
        visible={noteModal.open}
        animationType="fade"
        onRequestClose={() =>
          setNoteModal({ open: false, sid: undefined, text: "" })
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: outline,
              padding: 12,
              gap: 10,
            }}
          >
            <Text
              style={{
                color: text,
                fontFamily: "WorkSans_700Bold",
                fontSize: 16,
              }}
            >
              Series note
            </Text>
            {/* reuse TextField as multiline textarea */}
            <TextField
              label="Trainer's note"
              value={noteModal.text}
              onChangeText={(t) => setNoteModal((m) => ({ ...m, text: t }))}
              multiline
            />
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button
                title="Close"
                variant="ghost"
                onPress={() =>
                  setNoteModal({ open: false, sid: undefined, text: "" })
                }
              />
              <Button
                title="Save"
                variant="primary"
                onPress={() => {
                  if (noteModal.sid)
                    setSeries(noteModal.sid, { note: noteModal.text });
                  setNoteModal({ open: false, sid: undefined, text: "" });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
