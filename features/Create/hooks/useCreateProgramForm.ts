// hooks/useCreateProgramFormik.ts
import { zodToFormikValidate } from "@/entities/program/zodToFromik";
import { useFormik } from "formik";
import {
  CreateProgramFormValues,
  createProgramBasicsGateSchema,
  createProgramFormSchema,
} from "../Schema/createProgramForm";

export type UseCreateProgramFormikArgs = {
  onFinish: (values: CreateProgramFormValues) => void;
};

export function useCreateProgramForm({ onFinish }: UseCreateProgramFormikArgs) {
  const formik = useFormik<CreateProgramFormValues>({
    initialValues: {
      title: "",
      goal: "cut",
      lengthWeeks: 4,
      description: "",
      imageUrl: "",
    },
    validate: zodToFormikValidate(createProgramFormSchema),
    onSubmit: onFinish,
    validateOnBlur: true,
    validateOnChange: true,
  });

  // Keep the exact same gating behaviour as before (title + weeks only)
  const canProceedBasics = createProgramBasicsGateSchema.safeParse({
    title: formik.values.title,
    lengthWeeks: formik.values.lengthWeeks,
  }).success;

  return { formik, canProceedBasics };
}
