import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GenerateAIButton from "./generate-ai-button";


type Experience = {
  id: number;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type Education = {
  id: number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
};

type Language = {
  id: number;
  name: string;
  level: string;
};

type PersonalInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
};

type JobInfo = {
  jobUrl?: string;
  jobDescription?: string;
  cvLanguage?: string;
};

export default async function CVDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const locale = await getServerLocale();

  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: cv, error } = await supabase
    .from("cvs")
    .select(
      "id, title, personal_info, experiences, education, skills, languages, job_info"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(uiText(locale, "Nu am putut încărca CV-ul."));
  }

  if (!cv) {
    notFound();
  }

  const personal = (cv.personal_info ?? {}) as PersonalInfo;
  const experiences = (cv.experiences ?? []) as Experience[];
  const education = (cv.education ?? []) as Education[];
  const skills = (cv.skills ?? []) as string[];
  const languages = (cv.languages ?? []) as Language[];
  const job = (cv.job_info ?? {}) as JobInfo;

  const hasValidJobDescription =
    typeof job.jobDescription === "string" &&
    job.jobDescription.trim().length >= 50 &&
    job.jobDescription.length <= 15000;

  const hasValidLanguage =
    job.cvLanguage === "ro" || job.cvLanguage === "en";

  const canGenerate = hasValidJobDescription && hasValidLanguage;

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/my-cvs"
          className="text-sm text-[#d8432a] hover:underline"
        >{uiText(locale, "← Înapoi la CV-urile mele")}</Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {cv.title || uiText(locale, "CV fără titlu")}
            </h1>

            <p className="mt-3 text-slate-500">{uiText(locale, "Acesta este CV-ul tău original.")}</p>
          </div>

          <Link
            href={`/my-cvs/${cv.id}/edit`}
            className="rounded-lg border border-slate-300 px-5 py-3 text-center font-medium hover:bg-orange-50"
          >{uiText(locale, "Editează CV")}</Link>
        </div>

        <section className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-6">
          <h2 className="text-xl font-semibold">{uiText(locale, "Adaptează CV-ul cu AI")}</h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">{uiText(locale, "GPT-5 mini va adapta descrierile profesionale pentru jobul ales, păstrând informațiile originale.")}</p>

          {canGenerate ? (
            <GenerateAIButton cvId={cv.id} />
          ) : (
            <div className="mt-5">
              <p className="text-sm text-amber-800">{uiText(locale, "Pentru generare ai nevoie de o descriere a jobului de minimum 50 de caractere și de limba CV-ului (română sau engleză).")}</p>

              <Link
                href={`/my-cvs/${cv.id}/edit`}
                className="mt-4 inline-block rounded-lg bg-[#ef5135] px-4 py-3 text-sm font-medium hover:bg-[#d8432a] text-white"
              >{uiText(locale, "Completează informațiile")}</Link>
            </div>
          )}
        </section>

        <section className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
          <h2 className="text-xl font-semibold">{uiText(locale, "Date personale")}</h2>

          <div className="mt-4 space-y-2">
            <p>
              {personal.firstName} {personal.lastName}
            </p>
            {personal.email && <p>{personal.email}</p>}
            {personal.phone && <p>{personal.phone}</p>}
            {personal.city && <p>{personal.city}</p>}
          </div>
        </section>

        <section className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
          <h2 className="text-xl font-semibold">{uiText(locale, "Experiență profesională")}</h2>

          {experiences.length === 0 ? (
            <p className="mt-4 text-slate-500">{uiText(locale, "Nu există experiențe adăugate.")}</p>
          ) : (
            experiences.map((experience, index) => (
              <article
                key={`${experience.id}-${index}`}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold">
                  {experience.jobTitle}
                </h3>

                <p className="mt-1">{experience.company}</p>

                <p className="mt-1 text-sm text-slate-500">
                  {experience.startDate} –{" "}
                  {experience.current
                    ? uiText(locale, "Prezent")
                    : experience.endDate}
                </p>

                <p className="mt-3 whitespace-pre-wrap leading-7">
                  {experience.description}
                </p>
              </article>
            ))
          )}
        </section>

        <section className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
          <h2 className="text-xl font-semibold">{uiText(locale, "Educație și studii")}</h2>

          {education.length === 0 ? (
            <p className="mt-4 text-slate-500">{uiText(locale, "Nu există studii adăugate.")}</p>
          ) : (
            education.map((item, index) => (
              <article
                key={`${item.id}-${index}`}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold">
                  {item.institution}
                </h3>

                <p className="mt-1">{item.degree}</p>

                <p className="mt-1 text-sm text-slate-500">
                  {item.startDate} –{" "}
                  {item.ongoing
                    ? uiText(locale, "Prezent")
                    : item.endDate}
                </p>
              </article>
            ))
          )}
        </section>

        <section className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
          <h2 className="text-xl font-semibold">{uiText(locale, "Competențe profesionale")}</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <p className="text-slate-500">{uiText(locale, "Nu există competențe adăugate.")}</p>
            ) : (
              skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-slate-300 px-3 py-2 text-sm"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </section>

        <section className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
          <h2 className="text-xl font-semibold">{uiText(locale, "Limbi străine")}</h2>

          {languages.length === 0 ? (
            <p className="mt-4 text-slate-500">{uiText(locale, "Nu există limbi adăugate.")}</p>
          ) : (
            languages.map((language, index) => (
              <p
                key={`${language.id}-${index}`}
                className="mt-3"
              >
                {language.name} — {language.level}
              </p>
            ))
          )}
        </section>

        <section className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
          <h2 className="text-xl font-semibold">{uiText(locale, "Jobul pentru care aplici")}</h2>

          <p className="mt-4">
            {uiText(locale, "Limba CV-ului")}:{" "}
            {job.cvLanguage === "en"
              ? uiText(locale, "Engleză")
              : job.cvLanguage === "ro"
                ? uiText(locale, "Română")
                : uiText(locale, "Neselectată")}
          </p>

          {job.jobUrl && (
            <p className="mt-3 break-all text-[#d8432a]">
              {job.jobUrl}
            </p>
          )}

          {job.jobDescription ? (
            <p className="mt-3 whitespace-pre-wrap leading-7">
              {job.jobDescription}
            </p>
          ) : (
            <p className="mt-3 text-slate-500">{uiText(locale, "Nu ai adăugat o descriere de job.")}</p>
          )}
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <Link
            href={`/my-cvs/${cv.id}/edit`}
            className="rounded-lg border border-slate-300 px-5 py-3 text-center font-medium hover:bg-orange-50"
          >{uiText(locale, "Editează CV")}</Link>

          <Link
            href="/generated-cvs"
            className="rounded-lg border border-slate-300 px-5 py-3 text-center font-medium hover:bg-orange-50"
          >{uiText(locale, "CV-uri generate cu AI")}</Link>
        </div>
      </div>
    </main>
  );
}
