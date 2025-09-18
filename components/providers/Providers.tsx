import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { FontGate } from "@/components/theme/FontGate";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const Providers = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <FontGate>{children}</FontGate>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};
