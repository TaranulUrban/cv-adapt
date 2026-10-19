
"use client";
import { useLocale } from "@/lib/i18n/client";
import { uiText } from "@/lib/i18n/dictionary";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeUserRole } from "./actions";

type Role = "admin" | "client" | "tester";

export default function RoleButton({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const locale = useLocale();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (currentRole === "admin") {
    return <span className="text-slate-400">—</span>;
  }

  const newRole = currentRole === "client" ? "tester" : "client";

  async function handleChange() {
    const confirmed = window.confirm(
      `${uiText(locale, "Sigur dorești să schimbi rolul în")} ${newRole}?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const result = await changeUserRole(userId, newRole);

      if (!result.success) {
        setError(result.error ?? uiText(locale, "A apărut o eroare."));
        return;
      }

      router.refresh();
    } catch {
      setError(uiText(locale, "Nu am putut schimba rolul."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleChange}
        disabled={loading}
        className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {loading ? uiText(locale, "Se salvează...") : `${uiText(locale, "Schimbă în")} ${newRole}`}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
