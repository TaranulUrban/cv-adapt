
"use client";

import { useState } from "react";

type Experience = {
  id: number;
  current: boolean;
};

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [nextId, setNextId] = useState(1);

  function addExperience() {
    setExperiences((previous) => [
      ...previous,
      { id: nextId, current: false },
    ]);
    setNextId((previous) => previous + 1);
  }

  function removeExperience(id: number) {
    setExperiences((previous) =>
      previous.filter((experience) => experience.id !== id)
    );
  }

  function toggleCurrent(id: number, checked: boolean) {
    setExperiences((previous) =>
      previous.map((experience) =>
        experience.id === id
          ? { ...experience, current: checked }
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
        Adaugă locurile de muncă relevante pentru CV-ul tău.
        Dacă nu ai experiență profesională, poți lăsa această
        secțiune necompletată.
      </p>

      {experiences.map((experience, index) => (
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
                  className={inputClass}
                />
              </div>
            )}
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={experience.current}
              onChange={(event) =>
                toggleCurrent(experience.id, event.target.checked)
              }
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
              placeholder="Descrie principalele responsabilități și realizări..."
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
