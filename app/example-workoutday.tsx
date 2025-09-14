// app/example-workoutday.tsx (demo screen or inline demo)
import { blankWorkoutDay, workoutDaySchema } from "@/entities/program/zod";
import { makeFormikValidator } from "@/entities/program/zod-formik";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Formik } from "formik";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/ui/forms/NumberInput";
import { RepsSetsField } from "@/components/ui/forms/Reps";
import { TempoInputs } from "@/components/ui/forms/Tempo";
import { TextField } from "@/components/ui/forms/TextField";

export default function WorkoutDayDemo() {
  const bg = useThemeColor({}, "background");
  const initial = React.useMemo(() => blankWorkoutDay("Upper Body"), []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, rowGap: 12 }}>
        <Formik
          initialValues={initial}
          validate={makeFormikValidator(workoutDaySchema)}
          onSubmit={(vals) => console.log("VALID DAY", vals)}
        >
          {({ values, setFieldValue, handleSubmit, errors }) => (
            <View style={{ rowGap: 12 }}>
              <TextField
                label="Day title"
                value={values.title}
                onChangeText={(t) => setFieldValue("title", t)}
                required
              />

              <NumberInput
                label="Planned duration (min)"
                value={values.durationMin}
                onChange={(v) => setFieldValue("durationMin", v)}
                min={10}
                max={180}
                step={5}
                unit="min"
              />

              {/* edit first exercise of first series for demo */}
              <RepsSetsField
                label="Reps (A1)"
                value={values.series[0].items[0].reps}
                onChange={(reps) =>
                  setFieldValue("series[0].items[0].reps", reps)
                }
              />
              <TempoInputs
                label="Tempo (A1)"
                value={values.series[0].items[0].tempo}
                onChange={(t) => setFieldValue("series[0].items[0].tempo", t)}
              />

              {/* Keep counts in sync to satisfy schema */}
              <NumberInput
                label="Number of exercises (total)"
                value={values.numberOfExercises}
                onChange={(n) => setFieldValue("numberOfExercises", n)}
                min={1}
                step={1}
              />
              <NumberInput
                label="Number of sets (total)"
                value={values.numberOfSets}
                onChange={(n) => setFieldValue("numberOfSets", n)}
                min={1}
                step={1}
              />

              <Button title="Validate day" onPress={handleSubmit as any} />
              {/* You can inspect `errors` in dev to see Zod messages mapped into Formik */}
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}
