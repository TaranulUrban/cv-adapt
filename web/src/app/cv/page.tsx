
import ExperienceSection from "./experience-section";
import EducationSection from "./education-section";
import SkillsSection from "./skills-section";
import LanguagesSection from "./languages-section";
import JobSection from "./job-section";

export default function CreateCVPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Creează CV-ul tău
      </h1>

      <p className="mt-3 text-gray-400">
        Completează informațiile tale profesionale pentru
        a crea un CV pe care îl vom putea adapta cu AI.
      </p>

      <section className="mt-8 rounded-xl border border-gray-700 p-6">
        <h2 className="text-xl font-semibold">
          Date personale
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium">
              Prenume
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Ex: Andrei"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium">
              Nume
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Ex: Popescu"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="exemplu@email.com"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+40 7xx xxx xxx"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium">
              Localitate
            </label>
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              placeholder="Ex: Cluj-Napoca"
              className="mt-2 w-full rounded-lg border border-gray-600 bg-transparent px-4 py-3"
            />
          </div>
        </div>
      </section>

    <ExperienceSection />
    <EducationSection />
    <SkillsSection />
    <LanguagesSection />
    <JobSection />  
    </main>
  );
}
