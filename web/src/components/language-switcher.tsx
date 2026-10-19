"use client";

type Locale = "ro" | "en";

export default function LanguageSwitcher({
  locale,
}: {
  locale: Locale;
}) {
  function selectLanguage(nextLocale: Locale) {
    if (nextLocale === locale) return;

    // eslint-disable-next-line react-hooks/immutability
    document.cookie =
      `cv_adapt_locale=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;

    window.location.reload();
  }

  return (
    <div
      className="flex items-center rounded-lg border border-slate-200 bg-white p-1"
      role="group"
      aria-label="Interface language"
    >
      {(["ro", "en"] as const).map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => selectLanguage(language)}
          aria-pressed={locale === language}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
            locale === language
              ? "bg-blue-700 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {language.toUpperCase()}
        </button>
      ))}
    </div>
  );
}