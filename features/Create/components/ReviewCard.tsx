import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Image, View } from "react-native";
import { InfoRow } from "./InfoRow";

export function ReviewCard({
  title,
  goal,
  weeks,
  description,
  imageUri,
}: {
  title: string;
  goal: string;
  weeks: number;
  description?: string;
  imageUri?: string;
}) {
  const outline = useThemeColor({}, "outline");

  return (
    <>
      {imageUri ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: outline,
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: 140 }}
            resizeMode="cover"
          />
        </View>
      ) : null}

      <InfoRow label="Title" value={title} />
      <InfoRow label="Goal" value={goal} />
      <InfoRow label="Length" value={`${weeks} weeks`} />
      {!!description && <InfoRow label="Description" value={description} />}
    </>
  );
}
