
"use client";
import { useLocale } from "@/lib/i18n/client";
import { uiText } from "@/lib/i18n/dictionary";


export type Education = {
  id: number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
};

type EducationSectionProps = {
  value: Education[];
  onChange: (educations: Education[]) => void;
};

export default function EducationSection({
  value,
  onChange,
}: EducationSectionProps) {
  const locale = useLocale();

  const nextId = Math.max(0, ...value.map((item) => item.id)) + 1;

  function addEducation() {
    onChange([
      ...value,
      {
        id: nextId,
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        ongoing: false,
      },
    ]);

    
  }

  function removeEducation(id: number) {
    onChange(value.filter((education) => education.id !== id));
  }

  function updateEducation(
    id: number,
    field: keyof Education,
    newValue: string | boolean
  ) {
    onChange(
      value.map((education) =>
        education.id === id
          ? { ...education, [field]: newValue }
          : education
      )
    );
  }

  const inputClass =
    "mt-2 block w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-3 text-base sm:px-4";

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm p-4 sm:mt-8 sm:p-6">
      <h2 className="text-xl font-semibold">{uiText(locale, "Educație și studii")}</h2>

      <p className="mt-2 text-sm text-slate-500">{uiText(locale, "Adaugă studiile relevante pentru CV-ul tău.")}</p>

      {value.map((education, index) => (
        <div
          key={education.id}
          className="mt-6 border-t border-slate-200 pt-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">
              {uiText(locale, "Studii")} {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeEducation(education.id)}
              className="text-sm text-red-400 hover:underline"
            >{uiText(locale, "Elimină")}</button>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor={`institution-${education.id}`}
                className="block text-sm"
              >{uiText(locale, "Instituție de învățământ")}</label>
              <input
                id={`institution-${education.id}`}
                type="text"
                value={education.institution}
                onChange={(e) =>
                  updateEducation(
                    education.id,
                    "institution",
                    e.target.value
                  )
                }
                placeholder={uiText(locale, "Ex: Universitatea Babeș-Bolyai")}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`degree-${education.id}`}
                className="block text-sm"
              >{uiText(locale, "Diplomă / Specializare")}</label>
              <input
                id={`degree-${education.id}`}
                type="text"
                value={education.degree}
                onChange={(e) =>
                  updateEducation(
                    education.id,
                    "degree",
                    e.target.value
                  )
                }
                placeholder={uiText(locale, "Ex: Licență în Informatică")}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`educationStart-${education.id}`}
                className="block text-sm"
              >{uiText(locale, "Data începerii")}</label>
              <input
                id={`educationStart-${education.id}`}
                type="month"
                value={education.startDate}
                onChange={(e) =>
                  updateEducation(
                    education.id,
                    "startDate",
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            {!education.ongoing && (
              <div>
                <label
                  htmlFor={`educationEnd-${education.id}`}
                  className="block text-sm"
                >{uiText(locale, "Data încheierii")}</label>
                <input
                  id={`educationEnd-${education.id}`}
                  type="month"
                  value={education.endDate}
                  onChange={(e) =>
                    updateEducation(
                      education.id,
                      "endDate",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={education.ongoing}

              onChange={(e) => {
  const checked = e.target.checked;

  onChange(
    value.map((item) =>
      item.id === education.id
        ? {
            ...item,
            ongoing: checked,
            endDate: checked ? "" : item.endDate,
          }
        : item
    )
  );
}}


            />{uiText(locale, "Studiez aici în prezent")}</label>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="mt-6 rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-orange-50"
      >{uiText(locale, "+ Adaugă studii")}</button>
    </section>
  );
}
