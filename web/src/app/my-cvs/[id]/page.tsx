
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    throw new Error("Nu am putut încărca CV-ul.");
  }

  if (!cv) {
    notFound();
  }

  const personal = cv.personal_info as PersonalInfo;
  const experiences = cv.experiences as Experience[];
  const education = cv.education as Education[];
  const skills = cv.skills as string[];
  const languages = cv.languages as Language[];
  const job = cv.job_info as JobInfo;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href="/my-cvs"
        className="text-sm text-blue-400 hover:underline"
      >
        ← Înapoi la CV-urile mele
      </Link>

      <h1 className="mt-6 text-3xl font-bold">{cv.title}</h1>
      <Link href={`/my-cvs/${cv.id}/edit`} className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"> Editează CV </Link>

      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">Date personale</h2>

        <p className="mt-4">
          {personal.firstName} {personal.lastName}
        </p>
        <p>{personal.email}</p>
        <p>{personal.phone}</p>
        <p>{personal.city}</p>
      </section>

      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">
          Experiență profesională
        </h2>

        {experiences.length === 0 ? (
          <p className="mt-4 text-gray-400">
            Nu există experiențe adăugate.
          </p>
        ) : (
          experiences.map((experience) => (
            <div key={experience.id} className="mt-5">
              <h3 className="font-semibold">
                {experience.jobTitle}
              </h3>
              <p>{experience.company}</p>
              <p className="text-sm text-gray-400">
                {experience.startDate} –{" "}
                {experience.current
                  ? "Prezent"
                  : experience.endDate}
              </p>
              <p className="mt-2 whitespace-pre-wrap">
                {experience.description}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">
          Educație și studii
        </h2>

        {education.length === 0 ? (
          <p className="mt-4 text-gray-400">
            Nu există studii adăugate.
          </p>
        ) : (
          education.map((item) => (
            <div key={item.id} className="mt-5">
              <h3 className="font-semibold">
                {item.institution}
              </h3>
              <p>{item.degree}</p>
              <p className="text-sm text-gray-400">
                {item.startDate} –{" "}
                {item.ongoing ? "Prezent" : item.endDate}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">
          Competențe profesionale
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-gray-600 px-3 py-2 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">Limbi străine</h2>

        {languages.map((language) => (
          <p key={language.id} className="mt-3">
            {language.name} — {language.level}
          </p>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">
          Jobul pentru care aplici
        </h2>

        <p className="mt-4">
          Limba CV-ului:{" "}
          {job?.cvLanguage === "en" ? "Engleză" : "Română"}
        </p>

        {job?.jobUrl && (
          <p className="mt-3 break-all">{job.jobUrl}</p>
        )}

        {job?.jobDescription && (
          <p className="mt-3 whitespace-pre-wrap">
            {job.jobDescription}
          </p>
        )}
      </section>
    </main>
  );
}
