"use client";

import { useSyncExternalStore } from "react";

export type Locale = "ro" | "en";

function getLocale(): Locale {
  const savedLocale = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("cv_adapt_locale="))
    ?.split("=")[1];

  return savedLocale === "en" ? "en" : "ro";
}

function subscribe() {
  // Limba este actualizată prin reîncărcarea paginii.
  return () => {};
}

export function useLocale(): Locale {
  return useSyncExternalStore(
    subscribe,
    getLocale,
    () => "ro"
  );
}