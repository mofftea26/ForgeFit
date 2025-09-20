import { H4, P } from "@/components/ui/Typography";
import type { Series } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ChevronRight, Dumbbell as DumbbellIcon } from "lucide-react-native";
import React, { memo } from "react";
import { View } from "react-native";
import { Divider } from "./atoms/Divider";
import { ExerciseItem } from "./atoms/ExerciseItem";
import { MetaPill } from "./atoms/MetaPill";

type Props = { series: Series; index: number };

export const SeriesCard: React.FC<Props> = memo(({ series, index }) => {
  const outline = useThemeColor({}, "outline");
  const surface = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primarySoft = useThemeColor({}, "primarySoft");
  const onTint = useThemeColor({}, "onTint");
  const chipOnTintBg = useThemeColor({}, "chipOnTintBg");
  const chipOnTintBorder = useThemeColor({}, "chipOnTintBorder");

  const exercisesCount = series.items.length;

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: outline,
        borderRadius: 14,
        backgroundColor: surface,
        overflow: "hidden",
      }}
    >
      {/* header */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: outline,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: primarySoft,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: chipOnTintBg,
            borderWidth: 1,
            borderColor: chipOnTintBorder,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DumbbellIcon size={16} color={onTint} />
        </View>
        <H4 style={{ color: onTint, fontWeight: "600" }}>
          Series {series.label}
        </H4>
        <View style={{ flex: 1 }} />
        <MetaPill text={`${exercisesCount} ex`} tone="inverted" />
      </View>

      {/* body */}
      <View style={{ padding: 10 }}>
        {exercisesCount === 0 ? (
          <P style={{ color: muted }}>No exercises.</P>
        ) : (
          series.items.map((ex, i) => (
            <View key={ex.id}>
              <ExerciseItem
                exercise={ex}
                index={i}
                code={`${series.label}${i + 1}`}
              />
              {i < exercisesCount - 1 ? <Divider /> : null}
            </View>
          ))
        )}
      </View>

      {/* footer hint */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderTopWidth: 1,
          borderTopColor: outline,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          opacity: 0.8,
        }}
      >
        <ChevronRight size={14} color={muted} />
        <P style={{ color: muted, fontSize: 12 }}>
          Follow the order or adapt as needed.
        </P>
      </View>
    </View>
  );
});

SeriesCard.displayName = "SeriesCard";
