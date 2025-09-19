import { useThemeColor } from "@/hooks/use-theme-color";
import { Image as ImageIcon } from "lucide-react-native";
import React from "react";
import { Image, Pressable, View } from "react-native";
import { useDayImage } from "../hooks/useDayImage";

export const BannerImage: React.FC<{
  uri?: string;
  onPick: (uri: string) => void;
}> = ({ uri, onPick }) => {
  const outline = useThemeColor({}, "outline");
  const bg = useThemeColor({}, "surface");
  const text = useThemeColor({}, "text");
  const { pick } = useDayImage();

  const handlePick = async () => {
    const next = await pick();
    if (next) onPick(next);
  };

  return (
    <Pressable
      onPress={handlePick}
      style={{
        width: "100%",
        height: 180,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ImageIcon size={36} color={text} />
        </View>
      )}
    </Pressable>
  );
};
