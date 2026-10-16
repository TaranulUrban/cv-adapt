
"use client";

import { useState } from "react";

export type Experience = {
  id: number;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type ExperienceSectionProps = {
  value: Experience[];
  onChange: (experiences: Experience[]) => void;
};

export default function ExperienceSection({
  value,
  onChange,
}: ExperienceSectionProps) {
  const [nextId, setNextId] = useState(1);

  function addExperience() {
    onChange([
      ...value,
      {
        id: nextId,
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);

    setNextId((previous) => previous + 1);
  }

  function removeExperience(id: number) {
    onChange(value.filter((experience) => experience.id !== id));
  }

  function updateExperience(
    id: number,
    field: keyof Experience,
    newValue: string | boolean
  ) {
    onChange(
      value.map((experience) =>
        experience.id === id
          ? { ...experience, [field]: newValue }
          : experience
      )
    );
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3";

  return (
    <section className="mt-8 rounded-xl border border-gray-700 p-6">
      <h2 className="text-xl font-semibold">
        Experiență profesională
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        Adaugă experiențele tale profesionale.
        Dacă nu ai experiență, poți lăsa secțiunea goală.
      </p>

      {value.map((experience, index) => (
        <div
          key={experience.id}
          className="mt-6 border-t border-gray-700 pt-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">
              Experiența {index + 1}
            </h3>

            <button
              type="button"
              onClick={() => removeExperience(experience.id)}
              className="text-sm text-red-400 hover:underline"
            >
              Elimină
            </button>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`jobTitle-${experience.id}`}
                className="block text-sm"
              >
                Funcție
              </label>
              <input
                id={`jobTitle-${experience.id}`}
                type="text"
                value={experience.jobTitle}
                onChange={(e) =>
                  updateExperience(
                    experience.id,
                    "jobTitle",
                    e.target.value
                  )
                }
                placeholder="Ex: Project Manager"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`company-${experience.id}`}
                className="block text-sm"
              >
                Companie
              </label>
              <input
                id={`company-${experience.id}`}
                type="text"
                value={experience.company}
                onChange={(e) =>
                  updateExperience(
                    experience.id,
                    "company",
                    e.target.value
                  )
                }
                placeholder="Ex: Compania ABC"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor={`startDate-${experience.id}`}
                className="block text-sm"
              >
                Data începerii
              </label>
              <input
                id={`startDate-${experience.id}`}
                type="month"
                value={experience.startDate}
                onChange={(e) =>
                  updateExperience(
                    experience.id,
                    "startDate",
                    e.target.value
                  )
                }
                className={inputClass}
              />
            </div>

            {!experience.current && (
              <div>
                <label
                  htmlFor={`endDate-${experience.id}`}
                  className="block text-sm"
                >
                  Data încheierii
                </label>
                <input
                  id={`endDate-${experience.id}`}
                  type="month"
                  value={experience.endDate}
                  onChange={(e) =>
                    updateExperience(
                      experience.id,
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
              checked={experience.current}

              onChange={(e) => {
                const checked = e.target.checked;

                onChange(
                    value.map((item) =>
                    item.id === experience.id
                        ? {
                            ...item,
                            current: checked,
                            endDate: checked ? "" : item.endDate,
                        }
                        : item
                    )
                );
                }}
            />
            Lucrez aici în prezent
          </label>

          <div className="mt-5">
            <label
              htmlFor={`description-${experience.id}`}
              className="block text-sm"
            >
              Responsabilități și realizări
            </label>
            <textarea
              id={`description-${experience.id}`}
              rows={4}
              value={experience.description}
              onChange={(e) =>
                updateExperience(
                  experience.id,
                  "description",
                  e.target.value
                )
              }
              placeholder="Descrie responsabilitățile și realizările..."
              className={inputClass}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="mt-6 rounded-lg border border-gray-500 px-5 py-3 font-medium hover:bg-gray-800"
      >
        + Adaugă experiență
      </button>
    </section>
  );
}
