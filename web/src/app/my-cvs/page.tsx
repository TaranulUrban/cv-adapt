
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function MyCVsPage() {
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
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">CV-urile mele</h1>

      <p className="mt-3 text-gray-400">
        Aici găsești CV-urile salvate în contul tău.
      </p>

      <Link
        href="/cv"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        + Creează CV nou
      </Link>

      {error ? (
        <p role="alert" className="mt-8 text-red-400">
          Nu am putut încărca CV-urile. Încearcă din nou.
        </p>
      ) : cvs && cvs.length > 0 ? (
        
        
<div className="mt-8 space-y-4">
  {cvs.map((cv) => (
    <div
      key={cv.id}
      className="rounded-xl border border-gray-700 p-5"
    >
      <h2 className="text-lg font-semibold">
        {cv.title}
      </h2>

      <p className="mt-1 text-sm text-gray-400">
        Creat la:{" "}
        {new Date(cv.created_at).toLocaleDateString("ro-RO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Europe/Bucharest",
        })}
      </p>

      <Link
        href={`/my-cvs/${cv.id}`}
        className="mt-4 inline-block rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium hover:bg-gray-800"
      >
        Vezi CV
      </Link>
    </div>
  ))}
</div>

      ) : (
        <p className="mt-8 text-gray-400">
          Nu ai niciun CV salvat. Creează primul tău CV!
        </p>
      )}
    </main>
  );
}
