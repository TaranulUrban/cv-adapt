import { Suspense } from "react";
import { connection } from "next/server";
import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import CVForm from "./cv-form";

export default function CreateCVPage() {
  return <Suspense fallback={<main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">CV Adapt</main>}><CreateCVContent /></Suspense>;
}

async function CreateCVContent() {
  await connection();
  const locale = await getServerLocale();
  return (
    <main className="min-h-screen w-full bg-[#fffaf7] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold sm:text-3xl">{uiText(locale, "Creează CV-ul tău")}</h1>

      <p className="mt-3 text-slate-500">{uiText(locale, "Completează informațiile tale profesionale pentru a crea un CV pe care îl vom putea adapta cu AI.")}</p>

      <CVForm />
      </div>
    </main>
  );
}
