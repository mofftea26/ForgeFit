import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, Pressable, View } from "react-native";

import AppBottomSheet, {
  AppBottomSheetRef,
} from "@/components/ui/AppBottomSheet";
import { Button } from "@/components/ui/Button";
import { BottomSheetTextArea } from "@/components/ui/forms/BottomSheetTextArea";
import { BottomSheetTextField } from "@/components/ui/forms/BottomSheetTextField";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { SelectField } from "@/components/ui/forms/SelectField";
import { H2, P } from "@/components/ui/Typography";
import type { Program } from "@/entities/program/zod";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores";

type Props = {
  program: Program | null;
  onClose: () => void;
};

export function EditProgramSheet({ program, onClose }: Props) {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");

  const updateProgram = useProgramStore((s) => s.updateProgram);

  const [title, setTitle] = React.useState("");
  const [goal, setGoal] = React.useState<Program["goal"]>("cut");
  const [weeks, setWeeks] = React.useState(4);
  const [description, setDescription] = React.useState("");
  const [imageUri, setImageUri] = React.useState<string | undefined>(undefined);

  const sheetRef = React.useRef<AppBottomSheetRef>(null);

  React.useEffect(() => {
    if (program) {
      setTitle(program.title);
      setGoal(program.goal);
      setWeeks(program.lengthWeeks);
      setDescription(program.description ?? "");
      setImageUri(program.imageUrl || undefined);
      requestAnimationFrame(() => sheetRef.current?.open());
    }
  }, [program]);

  const close = () => {
    sheetRef.current?.close();
    setTimeout(onClose, 220);
  };

  const save = () => {
    if (!program) return;
    updateProgram(program.id, {
      title: title.trim() || "Untitled",
      goal,
      lengthWeeks: weeks,
      description,
      imageUrl: imageUri,
    });
    close();
  };

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!res.canceled && res.assets?.[0]?.uri) setImageUri(res.assets[0].uri);
  }

  return (
    <AppBottomSheet
      ref={sheetRef}
      backgroundColor={bg}
      outlineColor={outline}
      indicatorColor={outline}
      maxHeightRatio={0.9}
      HeaderComponent={program ? <H2>Edit program</H2> : null}
      FooterComponent={
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Button title="Cancel" variant="ghost" onPress={close} fullWidth />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Save" variant="primary" onPress={save} fullWidth />
          </View>
        </View>
      }
    >
      <Pressable
        onPress={pickImage}
        style={{
          width: "100%",
          height: 160,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: outline,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ alignItems: "center", gap: 8 }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: outline,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="image-outline" size={24} color={text} />
            </View>
            <P color="muted">Tap to choose an image</P>
          </View>
        )}
      </Pressable>

      <BottomSheetTextField
        label="Title"
        value={title}
        onChangeText={setTitle}
        required
      />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        <View style={{ flex: 1 }}>
          <SelectField
            label="Goal"
            options={[
              { label: "Cut", value: "cut" },
              { label: "Bulk", value: "bulk" },
              { label: "Recomp", value: "recomp" },
              { label: "Strength", value: "strength" },
              { label: "Endurance", value: "endurance" },
            ]}
            value={goal}
            onChange={(g) => setGoal(g as Program["goal"])}
          />
        </View>
        <View style={{ width: 130 }}>
          <NumberInput
            label="Weeks"
            value={weeks}
            onChange={setWeeks}
            min={1}
            max={104}
            step={1}
          />
        </View>
      </View>

      <BottomSheetTextArea
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="What this program is about…"
        style={{ minHeight: 100, textAlignVertical: "top" }}
      />
    </AppBottomSheet>
  );
}
