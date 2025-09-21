import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, View } from "react-native";

// Reuse existing hook (keeping behavior identical)
import { useImagePicker } from "@/components/ui/workout/SeriesBuilder/hooks/useImagePicker";

export function CoverImagePicker({
  uri,
  onChange,
}: {
  uri?: string;
  onChange: (u?: string) => void;
}) {
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const { pickImage } = useImagePicker();

  const handlePick = async () => {
    const next = await pickImage();
    if (next) onChange(next);
  };

  return (
    <Pressable
      onPress={handlePick}
      style={{
        width: "100%",
        height: 220,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: outline,
        backgroundColor: surface,
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
        <View style={{ alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              borderWidth: 1,
              borderColor: outline,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="image-outline" size={28} color={text} />
          </View>
        </View>
      )}
    </Pressable>
  );
}
