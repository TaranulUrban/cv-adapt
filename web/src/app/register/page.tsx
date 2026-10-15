
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Parolele nu coincid.");
      return;
    }

    if (password.length < 8) {
      setMessage("Parola trebuie să aibă minimum 8 caractere.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Cererea de înregistrare a fost procesată. Verifică emailul pentru confirmarea contului, dacă este necesară."
        );
      }
    } catch {
      setMessage("A apărut o eroare. Încearcă din nou.");
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
          Creează un cont
        </h1>

        <p className="mt-2 text-slate-600">
          Înregistrează-te pentru a începe crearea CV-ului.
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
              placeholder="nume@exemplu.ro"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-medium">
              Parolă
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
            <label htmlFor="confirmPassword" className="mb-2 block font-medium">
              Confirmă parola
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
            {loading ? "Se înregistrează..." : "Register"}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-5 text-sm text-slate-700">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Ai deja cont?{" "}
          <Link href="/login" className="font-semibold text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
