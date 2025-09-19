import { NumberInput } from "@/components/ui/forms/NumberInput";
import { P } from "@/components/ui/Typography";
import type { SetType } from "@/entities/program/types";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Plus, Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { SetTypePill } from "./SetTypePill";

export type SimpleSet = {
  id: string;
  type: SetType;
  reps: number;
  rest: number;
};

export function SetsTable({
  sets,
  onAdd,
  onPatch,
  onRemove,
}: {
  sets: SimpleSet[];
  onAdd: () => void;
  onPatch: (
    setId: string,
    patch: Partial<Pick<SimpleSet, "type" | "reps" | "rest">>
  ) => void;
  onRemove: (setId: string) => void;
}) {
  const outline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");

  return (
    <View style={{ gap: 6 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}
      >
        <P style={{ width: 52, color: muted, fontWeight: "600", fontSize: 12 }}>
          Type
        </P>
        <P
          style={{
            flex: 1,
            color: muted,
            fontWeight: "600",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Reps
        </P>
        <P
          style={{
            flex: 1,
            color: muted,
            fontWeight: "600",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Rest
        </P>
        <P style={{ width: 28, color: "transparent" }}>.</P>
      </View>

      {sets?.length ? (
        sets.map((st) => (
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
              value={st.type}
              onChange={(t) => onPatch(st.id, { type: t })}
            />

            <View style={{ flex: 1, transform: [{ scale: 0.92 }] }}>
              <NumberInput
                label=""
                value={st.reps}
                onChange={(n) => onPatch(st.id, { reps: n })}
                min={1}
                max={99}
              />
            </View>

            <View style={{ flex: 1, transform: [{ scale: 0.92 }] }}>
              <NumberInput
                label=""
                value={st.rest}
                onChange={(n) => onPatch(st.id, { rest: n })}
                min={0}
                max={600}
                unit="s"
              />
            </View>

            <Pressable
              onPress={() => onRemove(st.id)}
              hitSlop={8}
              style={{ width: 28, alignItems: "center" }}
            >
              <Trash2 size={16} color={muted} />
            </Pressable>
          </View>
        ))
      ) : (
        <P style={{ color: muted, fontSize: 12 }}>No sets yet.</P>
      )}

      <Pressable
        onPress={onAdd}
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
        <P style={{ color: muted, fontSize: 12 }}>Add set</P>
      </Pressable>
    </View>
  );
}
