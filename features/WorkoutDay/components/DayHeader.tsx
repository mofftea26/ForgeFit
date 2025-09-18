import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";

import { H2, P } from "@/components/ui/Typography";

type Props = {
  title: string;
  subtitle?: string;
  imageUri?: string | null;
  description?: string | null;
  onBack?: () => void;
};

export const DayHeader: React.FC<Props> = ({
  title,
  subtitle,
  imageUri,
  description,
  onBack,
}) => {
  const tintText = "#fff";
  const hasDesc = !!(description && description.length > 0);

  return (
    <View style={{ marginBottom: 12 }}>
      <ImageBackground
        source={
          imageUri
            ? { uri: imageUri }
            : require("@/assets/images/program-placeholder.webp")
        }
        style={{ width: "100%", height: 260, justifyContent: "flex-start" }}
        resizeMode="cover"
      >
        {/* Dim layer */}
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        />

        {/* Top bar: back + title + meta */}
        <TopBar title={title} subtitle={subtitle} onBack={onBack} />

        {/* Bottom description with gradient fade */}
        {hasDesc && (
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <P style={{ color: "rgba(255,255,255,0.95)" }} numberOfLines={3}>
              {description}
            </P>
          </LinearGradient>
        )}
      </ImageBackground>
    </View>
  );
};

const TopBar: React.FC<{
  title: string;
  subtitle?: string;
  onBack?: () => void;
}> = ({ title, subtitle, onBack }) => {
  return (
    <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={{ padding: 8, borderRadius: 999, marginRight: 6 }}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
        ) : null}

        <View style={{ flex: 1 }}>
          <H2 style={{ color: "#fff" }} numberOfLines={1}>
            {title}
          </H2>
          {!!subtitle && (
            <P style={{ color: "rgba(255,255,255,0.86)" }} numberOfLines={1}>
              {subtitle}
            </P>
          )}
        </View>
      </View>
    </View>
  );
};
