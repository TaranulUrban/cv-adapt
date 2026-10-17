import { z } from "zod";

const experienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string(),
});

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  ongoing: z.boolean(),
});

const languageSchema = z.object({
  name: z.string(),
  level: z.string(),
});

export const originalCVSchema = z.object({
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  languages: z.array(languageSchema),
});