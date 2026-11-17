
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import LanguageSwitcher from "@/components/language-switcher";

type Locale = "ro" | "en";

const translations = {
  ro: {
    login: "Autentificare",
    register: "Înregistrare",
    badge: "CV-uri personalizate cu ajutorul AI",
    title: "CV-ul tău, adaptat pentru jobul pe care îl dorești.",
    description:
      "Completează experiența ta profesională, adaugă descrierea jobului și generează un CV relevant în română sau engleză. Fără experiență sau competențe inventate.",
    create: "Creează CV-ul meu",
    how: "Cum funcționează",
    howTitle: "Cum funcționează?",
    steps: [
      ["Creează CV-ul", "Introdu experiența, studiile și competențele tale."],
      ["Adaugă jobul", "Introdu linkul LinkedIn sau descrierea postului."],
      ["Generează și descarcă", "Verifică CV-ul adaptat și descarcă-l în format PDF."],
    ],
    footer: "Toate drepturile rezervate.",
  },
  en: {
    login: "Log in",
    register: "Sign up",
    badge: "AI-powered CV tailoring",
    title: "Your CV, tailored to the job you want.",
    description:
      "Add your professional experience and the job description to create a relevant CV in Romanian or English. No invented experience or skills.",
    create: "Create my CV",
    how: "How it works",
    howTitle: "How does it work?",
    steps: [
      ["Create your CV", "Add your work experience, education and skills."],
      ["Add the job", "Enter the LinkedIn link or paste the job description."],
      ["Generate and download", "Review your tailored CV and download it as a PDF."],
    ],
    footer: "All rights reserved.",
  },
} as const;

export default function Home() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 p-6 text-blue-700">CV Adapt</main>}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await connection();

  const cookieStore = await cookies();
  const locale: Locale =
    cookieStore.get("cv_adapt_locale")?.value === "en" ? "en" : "ro";

  const t = translations[locale];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl flex-col items-stretch gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-blue-700">
          CV Adapt
        </Link>

        <nav className="flex flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-3">
          <LanguageSwitcher locale={locale} />
          <Link href="/login" className="rounded-lg px-3 py-3 text-center text-sm font-medium sm:px-4 sm:text-base hover:bg-slate-200">
            {t.login}
          </Link>
          <Link href="/register" className="rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-medium sm:px-5 sm:text-base text-white hover:bg-blue-800">
            {t.register}
          </Link>
        </nav>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-28">
        <span className="mb-6 rounded-full bg-blue-100 px-3 py-2 text-xs sm:px-4 sm:text-sm font-medium text-blue-700">
          {t.badge}
        </span>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 sm:mt-8 sm:text-lg sm:leading-8 text-slate-600">
          {t.description}
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
          <Link href="/register" className="rounded-xl bg-blue-700 px-6 py-4 text-center font-semibold sm:px-8 text-white hover:bg-blue-800">
            {t.create}
          </Link>
          <a href="#cum-functioneaza" className="rounded-xl border border-slate-300 px-6 py-4 text-center font-semibold sm:px-8 hover:bg-white">
            {t.how}
          </a>
        </div>
      </section>

      <section id="cum-functioneaza" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <h2 className="mb-8 text-center text-2xl font-bold sm:mb-10 sm:text-3xl">
          {t.howTitle}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {t.steps.map(([title, description], index) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-5 text-2xl font-bold text-blue-700">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mb-3 text-xl font-semibold">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 CV Adapt. {t.footer}
      </footer>
    </main>
  );
}