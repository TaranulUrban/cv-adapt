import assert from "node:assert/strict";
import { assertGeneratedCVIsValid } from "../src/lib/ai/verify-generated-cv";

const originalCV = {
  experiences: [{
    jobTitle: "Project Manager",
    company: "Test Company",
    startDate: "2022-01",
    endDate: "",
    current: true,
  }],
  education: [{
    institution: "Test University",
    degree: "Management",
    startDate: "2018-01",
    endDate: "2021-01",
    ongoing: false,
  }],
  skills: ["Jira", "Agile"],
  languages: [{ name: "English", level: "B2" }],
};

const generatedCV = {
  professional_summary: "Project Manager with Agile experience.",
  experiences: [{
    ...originalCV.experiences[0],
    description: "Coordinated projects using Jira.",
  }],
  education: [...originalCV.education],
  skills: ["Jira"],
  languages: [...originalCV.languages],
};

// Test 1: CV valid
assert.doesNotThrow(() =>
  assertGeneratedCVIsValid(originalCV, generatedCV)
);

// Test 2: Angajator inventat
assert.throws(() =>
  assertGeneratedCVIsValid(originalCV, {
    ...generatedCV,
    experiences: [{
      ...generatedCV.experiences[0],
      company: "Invented Company",
    }],
  })
);

// Test 3: Competență inventată
assert.throws(() =>
  assertGeneratedCVIsValid(originalCV, {
    ...generatedCV,
    skills: ["Jira", "AWS"],
  })
);

// Test 4: Nivel lingvistic modificat
assert.throws(() =>
  assertGeneratedCVIsValid(originalCV, {
    ...generatedCV,
    languages: [{ name: "English", level: "C2" }],
  })
);

console.log("✅ Toate cele 4 teste au trecut.");

import { protectGeneratedCV } from "../src/lib/ai/protect-generated-cv";

const modifiedByAI = {
  ...generatedCV,
  experiences: [
    {
      ...generatedCV.experiences[0],
      company: "Invented Company",
      jobTitle: "CEO",
      description: "Coordinated projects using Jira.",
    },
  ],
  education: [
    {
      ...generatedCV.education[0],
      institution: "Invented University",
    },
  ],
};

const protectedCV = protectGeneratedCV(
  {
    experiences: [{
      ...originalCV.experiences[0],
      description: "Original description.",
    }],
    education: originalCV.education,
    skills: originalCV.skills,
    languages: originalCV.languages,
  },
  modifiedByAI
);

assert.equal(
  protectedCV.experiences[0].company,
  "Test Company"
);

assert.equal(
  protectedCV.experiences[0].jobTitle,
  "Project Manager"
);

assert.equal(
  protectedCV.education[0].institution,
  "Test University"
);

console.log("✅ Protecția câmpurilor originale funcționează.");