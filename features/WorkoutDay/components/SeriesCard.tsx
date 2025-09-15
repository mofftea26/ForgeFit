// components/ui/workout/SeriesCard.tsx
import { P } from "@/components/ui/Typography";
import type { Series } from "@/components/ui/workout/SeriesBuilder"; // or wherever your type is
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Image, Text, View } from "react-native";

export const SeriesCard: React.FC<{ series: Series }> = ({ series }) => {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: surface,
        borderRadius: 14,
        padding: 12,
        gap: 10,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            color: primary,
            fontFamily: "WorkSans_700Bold",
            fontSize: 16,
          }}
        >
          Series {series.label}
        </Text>
      </View>
      {!!series.note && (
        <P color="muted" style={{ fontStyle: "italic", marginTop: -4 }}>
          {series.note}
        </P>
      )}

      {/* Exercises */}
      <View style={{ gap: 10 }}>
        {series.items.map((ex, i) => (
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
            {/* Row: A1 and title */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={{ color: text, fontFamily: "WorkSans_600SemiBold" }}>
                {series.label}
                {i + 1}
              </Text>
              <View style={{ width: 6 }} />
              <P>{ex.title || "Untitled exercise"}</P>
            </View>

            {/* Image */}
            {ex.imageUrl ? (
              <Image
                source={{ uri: ex.imageUrl }}
                style={{ width: "100%", height: 140, borderRadius: 10 }}
                resizeMode="cover"
              />
            ) : null}

            {/* Targets */}
            {!!ex.target?.length && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {ex.target.map((t) => (
                  <View
                    key={t}
                    style={{
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: outline,
                    }}
                  >
                    <P>{t}</P>
                  </View>
                ))}
              </View>
            )}

            {/* Vertical meta: Reps / Tempo / Rest */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 16,
                marginTop: 2,
              }}
            >
              {/* Reps */}
              <View style={{ minWidth: 80 }}>
                <Label>Reps</Label>
                <Mono>
                  {ex.reps && ex.reps.length ? ex.reps.join("\n") : "-"}
                </Mono>
              </View>

              {/* Tempo */}
              <View style={{ minWidth: 80 }}>
                <Label>Tempo</Label>
                <Mono>
                  {ex.tempo?.length === 4 ? ex.tempo.join(" / ") : "-"}
                </Mono>
              </View>

              {/* Rest per set */}
              <View style={{ flex: 1 }}>
                <Label>Rest (s)</Label>
                <Mono>
                  {ex.restPerSet && ex.restPerSet.length
                    ? ex.restPerSet.join("\n")
                    : "-"}
                </Mono>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const Label: React.FC<React.PropsWithChildren> = ({ children }) => {
  const muted = useThemeColor({}, "muted");
  return (
    <Text
      style={{
        color: muted,
        fontSize: 12,
        marginBottom: 4,
        fontFamily: "WorkSans_600SemiBold",
      }}
    >
      {children}
    </Text>
  );
};

const Mono: React.FC<React.PropsWithChildren> = ({ children }) => {
  const text = useThemeColor({}, "text");
  return (
    <Text
      style={{
        color: text,
        fontFamily: "WorkSans_500Medium",
        lineHeight: 18,
        includeFontPadding: false,
      }}
    >
      {children}
    </Text>
  );
};
