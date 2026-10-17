import "server-only";
import OpenAI from "openai";

import { CV_ADAPT_INSTRUCTIONS } from "./cv-prompt";
import { generatedCVSchema } from "./generated-cv-schema";
import { generatedCVValidationSchema } from "./generated-cv-validation";

export async function generateAdaptedCV(
  cvData: {
    experiences: unknown[];
    education: unknown[];
    skills: string[];
    languages: unknown[];
  },
  jobDescription: string,
  cvLanguage: "ro" | "en"
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 0,
  });

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    reasoning: { effort: "minimal" },

    instructions: CV_ADAPT_INSTRUCTIONS,

    input: JSON.stringify({
      cv: cvData,
      job_description: jobDescription,
      output_language: cvLanguage,
    }),

    text: {
      format: {
        type: "json_schema",
        name: "adapted_cv",
        strict: true,
        schema: generatedCVSchema,
      },
    },

    max_output_tokens: 4000,
    store: false,
  });

  if (response.status !== "completed" || !response.output_text) {
    throw new Error("Generarea AI nu a returnat un rezultat complet.");
  }

  const parsedJson: unknown = JSON.parse(response.output_text);

const validatedCV =
  generatedCVValidationSchema.parse(parsedJson);

return {
    content: validatedCV,
    model: response.model,
    usage: response.usage,
    };
}