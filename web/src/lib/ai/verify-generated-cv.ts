import type { GeneratedCV } from "./generated-cv";

type OriginalExperience = {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
};

export function verifyGeneratedExperiences(
  originalExperiences: OriginalExperience[],
  generatedCV: GeneratedCV
): boolean {
  if (originalExperiences.length !== generatedCV.experiences.length) {
    return false;
  }

  return originalExperiences.every((original, index) => {
    const generated = generatedCV.experiences[index];

    return (
      generated.jobTitle === original.jobTitle &&
      generated.company === original.company &&
      generated.startDate === original.startDate &&
      generated.endDate === original.endDate &&
      generated.current === original.current
    );
  });
}

  type OriginalEducation = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
};

export function verifyGeneratedEducation(
  originalEducation: OriginalEducation[],
  generatedCV: GeneratedCV
): boolean {
  if (originalEducation.length !== generatedCV.education.length) {
    return false;
  }

  return originalEducation.every((original, index) => {
    const generated = generatedCV.education[index];

    return (
      generated.institution === original.institution &&
      generated.degree === original.degree &&
      generated.startDate === original.startDate &&
      generated.endDate === original.endDate &&
      generated.ongoing === original.ongoing
    );
  });
}

export function verifyGeneratedSkills(
  originalSkills: string[],
  generatedCV: GeneratedCV
): boolean {
  const originalSet = new Set(
    originalSkills.map((skill) => skill.trim().toLowerCase())
  );

  return generatedCV.skills.every((skill) =>
    originalSet.has(skill.trim().toLowerCase())
  );
}

type OriginalLanguage = {
  name: string;
  level: string;
};

export function verifyGeneratedLanguages(
  originalLanguages: OriginalLanguage[],
  generatedCV: GeneratedCV
): boolean {
  const originalMap = new Map(
    originalLanguages.map((language) => [
      language.name.trim().toLowerCase(),
      language.level.trim().toLowerCase(),
    ])
  );

  const generatedNames = generatedCV.languages.map((language) =>
    language.name.trim().toLowerCase()
  );

  if (new Set(generatedNames).size !== generatedNames.length) {
    return false;
  }

  return generatedCV.languages.every((language) => {
    const originalLevel = originalMap.get(
      language.name.trim().toLowerCase()
    );

    return (
      originalLevel !== undefined &&
      originalLevel === language.level.trim().toLowerCase()
    );
  });
}

export function verifyGeneratedCV(
  originalCV: {
    experiences: OriginalExperience[];
    education: OriginalEducation[];
    skills: string[];
    languages: OriginalLanguage[];
  },
  generatedCV: GeneratedCV
): boolean {
  return (
    verifyGeneratedExperiences(originalCV.experiences, generatedCV) &&
    verifyGeneratedEducation(originalCV.education, generatedCV) &&
    verifyGeneratedSkills(originalCV.skills, generatedCV) &&
    verifyGeneratedLanguages(originalCV.languages, generatedCV)
  );
}

export function assertGeneratedCVIsValid(
  originalCV: {
    experiences: OriginalExperience[];
    education: OriginalEducation[];
    skills: string[];
    languages: OriginalLanguage[];
  },
  generatedCV: GeneratedCV
): void {
  const checks = {
    experiences: verifyGeneratedExperiences(originalCV.experiences, generatedCV),
    education: verifyGeneratedEducation(originalCV.education, generatedCV),
    skills: verifyGeneratedSkills(originalCV.skills, generatedCV),
    languages: verifyGeneratedLanguages(originalCV.languages, generatedCV),
  };

  const failedChecks = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);

  if (failedChecks.length > 0) {
    throw new Error(
      `CV validation failed: ${failedChecks.join(", ")}`
    );
  }
}