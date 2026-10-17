
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
    throw new Error("Nu am putut încărca CV-ul pentru editare.");
  }

  if (!cv) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link
        href={`/my-cvs/${id}`}
        className="text-sm text-blue-400 hover:underline"
      >
        ← Înapoi la CV
      </Link>

      <h1 className="mt-6 text-3xl font-bold">
        Editează CV-ul
      </h1>

      <p className="mt-3 text-gray-400">
        Modifică informațiile din CV-ul tău.
      </p>

      <CVForm initialData={cv as SavedCV} />
    </main>
  );
}
