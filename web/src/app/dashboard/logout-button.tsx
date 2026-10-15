
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setLoading(false);
      alert("Nu am putut închide sesiunea. Încearcă din nou.");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100 disabled:opacity-50"
    >
      {loading ? "Se deconectează..." : "Logout"}
    </button>
  );
}
