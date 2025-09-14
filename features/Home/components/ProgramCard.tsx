import { Program } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, Text, View } from "react-native";

export const ProgramCard: React.FC<{
  program: Program;
  onPress?: () => void;
  onDelete?: () => void;
}> = ({ program, onPress, onDelete }) => {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: surface,
        borderColor: outline,
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
      }}
    >
      <Text style={{ color: text, fontFamily: "Syne_700Bold", fontSize: 18 }}>
        {program.title}
      </Text>
      {!!program.description && (
        <Text style={{ color: muted, marginTop: 4 }} numberOfLines={2}>
          {program.description}
        </Text>
      )}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 10 }}>
        <Badge>{program.goal}</Badge>
        <Badge>{program.lengthWeeks} wk</Badge>
        <Badge>{program.phases.length} phases</Badge>
      </View>
      <Pressable
        onPress={onDelete}
        style={{ marginTop: 10, alignSelf: "flex-start" }}
      >
        <Text style={{ color: primary, fontFamily: "WorkSans_600SemiBold" }}>
          Delete
        </Text>
      </Pressable>
    </Pressable>
  );
};

const Badge: React.FC<React.PropsWithChildren> = ({ children }) => {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  return (
    <View
      style={{
        borderColor: outline,
        borderWidth: 1,
        borderRadius: 999,
        paddingVertical: 4,
        paddingHorizontal: 10,
      }}
    >
      <Text
        style={{
          color: text,
          fontFamily: "WorkSans_600SemiBold",
          fontSize: 12,
        }}
      >
        {children}
      </Text>
    </View>
  );
};
