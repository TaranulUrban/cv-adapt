"use client";
import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/client";
export default function DocumentLocale() {
  const locale = useLocale();
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return null;
}
