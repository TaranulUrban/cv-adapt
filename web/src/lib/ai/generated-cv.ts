export type GeneratedExperience = {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type GeneratedEducation = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
};

export type GeneratedLanguage = {
  name: string;
  level: string;
};

export type GeneratedCV = {
  professional_summary: string;
  experiences: GeneratedExperience[];
  education: GeneratedEducation[];
  skills: string[];
  languages: GeneratedLanguage[];
};