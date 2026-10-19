"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/client";

export default function LogoutButton() {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const t = {
    ro: {
      logout: "Deconectare",
      loading: "Se deconectează...",
      error: "Nu am putut închide sesiunea. Încearcă din nou.",
    },
    en: {
      logout: "Log out",
      loading: "Logging out...",
      error: "Could not sign you out. Please try again.",
    },
  }[locale];

  async function handleLogout() {
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        alert(t.error);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      alert(t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100 disabled:opacity-50"
    >
      {loading ? t.loading : t.logout}
    </button>
  );
}