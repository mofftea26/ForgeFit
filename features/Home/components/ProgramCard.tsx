import { P } from "@/components/ui/Typography";
import { Program } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, View } from "react-native";

export const ProgramCard: React.FC<{
  program: Program;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ program, onPress, onEdit, onDelete }) => {
  const surface = useThemeColor({}, "surface");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");

  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: surface,
        borderColor: outline,
        borderWidth: 1,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* image header */}
      <Image
        source={
          (program as any) && (program as any).imageUrl
            ? { uri: (program as any).imageUrl }
            : require("@/assets/images/program-placeholder.webp")
        }
        style={{ width: "100%", height: 120 }}
        resizeMode="cover"
      />

      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <P
            style={{
              color: text,
              fontFamily: "Syne_700Bold",
              fontSize: 18,
              flex: 1,
            }}
          >
            {program.title}
          </P>

          {/* 3-dots menu */}
          <Pressable
            onPress={() => setMenuOpen((v) => !v)}
            hitSlop={8}
            style={{ padding: 6 }}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={text} />
          </Pressable>
        </View>

        {!!program.description && (
          <P style={{ color: muted, marginTop: 4 }} numberOfLines={2}>
            {program.description}
          </P>
        )}

        <View style={{ flexDirection: "row", gap: 12, marginTop: 10 }}>
          <Badge>{program.goal}</Badge>
          <Badge>{program.lengthWeeks} wk</Badge>
          <Badge>{program.phases.length} phases</Badge>
        </View>
      </View>

      {/* lightweight inline menu */}
      {menuOpen ? (
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
            label="Edit"
            onPress={() => {
              setMenuOpen(false);
              setTimeout(onEdit!, 0);
            }}
          />

          <MenuItem
            label="Delete"
            destructive
            onPress={() => {
              setMenuOpen(false);
              onDelete?.();
            }}
          />
        </View>
      ) : null}
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
      <P
        style={{
          color: text,
          fontFamily: "WorkSans_600SemiBold",
          fontSize: 12,
        }}
      >
        {children}
      </P>
    </View>
  );
};

const MenuItem: React.FC<{
  label: string;
  onPress: () => void;
  destructive?: boolean;
}> = ({ label, onPress, destructive }) => {
  const text = useThemeColor({}, "text");
  const accentAlt = useThemeColor({}, "accentAlt");
  return (
    <Pressable
      onPress={onPress}
      style={{ paddingVertical: 10, paddingHorizontal: 12 }}
    >
      <P
        style={{
          color: destructive ? accentAlt : text,
          fontFamily: "WorkSans_600SemiBold",
        }}
      >
        {label}
      </P>
    </Pressable>
  );
};
