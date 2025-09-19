import type { Program } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { MenuItem } from "./MenuItem";

type Props = {
  program: Program;
  onClose: () => void;
};

export function ProgramMenu({ program, onClose }: Props) {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const router = useRouter();
  const removeProgram = useProgramStore((s) => s.removeProgram);

  return (
    <View
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: surface,
        borderColor: outline,
        borderWidth: 1,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <MenuItem
        label="Edit program"
        onPress={() => {
          onClose();
          router.push(`/programs/${program.id}/edit`);
        }}
      />
      <MenuItem label="Export (soon)" onPress={onClose} />
      <MenuItem label="Share as… (soon)" onPress={onClose} />
      <MenuItem
        label="Delete program"
        destructive
        onPress={() => {
          onClose();
          removeProgram(program.id);
          router.replace("/");
        }}
      />
    </View>
  );
}
