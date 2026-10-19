"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/client";

const translations = {
  ro: {
    title: "Autentificare",
    description: "Intră în contul tău pentru a continua.",
    password: "Parolă",
    submit: "Autentificare",
    loading: "Se autentifică...",
    noAccount: "Nu ai cont?",
    register: "Înregistrează-te",
    invalid: "Email sau parolă incorectă, ori cont neconfirmat.",
    error: "A apărut o eroare. Încearcă din nou.",
  },
  en: {
    title: "Log in",
    description: "Log in to your account to continue.",
    password: "Password",
    submit: "Log in",
    loading: "Logging in...",
    noAccount: "Don't have an account?",
    register: "Sign up",
    invalid: "Incorrect email or password, or an unconfirmed account.",
    error: "Something went wrong. Please try again.",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = translations[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<"invalid" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("invalid");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setMessage("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          CV Adapt
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          {t.title}
        </h1>

        <p className="mt-2 text-slate-600">
          {t.description}
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-medium">
              {t.password}
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? t.loading : t.submit}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-5 text-sm text-red-600">
            {t[message]}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          {t.noAccount}{" "}
          <Link href="/register" className="font-semibold text-blue-700">
            {t.register}
          </Link>
        </p>
      </div>
    </main>
  );
}