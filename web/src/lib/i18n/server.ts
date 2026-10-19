import "server-only";
import { cookies } from "next/headers";
import type { UILocale } from "./dictionary";

export async function getServerLocale(): Promise<UILocale> {
  const store = await cookies();
  return store.get("cv_adapt_locale")?.value === "en" ? "en" : "ro";
}
