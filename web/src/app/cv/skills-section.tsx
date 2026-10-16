
"use client";

import { useState } from "react";

export default function SkillsSection() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  function addSkill() {
    const skill = newSkill.trim();

    if (!skill) return;

    if (skills.some((item) => item.toLowerCase() === skill.toLowerCase())) {
      return;
    }

    setSkills((previous) => [...previous, skill]);
    setNewSkill("");
  }

  function removeSkill(skill: string) {
    setSkills((previous) =>
      previous.filter((item) => item !== skill)
    );
  }

  return (
    <section className="mt-8 rounded-xl border border-gray-700 p-6">
      <h2 className="text-xl font-semibold">
        Competențe profesionale
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        Adaugă doar competențele pe care le deții.
        AI-ul le va putea evidenția în funcție de
        cerințele jobului, fără să inventeze altele.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newSkill}
          onChange={(event) => setNewSkill(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSkill();
            }
          }}
          placeholder="Ex: Project Management"
          aria-label="Competență nouă"
          className="w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
        />

        <button
          type="button"
          onClick={addSkill}
          className="rounded-lg border border-gray-500 px-5 py-3 font-medium hover:bg-gray-800"
        >
          + Adaugă
        </button>
      </div>

      {skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-full border border-gray-600 px-3 py-2 text-sm"
            >
              {skill}

              <button
                type="button"
                onClick={() => removeSkill(skill)}
                aria-label={`Elimină ${skill}`}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
