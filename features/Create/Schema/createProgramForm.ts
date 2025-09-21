// schema/createProgramForm.ts
import { programSchema } from "@/entities/program/zod";
import { z } from "zod";

export const createProgramBasicsGateSchema = z.object({
  title: programSchema.shape.title.min(1, "Title is required"),
  lengthWeeks: z.coerce.number().int().min(1, "Must be ≥ 1"),
});

const fileOrHttpImage = z
  .string()
  .optional()
  .refine(
    (s) => !s || s === "" || s.startsWith("file://") || /^https?:\/\//.test(s),
    "Invalid image URI"
  );

export const createProgramFormSchema = z.object({
  title: programSchema.shape.title.min(1, "Title is required"),
  goal: programSchema.shape.goal, // "cut" | "bulk" | ...
  lengthWeeks: z.coerce.number().int().min(1, "Must be ≥ 1"),
  description: programSchema.shape.description.optional(),
  imageUrl: fileOrHttpImage, // looser than programSchema: allows file://
});

export type CreateProgramFormValues = z.infer<typeof createProgramFormSchema>;
