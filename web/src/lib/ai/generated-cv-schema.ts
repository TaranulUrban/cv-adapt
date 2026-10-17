export const generatedCVSchema = {
  type: "object",
  properties: {
    professional_summary: {
      type: "string",
    },
    experiences: {
      type: "array",
      items: {
        type: "object",
        properties: {
          jobTitle: { type: "string" },
          company: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          current: { type: "boolean" },
          description: { type: "string" },
        },
        required: [
          "jobTitle",
          "company",
          "startDate",
          "endDate",
          "current",
          "description",
        ],
        additionalProperties: false,
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          degree: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          ongoing: { type: "boolean" },
        },
        required: [
          "institution",
          "degree",
          "startDate",
          "endDate",
          "ongoing",
        ],
        additionalProperties: false,
      },
    },
    skills: {
      type: "array",
      items: { type: "string" },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          level: { type: "string" },
        },
        required: ["name", "level"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "professional_summary",
    "experiences",
    "education",
    "skills",
    "languages",
  ],
  additionalProperties: false,
} as const;