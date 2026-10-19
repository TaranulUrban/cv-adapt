import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function MyCVsPage() {
  await connection();
  const locale = await getServerLocale();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: cvs, error } = await supabase
    .from("cvs")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="text-sm text-blue-400 hover:underline"
        >{uiText(locale, "← Înapoi la Dashboard")}</Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{uiText(locale, "CV-urile mele")}</h1>

            <p className="mt-3 text-gray-400">{uiText(locale, "Aici găsești CV-urile originale salvate în contul tău.")}</p>
          </div>

          <Link
            href="/cv"
            className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >{uiText(locale, "+ Creează CV nou")}</Link>
        </div>

        <Link
          href="/generated-cvs"
          className="mt-6 inline-block text-sm text-blue-400 hover:underline"
        >{uiText(locale, "Vezi CV-urile generate cu AI →")}</Link>

        {error ? (
          <p
            role="alert"
            className="mt-8 rounded-lg border border-red-800 p-4 text-red-400"
          >{uiText(locale, "Nu am putut încărca CV-urile. Încearcă din nou.")}</p>
        ) : cvs && cvs.length > 0 ? (
          <div className="mt-8 space-y-4">
            {cvs.map((cv) => (
              <article
                key={cv.id}
                className="rounded-xl border border-gray-700 bg-slate-900 p-6"
              >
                <h2 className="text-lg font-semibold">
                  {cv.title || uiText(locale, "CV fără titlu")}
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  {uiText(locale, "Creat la:")}{" "}
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

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/my-cvs/${cv.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
                  >{uiText(locale, "Vezi CV")}</Link>

                  <Link
                    href={`/my-cvs/${cv.id}/edit`}
                    className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-800"
                  >{uiText(locale, "Editează")}</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-gray-700 p-8 text-center">
            <p className="text-gray-400">{uiText(locale, "Nu ai niciun CV salvat.")}</p>

            <Link
              href="/cv"
              className="mt-5 inline-block text-blue-400 hover:underline"
            >{uiText(locale, "Creează primul tău CV →")}</Link>
          </div>
        )}
      </div>
    </main>
  );
}
