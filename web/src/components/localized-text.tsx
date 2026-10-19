"use client";
import { useLocale } from "@/lib/i18n/client";
import { uiText } from "@/lib/i18n/dictionary";
export default function LocalizedText({ source }: { source: string }) {
  const locale = useLocale();
  return <>{uiText(locale, source)}</>;
}
