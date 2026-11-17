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
    <main className="min-h-screen bg-[#fffaf7] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="text-sm text-[#d8432a] hover:underline"
        >{uiText(locale, "← Înapoi la Dashboard")}</Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{uiText(locale, "CV-urile mele")}</h1>

            <p className="mt-3 text-slate-500">{uiText(locale, "Aici găsești CV-urile originale salvate în contul tău.")}</p>
          </div>

          <Link
            href="/cv"
            className="inline-block w-full rounded-lg bg-[#ef5135] px-5 py-3 text-center font-medium sm:w-auto text-white hover:bg-[#d8432a]"
          >{uiText(locale, "+ Creează CV nou")}</Link>
        </div>

        <Link
          href="/generated-cvs"
          className="mt-6 inline-block text-sm text-[#d8432a] hover:underline"
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
                className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
              >
                <h2 className="text-lg font-semibold">
                  {cv.title || uiText(locale, "CV fără titlu")}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
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

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/my-cvs/${cv.id}`}
                    className="rounded-lg bg-[#ef5135] px-4 py-3 text-center text-sm font-medium hover:bg-[#d8432a] text-white"
                  >{uiText(locale, "Vezi CV")}</Link>

                  <Link
                    href={`/my-cvs/${cv.id}/edit`}
                    className="rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-medium hover:bg-orange-50"
                  >{uiText(locale, "Editează")}</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center">
            <p className="text-slate-500">{uiText(locale, "Nu ai niciun CV salvat.")}</p>

            <Link
              href="/cv"
              className="mt-5 inline-block text-[#d8432a] hover:underline"
            >{uiText(locale, "Creează primul tău CV →")}</Link>
          </div>
        )}
      </div>
    </main>
  );
}
