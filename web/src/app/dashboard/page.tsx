
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-200 py-6">
          <h1 className="text-2xl font-bold text-blue-700">
            CV Adapt
          </h1>
          <LogoutButton />
        </header>

        <section className="py-16">
          <h2 className="text-3xl font-bold">
            Bine ai venit în CV Adapt!
          </h2>

          <p className="mt-4 text-slate-600">
            Ești autentificat cu: {user.email}
          </p>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">
              Creează primul tău CV
            </h3>
            <p className="mt-3 text-slate-600">
              În curând vei putea introduce experiența,
              studiile și competențele tale pentru a genera
              un CV adaptat jobului dorit.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
