import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { FontGate } from "@/components/theme/FontGate";
import { SheetProvider } from "@/components/ui/forms/SheetProvider";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <FontGate>
        <SheetProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SheetProvider>
      </FontGate>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}
