
"use client";

import { useState } from "react";

export type Language = {
  id: number;
  name: string;
  level: string;
};

type LanguagesSectionProps = {
  value: Language[];
  onChange: (languages: Language[]) => void;
};

const levels = [
  { value: "A1", label: "A1 — Începător" },
  { value: "A2", label: "A2 — Elementar" },
  { value: "B1", label: "B1 — Intermediar" },
  { value: "B2", label: "B2 — Intermediar avansat" },
  { value: "C1", label: "C1 — Avansat" },
  { value: "C2", label: "C2 — Expert" },
  { value: "native", label: "Limbă maternă" },
];

export default function LanguagesSection({
  value,
  onChange,
}: LanguagesSectionProps) {
  const [nextId, setNextId] = useState(1);

  function addLanguage() {
    onChange([
      ...value,
      { id: nextId, name: "", level: "B1" },
    ]);
    setNextId((previous) => previous + 1);
  }

  function updateLanguage(
    id: number,
    field: "name" | "level",
    newValue: string
  ) {
    onChange(
      value.map((language) =>
        language.id === id
          ? { ...language, [field]: newValue }
          : language
      )
    );
  }

  function removeLanguage(id: number) {
    onChange(value.filter((language) => language.id !== id));
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3";

  return (
    <section className="mt-8 rounded-xl border border-gray-700 p-6">
      <h2 className="text-xl font-semibold">
        Limbi străine
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        Adaugă limbile cunoscute și nivelul tău real.
      </p>

      {value.map((language, index) => (
        <div
          key={language.id}
          className="mt-6 border-t border-gray-700 pt-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">
              Limba {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeLanguage(language.id)}
              className="text-sm text-red-400 hover:underline"
            >
              Elimină
            </button>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`language-${language.id}`}
                className="block text-sm"
              >
                Limba
              </label>
              <input
                id={`language-${language.id}`}
                type="text"
                value={language.name}
                onChange={(e) =>
                  updateLanguage(
                    language.id,
                    "name",
                    e.target.value
                  )
                }
                placeholder="Ex: Engleză"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`level-${language.id}`}
                className="block text-sm"
              >
                Nivel
              </label>
              <select
                id={`level-${language.id}`}
                value={language.level}
                onChange={(e) =>
                  updateLanguage(
                    language.id,
                    "level",
                    e.target.value
                  )
                }
                className={inputClass}
              >
                {levels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                    className="bg-gray-900"
                  >
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addLanguage}
        className="mt-6 rounded-lg border border-gray-500 px-5 py-3 font-medium hover:bg-gray-800"
      >
        + Adaugă limbă
      </button>
    </section>
  );
}
