
"use client";

import { useState } from "react";

export default function JobSection() {
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvLanguage, setCvLanguage] = useState("ro");

  return (
    <section className="mt-8 rounded-xl border border-gray-700 p-6">
      <h2 className="text-xl font-semibold">
        Jobul pentru care aplici
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        Introdu linkul anunțului sau copiază descrierea
        postului. AI-ul va folosi cerințele jobului pentru
        a adapta CV-ul, fără să inventeze experiență
        sau competențe.
      </p>

      <div className="mt-6">
        <label htmlFor="jobUrl" className="block text-sm font-medium">
          Link către anunț (LinkedIn sau alt site)
        </label>

        <input
          id="jobUrl"
          type="url"
          value={jobUrl}
          onChange={(event) => setJobUrl(event.target.value)}
          placeholder="https://www.linkedin.com/jobs/view/..."
          className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
        />

        <p className="mt-2 text-xs text-gray-400">
          Un link poate necesita autentificare sau poate
          bloca accesul automat. Descrierea copiată este
          varianta cea mai sigură.
        </p>
      </div>

      <div className="mt-6">
        <label htmlFor="jobDescription" className="block text-sm font-medium">
          Descrierea postului
        </label>

        <textarea
          id="jobDescription"
          rows={8}
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Copiază aici responsabilitățile și cerințele postului..."
          className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
        />
      </div>

      <div className="mt-6">
        <label htmlFor="cvLanguage" className="block text-sm font-medium">
          Limba CV-ului
        </label>

        <select
          id="cvLanguage"
          value={cvLanguage}
          onChange={(event) => setCvLanguage(event.target.value)}
          className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
        >
          <option value="ro" className="bg-gray-900">
            Română
          </option>
          <option value="en" className="bg-gray-900">
            Engleză
          </option>
        </select>
      </div>
    </section>
  );
}
