import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppBottomSheet, {
  AppBottomSheetRef,
} from "@/components/ui/AppBottomSheet";

import { Button } from "@/components/ui/Button";
import { BottomSheetTextArea } from "@/components/ui/forms/BottomSheetTextArea";
import { BottomSheetTextField } from "@/components/ui/forms/BottomSheetTextField";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { SelectField } from "@/components/ui/forms/SelectField";
import { H1, H2, P } from "@/components/ui/Typography";
import type { Program } from "@/entities/program/zod";
import { EmptyPrograms } from "@/features/Home/components/EmptyPrograms";
import { FAB } from "@/features/Home/components/FAB";
import { Hero } from "@/features/Home/components/Hero";
import { ProgramCard } from "@/features/Home/components/ProgramCard";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores/programStore";

export default function HomeScreen() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const outline = useThemeColor({}, "outline");
  const router = useRouter();

  const programs = useProgramStore((s) => s.programs);
  const removeProgram = useProgramStore((s) => s.removeProgram);
  const updateProgram = useProgramStore((s) => s.updateProgram);
  const hasPrograms = programs.length > 0;

  const goCreate = () => router.push("/programs/create");

  // Editing state
  const [editing, setEditing] = React.useState<Program | null>(null);
  const [title, setTitle] = React.useState("");
  const [goal, setGoal] = React.useState<Program["goal"]>("cut");
  const [weeks, setWeeks] = React.useState(4);
  const [description, setDescription] = React.useState("");
  const [imageUri, setImageUri] = React.useState<string | undefined>(undefined);

  // Reusable bottom sheet controller
  const sheetRef = React.useRef<AppBottomSheetRef>(null);

  const openEdit = (p: Program) => {
    setEditing(p);
    setTitle(p.title);
    setGoal(p.goal);
    setWeeks(p.lengthWeeks);
    setDescription(p.description ?? "");
    setImageUri(p.imageUrl || undefined);
    // open after state set
    requestAnimationFrame(() => sheetRef.current?.open());
  };

  const closeEdit = () => {
    sheetRef.current?.close();
    // small delay to hide flicker
    setTimeout(() => setEditing(null), 220);
  };

  const saveEdit = () => {
    if (!editing) return;
    updateProgram(editing.id, {
      title: title.trim() || "Untitled",
      goal,
      lengthWeeks: weeks,
      description,
      imageUrl: imageUri,
    });
    closeEdit();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 96 }}
      >
        {!hasPrograms ? (
          <Hero onPrimary={goCreate} />
        ) : (
          <View style={{ gap: 8 }}>
            <View>
              <H1 style={{ color: text }}>ForgeFit</H1>
              <H2 color="primary">Workout Builder</H2>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: outline,
                opacity: 0.6,
                marginTop: 4,
              }}
            />
          </View>
        )}

        <View style={{ gap: 12 }}>
          {hasPrograms ? (
            programs.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                onPress={() => router.push(`/programs/${p.id}`)}
                onEdit={() => openEdit(p)}
                onDelete={() => removeProgram(p.id)}
              />
            ))
          ) : (
            <EmptyPrograms />
          )}
        </View>
      </ScrollView>

      <FAB onPress={goCreate} />

      {/* Reusable, dynamic-height Bottom Sheet */}
      <AppBottomSheet
        ref={sheetRef}
        backgroundColor={bg}
        outlineColor={outline}
        indicatorColor={outline}
        maxHeightRatio={0.9}
        HeaderComponent={editing ? <H2>Edit program</H2> : null}
        FooterComponent={
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={closeEdit}
                fullWidth
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Save"
                variant="primary"
                onPress={saveEdit}
                fullWidth
              />
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

        {/* Form */}
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
    </SafeAreaView>
  );
}
