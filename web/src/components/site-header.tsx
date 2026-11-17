"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LanguageSwitcher from "@/components/language-switcher";

type Locale = "ro" | "en";

export default function SiteHeader() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>("ro");
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLocale(document.cookie.match(/(?:^|; )cv_adapt_locale=(en|ro)/)?.[1] === "en" ? "en" : "ro");
    const supabase = createClient();
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.user));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSignedIn(Boolean(session));
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const en = locale === "en";
  const nav = signedIn
    ? [
        { href: "/dashboard", label: en ? "Dashboard" : "Panou principal" },
        { href: "/cv", label: en ? "Create CV" : "Creează CV" },
        { href: "/my-cvs", label: en ? "My CVs" : "CV-urile mele" },
        { href: "/generated-cvs", label: en ? "AI-generated CVs" : "CV-uri cu AI" },
      ]
    : [
        { href: "/#cum-functioneaza", label: en ? "How it works" : "Cum funcționează" },
        { href: "/#beneficii", label: en ? "Benefits" : "Beneficii" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 text-slate-900 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="CV Adapt — Home" className="flex shrink-0 items-center gap-2.5 text-xl font-black tracking-tight sm:text-2xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef5135] text-lg font-black text-white">cv</span>
          <span>adapt<span className="text-[#ef5135]">.</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={`rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-orange-50 hover:text-[#d8432a] ${pathname === item.href ? "text-[#e64c30]" : "text-slate-700"}`}>{item.label}</Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <LanguageSwitcher locale={locale} />
          {signedIn ? (
            <Link href="/dashboard" className="rounded-full bg-[#ef5135] px-5 py-3 text-sm font-bold text-white hover:bg-[#d8432a]">{en ? "My account" : "Contul meu"}</Link>
          ) : (
            <>
              <Link href="/login" className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold hover:bg-slate-200">{en ? "Log in" : "Autentifică-te"}</Link>
              <Link href="/register" className="rounded-full bg-[#ef5135] px-5 py-3 text-sm font-bold text-white hover:bg-[#d8432a]">{en ? "Create CV" : "Creează CV"}</Link>
            </>
          )}
        </div>
        <button type="button" className="rounded-lg border border-slate-200 p-2.5 lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen((open) => !open)}>
          <span className="block h-0.5 w-5 bg-slate-900" /><span className="mt-1 block h-0.5 w-5 bg-slate-900" /><span className="mt-1 block h-0.5 w-5 bg-slate-900" />
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Mobile navigation" className="border-t border-slate-100 bg-white px-4 pb-5 pt-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 font-semibold hover:bg-orange-50">{item.label}</Link>)}
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 sm:hidden"><LanguageSwitcher locale={locale} /><Link href={signedIn ? "/dashboard" : "/login"} className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold">{signedIn ? (en ? "My account" : "Contul meu") : (en ? "Log in" : "Autentifică-te")}</Link></div>
            {!signedIn && <Link href="/register" className="mt-2 rounded-full bg-[#ef5135] px-5 py-3 text-center font-bold text-white sm:hidden">{en ? "Create CV" : "Creează CV"}</Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
