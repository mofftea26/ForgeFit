import { ZodError, ZodTypeAny } from "zod";

type FormikErrors = Record<string, any>;

function setDeep(obj: any, path: (string | number)[], msg: string) {
  const key = path[0];
  if (path.length === 1) {
    obj[key] = msg;
    return;
  }
  if (!(key in obj)) obj[key] = typeof path[1] === "number" ? [] : {};
  setDeep(obj[key], path.slice(1), msg);
}

/** Convert ZodError into Formik's nested error object */
export function zodToFormikErrors(err: ZodError): FormikErrors {
  const out: FormikErrors = {};
  for (const issue of err.issues) {
    const path = issue.path.map((seg) =>
      typeof seg === "number" ? seg : String(seg)
    );
    setDeep(out, path, issue.message);
  }
  return out;
}

/** Create a Formik-compatible validate() from a Zod schema */
export function makeFormikValidator<T extends ZodTypeAny>(schema: T) {
  return (values: unknown) => {
    const parsed = schema.safeParse(values);
    if (parsed.success) return {};
    return zodToFormikErrors(parsed.error);
  };
}
