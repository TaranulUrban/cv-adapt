"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/client";

const translations = {
  ro: {
    title: "Creează un cont",
    description: "Înregistrează-te pentru a începe crearea CV-ului.",
    password: "Parolă",
    confirmPassword: "Confirmă parola",
    submit: "Înregistrează-te",
    loading: "Se înregistrează...",
    haveAccount: "Ai deja cont?",
    login: "Autentificare",
    mismatch: "Parolele nu coincid.",
    tooShort: "Parola trebuie să aibă minimum 8 caractere.",
    success:
      "Cererea de înregistrare a fost procesată. Verifică emailul pentru confirmarea contului, dacă este necesară.",
    unexpected: "A apărut o eroare. Încearcă din nou.",
    registrationError: "Înregistrarea nu a putut fi finalizată.",
  },
  en: {
    title: "Create an account",
    description: "Sign up to start building your CV.",
    password: "Password",
    confirmPassword: "Confirm password",
    submit: "Sign up",
    loading: "Signing up...",
    haveAccount: "Already have an account?",
    login: "Log in",
    mismatch: "Passwords do not match.",
    tooShort: "Password must contain at least 8 characters.",
    success:
      "Your registration request has been processed. Check your email to confirm your account, if required.",
    unexpected: "Something went wrong. Please try again.",
    registrationError: "Registration could not be completed.",
  },
} as const;

type MessageKey =
  | "mismatch"
  | "tooShort"
  | "success"
  | "unexpected"
  | "registrationError";

export default function RegisterPage() {
  const locale = useLocale();
  const t = translations[locale];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<MessageKey | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("mismatch");
      return;
    }

    if (password.length < 8) {
      setMessage("tooShort");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      setMessage(error ? "registrationError" : "success");
    } catch {
      setMessage("unexpected");
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

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
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
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-medium"
            >
              {t.confirmPassword}
            </label>

            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          <p
            role="status"
            className={`mt-5 text-sm ${
              message === "success" ? "text-green-700" : "text-red-600"
            }`}
          >
            {t[message]}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          {t.haveAccount}{" "}
          <Link href="/login" className="font-semibold text-blue-700">
            {t.login}
          </Link>
        </p>
      </div>
    </main>
  );
}