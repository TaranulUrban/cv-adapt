
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-200 py-6">
          <h1 className="text-2xl font-bold text-blue-700">
            CV Adapt — Admin
          </h1>

          <Link href="/dashboard" className="font-medium text-blue-700 hover:underline">
            Înapoi la Dashboard
          </Link>
        </header>

        <section className="py-12">
          <h2 className="text-3xl font-bold">
            Panou de administrare
          </h2>

          <p className="mt-3 text-slate-600">
            Bine ai venit! Ai acces la această pagină deoarece
            contul tău are rolul Admin.
          </p>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">
              Administrarea utilizatorilor
            </h3>

            <p className="mt-3 text-slate-600">
              În etapa următoare vom adăuga lista utilizatorilor
              și posibilitatea de a atribui rolurile Client și Tester.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
