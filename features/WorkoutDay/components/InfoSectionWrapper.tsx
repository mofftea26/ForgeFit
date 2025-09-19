import { Dumbbell, Target } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { InfoSection } from "./InfoSection";

export const InfoSectionWrapper: React.FC<{
  targets?: string[];
  equipment?: string[];
}> = ({ targets = [], equipment = [] }) => {
  if (!targets.length && !equipment.length) return null;

  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      {!!targets.length && (
        <View style={{ flex: 1 }}>
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
