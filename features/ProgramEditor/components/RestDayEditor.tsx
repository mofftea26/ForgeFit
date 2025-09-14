import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import { RestDay } from "@/entities/program/zod";
import React from "react";
import { View } from "react-native";

export const RestDayEditor: React.FC<{
  value: RestDay;
  onChange: (patch: Partial<RestDay>) => void;
}> = ({ value, onChange }) => {
  return (
    <View style={{ gap: 12 }}>
      <TextField
        label="Title"
        value={value.title}
        onChangeText={(t) => onChange({ title: t })}
      />
      <TextArea
        label="Note"
        value={value.trainerNote ?? ""}
        onChangeText={(t) => onChange({ trainerNote: t })}
      />
    </View>
  );
};
