// utils/zodToFormik.ts
import { ZodSchema } from "zod";

/** Minimal adapter: convert Zod issues into Formik { [path]: message } */
export const zodToFormikValidate =
  <T extends ZodSchema<any>>(schema: T) =>
  (values: unknown) => {
    const result = schema.safeParse(values);
    if (result.success) return {};
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (!errors[path]) errors[path] = issue.message;
    }
    return errors;
  };
