import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CVForm from "@/app/cv/cv-form";
import type { SavedCV } from "@/app/cv/save-cv";

export default async function EditCVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = await getServerLocale();
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: cv, error } = await supabase
    .from("cvs")
    .select(
      "id, title, personal_info, experiences, education, skills, languages, job_info"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(uiText(locale, "Nu am putut încărca CV-ul pentru editare."));
  }

  if (!cv) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
      <Link
        href={`/my-cvs/${id}`}
        className="text-sm text-[#d8432a] hover:underline"
      >{uiText(locale, "← Înapoi la CV")}</Link>

      <h1 className="mt-6 text-3xl font-bold">{uiText(locale, "Editează CV-ul")}</h1>

      <p className="mt-3 text-slate-500">{uiText(locale, "Modifică informațiile din CV-ul tău.")}</p>

      <CVForm initialData={cv as SavedCV} />
      </div>
    </main>
  );
}
