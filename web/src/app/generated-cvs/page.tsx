import LocalizedText from "@/components/localized-text";
import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default function GeneratedCVsListPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold">
              CV-uri generate cu AI
            </h1>
            <p className="mt-4 text-gray-400">
              <LocalizedText source="Se încarcă CV-urile generate..." />
            </p>
          </div>
        </main>
      }
    >
      <GeneratedCVsContent />
    </Suspense>
  );
}

async function GeneratedCVsContent() {
  const locale = await getServerLocale();

  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: generatedCVs, error } = await supabase
    .from("generated_cvs")
    .select(
      "id, original_cv_id, cv_language, ai_model, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="text-sm text-blue-400 hover:underline"
        >{uiText(locale, "← Înapoi la Dashboard")}</Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-blue-400">
            CV Adapt
          </p>

          <h1 className="mt-2 text-3xl font-bold">{uiText(locale, "CV-uri generate cu AI")}</h1>

          <p className="mt-3 text-gray-400">{uiText(locale, "Aici găsești versiunile adaptate ale CV-urilor tale. Verifică fiecare rezultat înainte de utilizare.")}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/my-cvs"
            className="rounded-lg border border-gray-600 px-4 py-3 text-sm font-medium hover:bg-gray-800"
          >{uiText(locale, "CV-urile originale")}</Link>

          <Link
            href="/cv"
            className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium hover:bg-blue-700"
          >{uiText(locale, "+ Creează CV nou")}</Link>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-red-800 p-4 text-red-400"
          >{uiText(locale, "Nu am putut încărca CV-urile generate. Încearcă din nou.")}</p>
        ) : generatedCVs && generatedCVs.length > 0 ? (
          <div className="mt-8 space-y-4">
            {generatedCVs.map((cv) => (
              <article
                key={cv.id}
                className="rounded-xl border border-gray-700 bg-slate-900 p-6"
              >
                <h2 className="text-lg font-semibold">{uiText(locale, "CV adaptat cu AI")}</h2>

                <p className="mt-3 text-sm text-gray-400">
                  {uiText(locale, "Generat la:")}{" "}
                  {new Date(cv.created_at).toLocaleDateString(
                    locale === "en" ? "en-GB" : "ro-RO",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      timeZone: "Europe/Bucharest",
                    }
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  {uiText(locale, "Limba")}:{" "}
                  {cv.cv_language === "en"
                    ? uiText(locale, "Engleză")
                    : uiText(locale, "Română")}
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  AI model: {cv.ai_model}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/generated-cvs/${cv.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
                  >{uiText(locale, "Previzualizează CV")}</Link>

                  <Link
                    href={`/my-cvs/${cv.original_cv_id}`}
                    className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-800"
                  >{uiText(locale, "Vezi originalul")}</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-xl border border-gray-700 p-8 text-center">
            <h2 className="text-lg font-semibold">{uiText(locale, "Nu ai CV-uri generate încă")}</h2>

            <p className="mt-3 text-gray-400">{uiText(locale, "După prima generare AI finalizată cu succes, CV-ul adaptat va apărea aici.")}</p>

            <Link
              href="/my-cvs"
              className="mt-5 inline-block text-blue-400 hover:underline"
            >{uiText(locale, "Vezi CV-urile originale →")}</Link>
          </section>
        )}
      </div>
    </main>
  );
}
