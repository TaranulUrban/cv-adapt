import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServerLocale } from "@/lib/i18n/server";
import GenerateCVForm from "./generate-cv-form";

export default function NewGeneratedCVPage({ searchParams }: { searchParams: Promise<{ cvId?: string }> }) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#fffaf7] p-8">CV Adapt</main>}>
      <NewGeneratedCVContent searchParams={searchParams} />
    </Suspense>
  );
}

async function NewGeneratedCVContent({ searchParams }: { searchParams: Promise<{ cvId?: string }> }) {
  await connection();
  const locale = await getServerLocale();
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const { data: cvs, error } = await supabase
    .from("cvs")
    .select("id, title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const requested = (await searchParams).cvId;
  const initialCvId = cvs?.some((cv) => cv.id === requested) ? requested : (cvs?.[0]?.id ?? "");
  const en = locale === "en";

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/generated-cvs" className="text-sm text-[#d8432a] hover:underline">
          {en ? "← AI-generated CVs" : "← CV-uri generate cu AI"}
        </Link>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
          {en ? "Generate a CV with AI" : "Generează un CV cu AI"}
        </h1>
        <p className="mt-3 text-slate-600">
          {en
            ? "Choose your original CV, enter a job title and paste the job description. Your original CV will not be changed."
            : "Alege CV-ul original, introdu titlul postului și descrierea jobului. CV-ul original nu va fi modificat."}
        </p>
        {error ? (
          <p role="alert" className="mt-6 text-red-700">{en ? "Could not load your CVs." : "Nu am putut încărca CV-urile."}</p>
        ) : cvs?.length ? (
          <GenerateCVForm cvs={cvs} initialCvId={initialCvId} locale={locale} />
        ) : (
          <div className="mt-8 rounded-xl border border-orange-200 bg-white p-6">
            <p>{en ? "First create an original CV." : "Mai întâi trebuie să creezi un CV original."}</p>
            <Link href="/cv" className="mt-4 inline-block font-semibold text-[#d8432a] hover:underline">
              {en ? "Create original CV →" : "Creează CV original →"}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
