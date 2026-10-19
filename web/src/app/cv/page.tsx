import { Suspense } from "react";
import { connection } from "next/server";
import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import CVForm from "./cv-form";

export default function CreateCVPage() {
  return <Suspense fallback={<main className="mx-auto max-w-4xl px-6 py-12">CV Adapt</main>}><CreateCVContent /></Suspense>;
}

async function CreateCVContent() {
  await connection();
  const locale = await getServerLocale();
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">{uiText(locale, "Creează CV-ul tău")}</h1>

      <p className="mt-3 text-gray-400">{uiText(locale, "Completează informațiile tale profesionale pentru a crea un CV pe care îl vom putea adapta cu AI.")}</p>

      <CVForm />
    </main>
  );
}
