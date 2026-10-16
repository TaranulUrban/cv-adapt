
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function changeUserRole(
  userId: string,
  newRole: "client" | "tester"
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Nu ești autentificat." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { success: false, error: "Acces interzis." };
  }

  if (
    !userId ||
    !["client", "tester"].includes(newRole) ||
    userId === user.id
  ) {
    return { success: false, error: "Operațiune invalidă." };
  }

  const { error } = await supabase.rpc("change_user_role", {
    target_user_id: userId,
    new_role: newRole,
  });

    
    if (error) {
    console.error("Supabase change_user_role failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
    });

    return {
        success: false,
        error: "Nu am putut modifica rolul utilizatorului.",
    };
    }


  revalidatePath("/admin");

  return { success: true };
}
