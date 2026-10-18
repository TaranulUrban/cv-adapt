
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-2xl font-bold text-blue-700">
              CV Adapt
            </h1>
            <p className="mt-6 text-slate-600">
              Se încarcă Dashboard-ul...
            </p>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
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

  if (profileError || !profile) {
    throw new Error(
      "Nu am putut încărca profilul utilizatorului."
    );
  }

  const navigation = [
    {
      title: "Creează CV",
      description:
        "Completează datele personale, experiența, studiile și competențele pentru un CV nou.",
      href: "/cv",
      label: "Creează CV nou",
    },
    {
      title: "CV-urile mele",
      description:
        "Vizualizează și editează CV-urile originale salvate în contul tău.",
      href: "/my-cvs",
      label: "Vezi CV-urile",
    },
    {
      title: "CV-uri generate cu AI",
      description:
        "Consultă versiunile adaptate pentru joburi și verifică rezultatele înainte de utilizare.",
      href: "/generated-cvs",
      label: "Vezi CV-urile generate",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 py-6">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-blue-700"
          >
            CV Adapt
          </Link>

          <LogoutButton />
        </header>

        <section className="py-12">
          <h1 className="text-3xl font-bold">
            Bine ai venit în CV Adapt!
          </h1>

          <p className="mt-4 text-slate-600">
            Ești autentificat cu: {user.email}
          </p>

          <p className="mt-2 text-slate-600">
            Rolul tău:{" "}
            <span className="font-semibold">
              {profile.role}
            </span>
          </p>

          {profile.role === "admin" && (
            <Link
              href="/admin"
              className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
            >
              Deschide panoul de administrare →
            </Link>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {navigation.map((item) => (
              <section
                key={item.href}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold">
                  {item.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>

                <Link
                  href={item.href}
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {item.label}
                </Link>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="font-semibold text-blue-900">
              Cum funcționează CV Adapt?
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-900">
              Creezi un CV original, adaugi descrierea
              jobului dorit, apoi generezi o versiune
              adaptată. Verifici informațiile înainte
              să folosești rezultatul.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
