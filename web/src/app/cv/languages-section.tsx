
"use client";
import { useLocale } from "@/lib/i18n/client";
import { uiText } from "@/lib/i18n/dictionary";


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
  const locale = useLocale();

  const nextId = Math.max(0, ...value.map((item) => item.id)) + 1;

  function addLanguage() {
    onChange([
      ...value,
      { id: nextId, name: "", level: "B1" },
    ]);
    
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
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3";

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
      <h2 className="text-xl font-semibold">{uiText(locale, "Limbi străine")}</h2>

      <p className="mt-2 text-sm text-slate-500">{uiText(locale, "Adaugă limbile cunoscute și nivelul tău real.")}</p>

      {value.map((language, index) => (
        <div
          key={language.id}
          className="mt-6 border-t border-slate-200 pt-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">
              {uiText(locale, "Limba")} {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeLanguage(language.id)}
              className="text-sm text-red-400 hover:underline"
            >{uiText(locale, "Elimină")}</button>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`language-${language.id}`}
                className="block text-sm"
              >{uiText(locale, "Limba")}</label>
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
                placeholder={uiText(locale, "Ex: Engleză")}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`level-${language.id}`}
                className="block text-sm"
              >{uiText(locale, "Nivel")}</label>
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
                    {uiText(locale, level.label)}
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
        className="mt-6 rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-orange-50"
      >{uiText(locale, "+ Adaugă limbă")}</button>
    </section>
  );
}
