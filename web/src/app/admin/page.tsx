import LocalizedText from "@/components/localized-text";
import { getServerLocale } from "@/lib/i18n/server";
import { uiText } from "@/lib/i18n/dictionary";

import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import RoleButton from "./role-button";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-2xl font-bold text-blue-700">
              CV Adapt — Admin
            </h1>
            <p className="mt-6 text-slate-600">
              <LocalizedText source="Se încarcă panoul de administrare..." />
            </p>
          </div>
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .order("created_at", { ascending: false });

  if (usersError) {
    throw new Error(uiText(locale, "Nu am putut încărca lista utilizatorilor."));
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-slate-200 py-6">
          <h1 className="text-2xl font-bold text-blue-700">
            CV Adapt — Admin
          </h1>

          <Link
            href="/dashboard"
            className="font-medium text-blue-700 hover:underline"
          >{uiText(locale, "Înapoi la Dashboard")}</Link>
        </header>

        <section className="py-12">
          <h2 className="text-3xl font-bold">{uiText(locale, "Panou de administrare")}</h2>

          <p className="mt-3 text-slate-600">{uiText(locale, "Bine ai venit! Ai acces la această pagină deoarece contul tău are rolul Admin.")}</p>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">{uiText(locale, "Administrarea utilizatorilor")}</h3>

            <p className="mt-3 text-slate-600">
              {uiText(locale, "Utilizatori înregistrați:")} {users?.length ?? 0}
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-3">{uiText(locale, "ID utilizator")}</th>
                    <th className="px-3 py-3">{uiText(locale, "Rol")}</th>
                    <th className="px-3 py-3">{uiText(locale, "Data creării")}</th>
                    <th className="px-3 py-3">{uiText(locale, "Acțiuni")}</th>
                  </tr>
                </thead>

                <tbody>
                  {users?.map((userProfile) => (
                    <tr
                      key={userProfile.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-3 py-3 font-mono text-xs">
                        {userProfile.id.slice(0, 8)}...
                      </td>

                      <td className="px-3 py-3 font-medium">
                        {userProfile.role}
                      </td>

                      <td className="px-3 py-3">
                        {new Date(
                          userProfile.created_at
                        ).toLocaleDateString(locale === "en" ? "en-GB" : "ro-RO")}
                      </td>

                      <td className="px-3 py-3">
                        <RoleButton
                          userId={userProfile.id}
                          currentRole={userProfile.role}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
