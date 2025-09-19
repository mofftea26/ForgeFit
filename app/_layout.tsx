import "react-native-gesture-handler"; // 👈 must be first
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Providers } from "@/components/providers/Providers";

export default function RootLayout() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar />
    </Providers>
  );
}
