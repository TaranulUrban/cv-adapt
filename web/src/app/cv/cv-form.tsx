
"use client";
import { useLocale } from "@/lib/i18n/client";
import { uiText } from "@/lib/i18n/dictionary";

import { useState } from "react";

import ExperienceSection, {
  type Experience,
} from "./experience-section";

import EducationSection, {
  type Education,
} from "./education-section";

import SkillsSection from "./skills-section";

import LanguagesSection, {
  type Language,
} from "./languages-section";

import JobSection, { type JobData } from "./job-section";

import { saveCV, updateCV } from "./save-cv";
import type { SavedCV } from "./save-cv";

type CVFormProps = {
  initialData?: SavedCV;
};

// Reatribuim ID-uri interne unice la incarcarea formularului.
// Fiecare inregistrare primeste propriul ID, chiar daca
// datele salvate anterior contin ID-uri duplicate.
function normalizeIds<T extends { id: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    id: index + 1,
  }));
}

export default function CVForm({ initialData }: CVFormProps) {
  const locale = useLocale();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: initialData?.personal_info.firstName ?? "",
    lastName: initialData?.personal_info.lastName ?? "",
    email: initialData?.personal_info.email ?? "",
    phone: initialData?.personal_info.phone ?? "",
    city: initialData?.personal_info.city ?? "",
  });

  const [experiences, setExperiences] = useState<Experience[]>(() =>
    normalizeIds(
      (initialData?.experiences as Experience[] | undefined) ?? []
    )
  );

  const [educations, setEducations] = useState<Education[]>(() =>
    normalizeIds(
      (initialData?.education as Education[] | undefined) ?? []
    )
  );

  const [skills, setSkills] = useState<string[]>(
    initialData?.skills ?? []
  );

  const [languages, setLanguages] = useState<Language[]>(() =>
    normalizeIds(initialData?.languages ?? [])
  );

  const [job, setJob] = useState<JobData>(
    initialData?.job_info ?? {
      jobUrl: "",
      jobDescription: "",
      cvLanguage: "ro",
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [savedCvId, setSavedCvId] = useState<string | null>(null);

  async function handleSave() {
    if (isSaving || (!initialData && savedCvId)) return;

    if (
      !personalInfo.firstName.trim() ||
      !personalInfo.lastName.trim()
    ) {
      setSaveMessage(
        uiText(locale, "Completează prenumele și numele înainte de salvare.")
      );
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const cvData = {
        title: `CV ${personalInfo.firstName.trim()} ${personalInfo.lastName.trim()}`,
        personal_info: {
          ...personalInfo,
          firstName: personalInfo.firstName.trim(),
          lastName: personalInfo.lastName.trim(),
        },
        experiences: experiences.map((item) => ({
          ...item,
          endDate: item.current ? "" : item.endDate,
        })),
        education: educations.map((item) => ({
          ...item,
          endDate: item.ongoing ? "" : item.endDate,
        })),
        skills,
        languages: languages.map((item) => ({
          ...item,
        })),
        job_info: job,
      };

      const id = initialData
        ? await updateCV(initialData.id, cvData)
        : await saveCV(cvData);

      setSavedCvId(id);

      setSaveMessage(
        initialData
          ? uiText(locale, "CV-ul a fost actualizat cu succes!")
          : uiText(locale, "CV-ul a fost salvat cu succes în Supabase!")
      );
    } catch (error) {
      setSaveMessage(
        error instanceof Error
          ? error.message
          : uiText(locale, "A apărut o eroare la salvare.")
      );
    } finally {
      setIsSaving(false);
    }
  }

  function updatePersonalInfo(
    field: keyof typeof personalInfo,
    value: string
  ) {
    setPersonalInfo((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3";

  return (
    <>
      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">{uiText(locale, "Date personale")}</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium"
            >{uiText(locale, "Prenume")}</label>
            <input
              id="firstName"
              type="text"
              value={personalInfo.firstName}
              onChange={(e) =>
                updatePersonalInfo("firstName", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium"
            >{uiText(locale, "Nume")}</label>
            <input
              id="lastName"
              type="text"
              value={personalInfo.lastName}
              onChange={(e) =>
                updatePersonalInfo("lastName", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) =>
                updatePersonalInfo("email", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium"
            >{uiText(locale, "Telefon")}</label>
            <input
              id="phone"
              type="tel"
              value={personalInfo.phone}
              onChange={(e) =>
                updatePersonalInfo("phone", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium"
            >{uiText(locale, "Localitate")}</label>
            <input
              id="city"
              type="text"
              value={personalInfo.city}
              onChange={(e) =>
                updatePersonalInfo("city", e.target.value)
              }
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <ExperienceSection
        value={experiences}
        onChange={setExperiences}
      />

      <EducationSection
        value={educations}
        onChange={setEducations}
      />

      <SkillsSection
        value={skills}
        onChange={setSkills}
      />

      <LanguagesSection
        value={languages}
        onChange={setLanguages}
      />

      <JobSection
        value={job}
        onChange={setJob}
      />

      <div className="mt-8 flex flex-col gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={
            isSaving ||
            (!initialData && savedCvId !== null)
          }
          className="rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? uiText(locale, "Se salvează...")
            : initialData
              ? uiText(locale, "Salvează modificările")
              : savedCvId
                ? uiText(locale, "CV salvat")
                : uiText(locale, "Salvează CV")}
        </button>

        {saveMessage && (
          <p
            role="status"
            aria-live="polite"
            className="text-sm"
          >
            {saveMessage}
          </p>
        )}
      </div>
    </>
  );
}
