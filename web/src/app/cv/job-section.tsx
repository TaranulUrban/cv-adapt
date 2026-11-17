
"use client";
import { useLocale } from "@/lib/i18n/client";
import { uiText } from "@/lib/i18n/dictionary";

export type JobData = {
  jobUrl: string;
  jobDescription: string;
  cvLanguage: "ro" | "en";
};

type JobSectionProps = {
  value: JobData;
  onChange: (job: JobData) => void;
};

export default function JobSection({
  value,
  onChange,
}: JobSectionProps) {
  const locale = useLocale();

  const { jobUrl, jobDescription, cvLanguage } = value;

  function updateJob(field: keyof JobData, newValue: string) {
    onChange({
      ...value,
      [field]: newValue,
    });
  }



  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
      <h2 className="text-xl font-semibold">{uiText(locale, "Jobul pentru care aplici")}</h2>

      <p className="mt-2 text-sm text-slate-500">{uiText(locale, "Introdu linkul anunțului sau copiază descrierea postului. AI-ul va folosi cerințele jobului pentru a adapta CV-ul, fără să inventeze experiență sau competențe.")}</p>

      <div className="mt-6">
        <label htmlFor="jobUrl" className="block text-sm font-medium">{uiText(locale, "Link către anunț (LinkedIn sau alt site)")}</label>

        <input
          id="jobUrl"
          type="url"
          value={jobUrl}
          onChange={(event) => updateJob("jobUrl", event.target.value)}
          placeholder="https://www.linkedin.com/jobs/view/..."
          className="mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-base sm:px-4"
        />

        <p className="mt-2 text-xs text-slate-500">{uiText(locale, "Un link poate necesita autentificare sau poate bloca accesul automat. Descrierea copiată este varianta cea mai sigură.")}</p>
      </div>

      <div className="mt-6">
        <label htmlFor="jobDescription" className="block text-sm font-medium">{uiText(locale, "Descrierea postului")}</label>

        <textarea
          id="jobDescription"
          rows={8}
          value={jobDescription}
          onChange={(event) => updateJob("jobDescription", event.target.value)}
          placeholder={uiText(locale, "Copiază aici responsabilitățile și cerințele postului...")}
          className="mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-base sm:px-4"
        />
      </div>

      <div className="mt-6">
        <label htmlFor="cvLanguage" className="block text-sm font-medium">{uiText(locale, "Limba CV-ului")}</label>

        <select
          id="cvLanguage"
          value={cvLanguage}
          onChange={(event) => updateJob("cvLanguage", event.target.value)}
          className="mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-base sm:px-4"
        >
          <option value="ro" className="bg-gray-900">{uiText(locale, "Română")}</option>
          <option value="en" className="bg-gray-900">{uiText(locale, "Engleză")}</option>
        </select>
      </div>
    </section>
  );
}
