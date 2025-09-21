import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { H2, P } from "@/components/ui/Typography";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { SelectField } from "@/components/ui/forms/SelectField";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores";
import { InfoRow } from "./components/InfoRow";
import { Stepper } from "./components/Stepper";

import { useImagePicker } from "@/components/ui/workout/SeriesBuilder/hooks/useImagePicker"; // your existing hook
import { CreateProgramFormValues } from "@/features/Create/Schema/createProgramForm";
import { useCreateProgramForm } from "./hooks/useCreateProgramForm";

export function CreateProgramScreen() {
  const bg = useThemeColor({}, "background");
  const outline = useThemeColor({}, "outline");
  const text = useThemeColor({}, "text");
  const surface = useThemeColor({}, "surface");
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const addProgram = useProgramStore((s) => s.addProgram);
  const updateProgram = useProgramStore((s) => s.updateProgram);

  // multi-step UI state (unchanged)
  const [step, setStep] = React.useState(0);
  const stepsTotal = 3;

  const { pickImage } = useImagePicker();

  const onFinish = (values: CreateProgramFormValues) => {
    const p = addProgram(values.title || "Untitled");
    updateProgram(p.id, {
      goal: values.goal,
      lengthWeeks: values.lengthWeeks,
      description: values.description ?? "",
      imageUrl: values.imageUrl,
    });
    router.replace(`/programs/${p.id}/edit`);
  };

  const { formik, canProceedBasics } = useCreateProgramForm({ onFinish });

  const goNext = () => {
    if (step < stepsTotal - 1) setStep((s) => s + 1);
    else formik.handleSubmit(); // Finish
  };
  const goBack = () => {
    if (step === 0) router.back();
    else setStep((s) => Math.max(0, s - 1));
  };

  // identical gate as before (title non-empty + weeks > 0)
  const nextDisabled = step === 0 ? !canProceedBasics : false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <Stepper index={step} count={stepsTotal}>
        {/* STEP 1: Basics */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 40, gap: 12 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <H2>Program basics</H2>
            <View style={{ height: 12 }} />

            <TextField
              label="Title"
              value={formik.values.title}
              onChangeText={(t) => formik.setFieldValue("title", t)}
              onBlur={() => formik.setFieldTouched("title", true)}
              required
            />

            <SelectField
              label="Goal"
              options={[
                { label: "Cut", value: "cut" },
                { label: "Bulk", value: "bulk" },
                { label: "Recomp", value: "recomp" },
                { label: "Strength", value: "strength" },
                { label: "Endurance", value: "endurance" },
              ]}
              value={formik.values.goal}
              onChange={(v) => formik.setFieldValue("goal", v)}
            />

            <NumberInput
              label="Length (weeks)"
              value={formik.values.lengthWeeks}
              onChange={(v) => formik.setFieldValue("lengthWeeks", v ?? 0)}
            />

            <TextArea
              label="Description"
              value={formik.values.description ?? ""}
              onChangeText={(t) => formik.setFieldValue("description", t)}
              placeholder="What this program is about…"
              multiline
              style={{ minHeight: 140, textAlignVertical: "top" }}
            />

            <View style={{ height: 12 }} />
            <P color="muted">You’ll add phases, days & supersets next.</P>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* STEP 2: Cover image */}
        <View style={{ flex: 1 }}>
          <H2>Cover image</H2>
          <View style={{ height: 12 }} />
          <Pressable
            onPress={async () => {
              const uri = await pickImage();
              if (uri) formik.setFieldValue("imageUrl", uri);
            }}
            style={{
              width: "100%",
              height: 220,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: outline,
              backgroundColor: surface,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {formik.values.imageUrl ? (
              <Image
                source={{ uri: formik.values.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    borderWidth: 1,
                    borderColor: outline,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="image-outline" size={28} color={text} />
                </View>
                <P color="muted">Tap to choose an image</P>
              </View>
            )}
          </Pressable>
        </View>

        {/* STEP 3: Review */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <H2>Review</H2>
          <View style={{ height: 12 }} />

          {formik.values.imageUrl ? (
            <View
              style={{
                borderWidth: 1,
                borderColor: outline,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 12,
              }}
            >
              <Image
                source={{ uri: formik.values.imageUrl }}
                style={{ width: "100%", height: 140 }}
                resizeMode="cover"
              />
            </View>
          ) : null}

          <InfoRow label="Title" value={formik.values.title || "Untitled"} />
          <InfoRow label="Goal" value={formik.values.goal} />
          <InfoRow
            label="Length"
            value={`${formik.values.lengthWeeks} weeks`}
          />
          {!!formik.values.description && (
            <InfoRow label="Description" value={formik.values.description} />
          )}

          <View style={{ height: 8 }} />
          <P color="muted">
            You’ll land in the editor to build phases, days & exercises.
          </P>
        </ScrollView>
      </Stepper>

      {/* Controls */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          padding: 16,
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <View style={{ flex: 1 }}>
          <Button title="Back" variant="ghost" onPress={goBack} fullWidth />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={step < stepsTotal - 1 ? "Next" : "Finish"}
            variant="primary"
            onPress={goNext}
            disabled={nextDisabled}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
