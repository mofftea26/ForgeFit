// components/redesign/InfoRowTwoUp.tsx
import { Dumbbell, Target } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { InfoSection } from "./InfoSection";

export const InfoSectionWrapper: React.FC<{
  targets?: string[];
  equipment?: string[];
}> = ({ targets = [], equipment = [] }) => {
  if (!targets.length && !equipment.length) return null;

  const both = targets.length > 0 && equipment.length > 0;

  return (
    <View style={{ flexDirection: "row" }}>
      {!!targets.length && (
        <View style={{ flex: 1, marginRight: both ? 12 : 0 }}>
          <InfoSection title="Targets" Icon={Target} items={targets} />
        </View>
      )}
      {!!equipment.length && (
        <View style={{ flex: 1 }}>
          <InfoSection title="Equipment" Icon={Dumbbell} items={equipment} />
        </View>
      )}
    </View>
  );
};
