import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Pressable, Text } from "react-native";

export const FAB: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
  const tint = useThemeColor({}, "primarySoft");
  const bg = useThemeColor({}, "background");
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        right: 20,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: tint,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <Text
        style={{
          color: bg,
          fontSize: 28,
          lineHeight: 28,
          marginTop: -2,
          fontFamily: "WorkSans_600SemiBold",
        }}
      >
        +
      </Text>
    </Pressable>
  );
};
