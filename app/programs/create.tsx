// app/programs/create.tsx
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { H2 } from "@/components/ui/Typography";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { SelectField } from "@/components/ui/forms/SelectField";
import { TextArea } from "@/components/ui/forms/TextArea";
import { TextField } from "@/components/ui/forms/TextField";
import { goalEnum } from "@/entities/program/zod";
import { makeFormikValidator } from "@/entities/program/zod-formik";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useProgramStore } from "@/stores/programStore";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  goal: goalEnum,
  lengthWeeks: z.number().int().positive().max(104),
  description: z.string().optional().default(""),
});

export default function CreateProgram() {
  const bg = useThemeColor({}, "background");
  const outline = useThemeColor({}, "outline");
  const router = useRouter();
  const addProgram = useProgramStore((s) => s.addProgram);
  const updateProgram = useProgramStore((s) => s.updateProgram);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
        <H2>Create program</H2>
        <View style={{ height: 1, backgroundColor: outline, opacity: 0.6 }} />

        <Formik
          initialValues={{
            title: "",
            goal: "cut" as z.infer<typeof goalEnum>,
            lengthWeeks: 4,
            description: "",
          }}
          validate={makeFormikValidator(createSchema)}
          onSubmit={(vals) => {
            const p = addProgram(vals.title || "Untitled");
            updateProgram(p.id, {
              goal: vals.goal,
              lengthWeeks: vals.lengthWeeks,
              description: vals.description,
            });
            router.replace(`/programs/${p.id}` as any);
          }}
        >
          {({ values, errors, touched, setFieldValue, handleSubmit }) => (
            <View style={{ gap: 14 }}>
              <TextField
                label="Title"
                value={values.title}
                onChangeText={(t) => setFieldValue("title", t)}
                required
                error={touched.title ? (errors.title as string) : undefined}
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
                value={values.goal}
                onChange={(v) => setFieldValue("goal", v)}
              />

              <NumberInput
                label="Length (weeks)"
                value={values.lengthWeeks}
                onChange={(n) => setFieldValue("lengthWeeks", n)}
                min={1}
                max={104}
                step={1}
              />

              <TextArea
                label="Description"
                value={values.description}
                onChangeText={(t) => setFieldValue("description", t)}
                placeholder="What this program is about…"
              />

              <Button
                title="Create"
                variant="primary"
                onPress={handleSubmit as any}
              />
              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => router.back()}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}
