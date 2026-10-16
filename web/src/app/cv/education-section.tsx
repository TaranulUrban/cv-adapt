
"use client";

import { useState } from "react";

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
  const [nextId, setNextId] = useState(1);

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

    setNextId((previous) => previous + 1);
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
    "mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3";

  return (
    <section className="mt-8 rounded-xl border border-gray-700 p-6">
      <h2 className="text-xl font-semibold">
        Educație și studii
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        Adaugă studiile relevante pentru CV-ul tău.
      </p>

      {value.map((education, index) => (
        <div
          key={education.id}
          className="mt-6 border-t border-gray-700 pt-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">
              Studii {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeEducation(education.id)}
              className="text-sm text-red-400 hover:underline"
            >
              Elimină
            </button>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor={`institution-${education.id}`}
                className="block text-sm"
              >
                Instituție de învățământ
              </label>
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
                placeholder="Ex: Universitatea Babeș-Bolyai"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`degree-${education.id}`}
                className="block text-sm"
              >
                Diplomă / Specializare
              </label>
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
                placeholder="Ex: Licență în Informatică"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`educationStart-${education.id}`}
                className="block text-sm"
              >
                Data începerii
              </label>
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
                >
                  Data încheierii
                </label>
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


            />
            Studiez aici în prezent
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="mt-6 rounded-lg border border-gray-500 px-5 py-3 font-medium hover:bg-gray-800"
      >
        + Adaugă studii
      </button>
    </section>
  );
}
