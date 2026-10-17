import type { GeneratedCV } from "./generated-cv";

export function protectGeneratedCV(
  originalCV: {
    experiences: GeneratedCV["experiences"];
    education: GeneratedCV["education"];
    skills: string[];
    languages: GeneratedCV["languages"];
  },
  generatedCV: GeneratedCV
): GeneratedCV {
  if (
    originalCV.experiences.length !== generatedCV.experiences.length ||
    originalCV.education.length !== generatedCV.education.length
  ) {
    throw new Error("AI_CV_STRUCTURE_MISMATCH");
  }

  return {
    professional_summary: generatedCV.professional_summary,

    experiences: originalCV.experiences.map((original, index) => ({
      ...original,
      description: generatedCV.experiences[index].description,
    })),

    education: originalCV.education,

    skills: generatedCV.skills,

    languages: generatedCV.languages,
  };
}