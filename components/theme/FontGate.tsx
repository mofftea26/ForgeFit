import {
  Syne_600SemiBold,
  Syne_700Bold,
  useFonts as useSyne,
} from "@expo-google-fonts/syne";
import {
  useFonts as useWork,
  WorkSans_400Regular,
  WorkSans_600SemiBold,
} from "@expo-google-fonts/work-sans";
import React from "react";
import { Text } from "react-native";

export const FontGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [syneLoaded] = useSyne({ Syne_600SemiBold, Syne_700Bold });
  const [workLoaded] = useWork({ WorkSans_400Regular, WorkSans_600SemiBold });

  if (!syneLoaded || !workLoaded) return <Text>Loading…</Text>;
  return <>{children}</>;
};
