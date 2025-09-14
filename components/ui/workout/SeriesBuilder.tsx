import { NumberInput } from "@/components/ui/forms/NumberInput";
import { RepsSetsField } from "@/components/ui/forms/Reps";
import { TempoInputs } from "@/components/ui/forms/Tempo";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export type SeriesExercise = {
  id: string;
  title: string;
  reps: number[];
  tempo: [string, string, string, string];
  restSec: number;
  trainerNote: string;
  setup: string;
  instructions: string;
  target: string;
  imageUrl?: string;
};

export type Series = {
  id: string;
  label: string; // "A", "B", ...
  items: SeriesExercise[]; // A1, A2...
};

export type SeriesBuilderProps = {
  value: Series[];
  onChange: (s: Series[]) => void;
};

const uid = () => Math.random().toString(36).slice(2, 9).toUpperCase();

export const SeriesBuilder: React.FC<SeriesBuilderProps> = ({
  value,
  onChange,
}) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primarySoft");
  const muted = useThemeColor({}, "muted");
  const accentAlt = useThemeColor({}, "accentAlt");

  const addSeries = () => {
    // Next label alphabetically
    const nextLabel = String.fromCharCode(65 + value.length); // 65 = 'A'
    onChange([...value, { id: uid(), label: nextLabel, items: [] }]);
  };
  const removeSeries = (sid: string) =>
    onChange(value.filter((s) => s.id !== sid));

  const addExercise = (sid: string) => {
    onChange(
      value.map((s) =>
        s.id !== sid
          ? s
          : {
              ...s,
              items: [
                ...s.items,
                {
                  id: uid(),
                  title: "",
                  reps: [12, 12, 10, 10],
                  tempo: ["3", "0", "1", "0"],
                  restSec: 60,
                  trainerNote: "",
                  setup: "",
                  instructions: "",
                  target: "",
                },
              ],
            }
      )
    );
  };
  const patchExercise = (
    sid: string,
    eid: string,
    patch: Partial<SeriesExercise>
  ) => {
    onChange(
      value.map((s) =>
        s.id !== sid
          ? s
          : {
              ...s,
              items: s.items.map((it) =>
                it.id === eid ? { ...it, ...patch } : it
              ),
            }
      )
    );
  };
  const removeExercise = (sid: string, eid: string) => {
    onChange(
      value.map((s) =>
        s.id !== sid
          ? s
          : { ...s, items: s.items.filter((it) => it.id !== eid) }
      )
    );
  };

  return (
    <View style={{ gap: 12 }}>
      {value.map((s, si) => (
        <View
          key={s.id}
          style={{
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 14,
            backgroundColor: surface,
            padding: 12,
            gap: 10,
          }}
        >
          {/* Series header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ color: text, fontFamily: "Syne_700Bold", fontSize: 18 }}
            >
              Series {s.label}
            </Text>
            <Pressable onPress={() => removeSeries(s.id)}>
              <Text
                style={{ color: accentAlt, fontFamily: "WorkSans_600SemiBold" }}
              >
                Remove
              </Text>
            </Pressable>
          </View>

          {/* Exercise list */}
          <View style={{ gap: 12 }}>
            {s.items.map((ex, ei) => {
              const code = `${s.label}${ei + 1}`;
              return (
                <View
                  key={ex.id}
                  style={{
                    borderWidth: 1,
                    borderColor: outline,
                    borderRadius: 12,
                    padding: 10,
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: primary,
                      fontFamily: "WorkSans_600SemiBold",
                    }}
                  >
                    {code}
                  </Text>
                  <TextInput
                    value={ex.title}
                    onChangeText={(t) =>
                      patchExercise(s.id, ex.id, { title: t })
                    }
                    placeholder="Exercise title"
                    placeholderTextColor={muted}
                    style={{
                      color: text,
                      fontFamily: "WorkSans_600SemiBold",
                      fontSize: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: outline,
                      paddingBottom: 6,
                    }}
                  />
                  <RepsSetsField
                    label="Reps"
                    value={ex.reps}
                    onChange={(reps) => patchExercise(s.id, ex.id, { reps })}
                  />
                  <TempoInputs
                    label="Tempo"
                    value={ex.tempo}
                    onChange={(tempo) => patchExercise(s.id, ex.id, { tempo })}
                  />
                  <NumberInput
                    label="Rest (sec)"
                    value={ex.restSec ?? 60}
                    onChange={(restSec) =>
                      patchExercise(s.id, ex.id, { restSec })
                    }
                    min={0}
                    step={5}
                    unit="s"
                  />
                  <Pressable
                    onPress={() => removeExercise(s.id, ex.id)}
                    style={{ alignSelf: "flex-end" }}
                  >
                    <Text
                      style={{
                        color: accentAlt,
                        fontFamily: "WorkSans_600SemiBold",
                      }}
                    >
                      Remove exercise
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>

          <Pressable
            onPress={() => addExercise(s.id)}
            style={{
              borderWidth: 1,
              borderColor: outline,
              borderStyle: "dashed",
              borderRadius: 12,
              padding: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: primary, fontFamily: "WorkSans_600SemiBold" }}
            >
              + Add exercise
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={addSeries}
        style={{
          borderWidth: 1,
          borderColor: outline,
          borderStyle: "dashed",
          borderRadius: 14,
          padding: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: primary, fontFamily: "WorkSans_600SemiBold" }}>
          + Add series
        </Text>
      </Pressable>
    </View>
  );
};
