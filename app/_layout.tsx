import "react-native-gesture-handler"; // 👈 must be first
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Providers } from "@/components/providers/Providers";
import React from "react";
import Toast from "react-native-toast-message";
export default function RootLayout() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar />
      <Toast />
    </Providers>
  );
}
