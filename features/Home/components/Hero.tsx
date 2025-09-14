import { Button } from "@/components/ui/Button";
import { H1, P } from "@/components/ui/Typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

export const Hero: React.FC<{ onPrimary?: () => void }> = ({ onPrimary }) => {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const tint = useThemeColor({}, "primarySoft");
  const light = useThemeColor({}, "primaryTint");

  return (
    <View style={{ borderRadius: 16, overflow: "hidden" }}>
      <LinearGradient
        colors={[tint, light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 18 }}
      >
        <H1 style={{ color: "#fff", fontSize: 28, marginBottom: 6 }}>
          ForgeFit
        </H1>
        <P style={{ color: "#fff", opacity: 0.9 }}>
          Build structured workout programs with phases, days, and supersets.
          Export when ready.
        </P>

        <View style={{ height: 10 }} />

        <Button title="Create program" variant="accent" onPress={onPrimary} />
      </LinearGradient>
    </View>
  );
};
