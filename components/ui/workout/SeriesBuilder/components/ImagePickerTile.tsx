import { useThemeColor } from "@/hooks/use-theme-color";
import { Image as ImageIcon } from "lucide-react-native";
import React from "react";
import { Pressable, Image as RNImage, ViewStyle } from "react-native";

export function ImagePickerTile({
  uri,
  onPress,
  size,
  style,
}: {
  uri?: string;
  onPress: () => void;
  size: number;
  style?: ViewStyle;
}) {
  const outline = useThemeColor({}, "outline");
  const muted = useThemeColor({}, "muted");
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: outline,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      {uri ? (
        <RNImage
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : (
        <ImageIcon size={18} color={muted} />
      )}
    </Pressable>
  );
}
