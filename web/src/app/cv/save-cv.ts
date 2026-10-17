
import { createClient } from "@/lib/supabase/client";

export type CVData = {
  title: string;
  personal_info: Record<string, string>;
  experiences: Record<string, unknown>[];
  education: Record<string, unknown>[];
  skills: string[];
  languages: {
    id: number;
    name: string;
    level: string;
    }[];
  job_info: {
    jobUrl: string;
    jobDescription: string;
    cvLanguage: "ro" | "en";
  };
};

export type SavedCV = CVData & {
  id: string;
};

export async function saveCV(data: CVData) {
  const supabase = createClient();

  // Identify the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Trebuie să fii autentificat pentru a salva CV-ul.");
  }

  // Insert a CV belonging to this user
  const { data: savedCV, error } = await supabase
    .from("cvs")
    .insert({
      user_id: user.id,
      title: data.title,
      personal_info: data.personal_info,
      experiences: data.experiences,
      education: data.education,
      skills: data.skills,
      languages: data.languages,
      job_info: data.job_info,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Nu am putut salva CV-ul: ${error.message}`);
  }

  return savedCV.id;
}


export async function updateCV(
  cvId: string,
  data: CVData
) {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(
      "Trebuie să fii autentificat pentru a modifica CV-ul."
    );
  }

  const { data: updatedCV, error } = await supabase
    .from("cvs")
    .update({
      title: data.title,
      personal_info: data.personal_info,
      experiences: data.experiences,
      education: data.education,
      skills: data.skills,
      languages: data.languages,
      job_info: data.job_info,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cvId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(
      `Nu am putut actualiza CV-ul: ${error.message}`
    );
  }

  if (!updatedCV) {
    throw new Error(
      "CV-ul nu a fost găsit sau nu ai permisiunea să îl modifici."
    );
  }

  return updatedCV.id;
}

