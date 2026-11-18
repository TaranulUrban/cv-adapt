"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Props = {
  cvs: { id: string; title: string | null }[];
  initialCvId: string;
  locale: "ro" | "en";
};

export default function GenerateCVForm({ cvs, initialCvId, locale }: Props) {
  const router = useRouter();
  const en = locale === "en";
  const [cvId, setCvId] = useState(initialCvId);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const inputClass = "mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isGenerating) return;
    setError("");
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, jobTitle: jobTitle.trim(), jobDescription: jobDescription.trim() }),
      });
      const result: { success?: boolean; generatedCvId?: string; error?: string } = await response.json();
      if (!response.ok || !result.success || !result.generatedCvId) {
        throw new Error(result.error || (en ? "Could not generate the CV." : "Nu am putut genera CV-ul."));
      }
      router.push(`/generated-cvs/${result.generatedCvId}`);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : (en ? "Unexpected error." : "Eroare neașteptată."));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div>
        <label htmlFor="originalCv" className="block font-medium">{en ? "Select original CV" : "Selectează CV-ul original"}</label>
        <select id="originalCv" className={inputClass} value={cvId} onChange={(event) => setCvId(event.target.value)} required>
          {cvs.map((cv) => <option key={cv.id} value={cv.id}>{cv.title || (en ? "Untitled CV" : "CV fără titlu")}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="jobTitle" className="block font-medium">Job Title</label>
        <input id="jobTitle" className={inputClass} value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} maxLength={160} required placeholder={en ? "e.g. Senior Project Manager" : "ex. Senior Project Manager"} />
      </div>
      <div>
        <label htmlFor="jobDescription" className="block font-medium">Job Description</label>
        <textarea id="jobDescription" className={inputClass} rows={10} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} minLength={50} maxLength={15000} required placeholder={en ? "Paste the job responsibilities and requirements..." : "Copiază responsabilitățile și cerințele postului..."} />
        <p className="mt-2 text-xs text-slate-500">{en ? "Minimum 50, maximum 15,000 characters." : "Minimum 50, maximum 15.000 de caractere."}</p>
      </div>
      <button type="submit" disabled={isGenerating || !cvId || !jobTitle.trim() || jobDescription.trim().length < 50} className="w-full rounded-lg bg-[#ef5135] px-5 py-4 font-semibold text-white hover:bg-[#d8432a] disabled:cursor-not-allowed disabled:opacity-50">
        {isGenerating ? (en ? "Generating CV..." : "Se generează CV-ul...") : (en ? "Generate CV with AI" : "Generează CV cu AI")}
      </button>
      {isGenerating && <p role="status" className="text-sm text-slate-600">{en ? "Please wait. Generating uses AI credits." : "Te rugăm să aștepți. Generarea consumă credite AI."}</p>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <p className="text-xs text-slate-500">{en ? "Up to 20 attempts per day, including failed attempts. AI usage may incur costs." : "Maximum 20 încercări pe zi, inclusiv cele eșuate. Generarea poate consuma credit API."}</p>
    </form>
  );
}
