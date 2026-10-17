import { z } from "zod";

const experienceSchema = z.strictObject({
  jobTitle: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string(),
});

const educationSchema = z.strictObject({
  institution: z.string(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  ongoing: z.boolean(),
});

const languageSchema = z.strictObject({
  name: z.string(),
  level: z.string(),
});

export const generatedCVValidationSchema = z.strictObject({
  professional_summary: z.string(),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  languages: z.array(languageSchema),
});