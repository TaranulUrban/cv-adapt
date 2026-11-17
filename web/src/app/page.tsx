import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";

// Public logo assets are displayed for illustration only, not as endorsements.
const employerLogos = [
  { name: "Amazon", src: "https://a.storyblok.com/f/203421/66x20/01cbdf1516/amazon.svg/m/132x40", width: 66 },
  { name: "Microsoft", src: "https://a.storyblok.com/f/203421/95x20/0f4a3826d0/microsoft.svg/m/190x40", width: 95 },
  { name: "Unilever", src: "https://a.storyblok.com/f/203421/97x20/6abc372ce7/unilever.svg/m/194x40", width: 97 },
  { name: "ASOS", src: "https://a.storyblok.com/f/203421/70x20/eb611d3aeb/asos.svg/m/140x40", width: 70 },
  { name: "Nike", src: "https://a.storyblok.com/f/203421/57x20/1d05ff7133/nike.svg/m/114x40", width: 57 },
  { name: "Poșta Română", src: "https://a.storyblok.com/f/203421/36x20/f2b6f09eb4/posta-romana.svg/m/72x40", width: 36 },
  { name: "Banca Transilvania", src: "https://a.storyblok.com/f/203421/111x20/7c3849a499/banca-transilvania.svg/m/222x40", width: 111 },
  { name: "UiPath", src: "https://a.storyblok.com/f/203421/59x20/dab528739e/uipath.svg/m/118x40", width: 59 },
  { name: "Carrefour", src: "https://a.storyblok.com/f/203421/120x20/e51ab082c6/carrefour.svg/m/240x40", width: 120 },
  { name: "Hidroelectrica", src: "https://a.storyblok.com/f/203421/22x20/f6d3cfb29c/hidroelectrica.svg/m/44x40", width: 22 },
  { name: "Dacia", src: "https://a.storyblok.com/f/203421/180x20/043094b0d5/dacia.svg/m/360x40", width: 180 },
] as const;

const copy = {
  ro: {
    badge: "CV-uri adaptate inteligent pentru fiecare oportunitate",
    lead: "Următorul tău job începe cu",
    emphasis: "un CV care te reprezintă.",
    description: "Creează-ți profilul profesional, adaugă jobul care te interesează și lasă AI-ul să adapteze CV-ul la cerințele rolului — fără experiențe sau competențe inventate.",
    create: "Creează CV-ul meu", explore: "Cum funcționează", note: "Simplu de folosit · Română și engleză · Export PDF",
    ready: "Pregătit pentru aplicare", relevant: "Adaptat pentru rol", skills: "Competențe relevante",
    howTitle: "Un CV mai relevant în 3 pași", howDesc: "Tu vii cu experiența. CV Adapt te ajută să o prezinți clar pentru fiecare oportunitate.",
    steps: [["01", "Creează-ți profilul", "Adaugă experiența profesională, studiile, competențele și limbile cunoscute."], ["02", "Alege jobul", "Introdu descrierea postului pentru care vrei să aplici."], ["03", "Adaptează cu AI", "Verifică CV-ul personalizat și descarcă-l în format PDF."]],
    why: "Pune în valoare ceea ce contează", whyDesc: "Experiența ta merită să fie prezentată în cel mai bun mod pentru fiecare rol.",
    perks: [["✦", "AI adaptat jobului", "CV-ul este ajustat în funcție de cerințele postului."], ["✓", "Fără informații inventate", "Revizuiești conținutul generat înainte de folosire."], ["↗", "Totul într-un singur loc", "Păstrezi CV-urile originale și cele adaptate în contul tău."], ["↓", "PDF gata de trimis", "Descarci rapid CV-ul pentru următoarea candidatură."]],
    employersTitle: "Pregătește-te pentru oportunități la companii de top",
    employersNote: "Exemple de potențiali angajatori. CV Adapt nu este afiliat cu aceste companii.",
    faqTitle: "Întrebări? Avem răspunsuri!",
    faq: [
      ["Ce este CV Adapt și prin ce se diferențiază?", "CV Adapt este o aplicație în care îți salvezi experiența profesională și creezi versiuni de CV adaptate cu AI pentru anumite joburi. Spre deosebire de un șablon static, aplicația ține cont de descrierea rolului și îți permite să revizuiești rezultatul."],
      ["Cum funcționează adaptarea CV-ului cu AI?", "Introduci experiența și competențele reale, apoi adaugi descrierea jobului. AI-ul propune o prezentare relevantă pentru acel rol. Este important să verifici fiecare afirmație înainte să folosești CV-ul."],
      ["Pot folosi CV Adapt pe telefon?", "Da. Interfața este adaptată pentru ecrane mobile. Poți naviga, completa date, consulta CV-urile salvate și accesa descărcarea PDF de pe telefon."],
      ["Pot reveni mai târziu să îmi editez CV-ul?", "Da. După autentificare, CV-urile originale sunt salvate în contul tău și pot fi editate. Versiunile generate cu AI pot fi consultate separat."],
      ["Pot descărca CV-ul ca PDF?", "Da. După generare și verificare, poți descărca CV-ul adaptat în format PDF."],
      ["Pot crea și scrisori de intenție sau încărca o fotografie?", "Aceste funcționalități nu sunt disponibile în versiunea actuală. Momentan, CV Adapt se concentrează pe crearea și adaptarea CV-urilor."],
    ],
    final: "Ești gata pentru următoarea oportunitate?", finalDesc: "Construiește un CV care arată ce poți oferi.", footer: "Creat pentru candidaturi mai relevante.",
  },
  en: {
    badge: "Smarter CV tailoring for every opportunity",
    lead: "Your next opportunity starts with",
    emphasis: "a CV that reflects you.",
    description: "Build your professional profile, add the role you want and let AI tailor your CV to the job requirements — without inventing experience or skills.",
    create: "Create my CV", explore: "How it works", note: "Easy to use · Romanian and English · PDF export",
    ready: "Ready to apply", relevant: "Tailored to the role", skills: "Relevant skills",
    howTitle: "A more relevant CV in 3 steps", howDesc: "You bring the experience. CV Adapt helps present it clearly for each opportunity.",
    steps: [["01", "Build your profile", "Add your professional experience, education, skills and languages."], ["02", "Choose a role", "Paste the description for the position you want."], ["03", "Tailor with AI", "Review your tailored CV and download it as a PDF."]],
    why: "Showcase what matters most", whyDesc: "Your experience deserves to be presented in the best way for each role.",
    perks: [["✦", "Job-aware AI", "CV content is tailored to specific job requirements."], ["✓", "No invented information", "Review AI-generated content before using it."], ["↗", "Everything in one place", "Keep original and tailored CVs in your account."], ["↓", "Ready-to-send PDF", "Quickly download your CV for your next application."]],
    employersTitle: "Get ready for opportunities at leading companies",
    employersNote: "Examples of potential employers. CV Adapt is not affiliated with these companies.",
    faqTitle: "Questions? We have answers!",
    faq: [
      ["What is CV Adapt and what makes it different?", "CV Adapt lets you save your professional experience and use AI to create CV versions tailored to individual jobs. Unlike a static template, it considers the role description and lets you review the result."],
      ["How does AI CV tailoring work?", "Enter your real experience and skills, then add the job description. AI suggests a relevant presentation for that role. Always check every statement before using your CV."],
      ["Can I use CV Adapt on my phone?", "Yes. The interface adapts to mobile screens. You can navigate, enter information, view saved CVs and access PDF downloads from your phone."],
      ["Can I come back and edit my CV later?", "Yes. After signing in, your original CVs are stored in your account and can be edited. AI-generated versions are available separately."],
      ["Can I download my CV as a PDF?", "Yes. After generating and reviewing your tailored CV, you can download it as a PDF."],
      ["Can I create cover letters or upload a photo?", "Those features are not available in the current version. CV Adapt currently focuses on creating and tailoring CVs."],
    ],
    final: "Ready for your next opportunity?", finalDesc: "Build a CV that showcases your experience.", footer: "Built for more relevant applications.",
  },
} as const;

export default function Home() {
  return <Suspense fallback={<main className="min-h-screen bg-white p-6">CV Adapt</main>}><HomeContent /></Suspense>;
}

async function HomeContent() {
  await connection();
  const locale = (await cookies()).get("cv_adapt_locale")?.value === "en" ? "en" : "ro";
  const t = copy[locale];
  return (
    <main className="overflow-x-hidden bg-white text-[#212329]">
      <section className="relative overflow-hidden bg-[#fffaf7]">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#ffded3] opacity-70 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#d9432a] sm:text-sm">✦ {t.badge}</span>
            <h1 className="mt-8 text-4xl font-black leading-[1.12] tracking-[-0.04em] sm:text-5xl lg:text-6xl">{t.lead} <span className="text-[#e94e32]">{t.emphasis}</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">{t.description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="rounded-full bg-[#ed5135] px-8 py-4 text-center font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-[#d8432a]">{t.create} →</Link>
              <a href="#cum-functioneaza" className="rounded-full border border-slate-300 bg-white px-8 py-4 text-center font-bold transition hover:border-[#ed5135]">{t.explore}</a>
            </div>
            <p className="mt-6 text-sm font-medium text-slate-500">✓ {t.note}</p>
          </div>
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -left-4 top-7 h-full w-full -rotate-3 rounded-[2rem] bg-[#f7d6ca]" />
            <div className="relative rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_25px_80px_rgba(74,45,36,.15)] sm:p-9">
              <div className="mb-8 flex items-center justify-between gap-3"><span className="text-lg font-black text-[#e94e32]">cv adapt.</span><span className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700">✓ {t.ready}</span></div>
              <div className="border-b border-slate-100 pb-6"><div className="mb-3 h-3 w-24 rounded-full bg-orange-100" /><h2 className="text-3xl font-black tracking-tight">Alex Morgan</h2><p className="mt-2 font-semibold text-slate-500">Project Manager</p></div>
              <div className="space-y-7 py-8">{[0, 1].map((item) => <div key={item}><div className="mb-4 h-3 w-32 rounded-full bg-[#ed5135]" /><div className="h-2 w-full rounded-full bg-slate-100" /><div className="mt-3 h-2 w-11/12 rounded-full bg-slate-100" /><div className="mt-3 h-2 w-3/4 rounded-full bg-slate-100" /></div>)}</div>
              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-5"><span className="rounded-full bg-orange-50 px-3 py-2 text-xs font-bold text-[#c64a32]">✦ {t.relevant}</span><span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">✓ {t.skills}</span></div>
            </div>
            <div className="absolute -bottom-5 -left-2 rounded-2xl bg-[#253847] px-6 py-4 text-sm font-bold text-white shadow-xl sm:-left-8">✦ AI-powered CV</div>
          </div>
        </div>
      </section>
      <section id="cum-functioneaza" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl"><div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#e94e32]">CV Adapt</p><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{t.howTitle}</h2><p className="mt-5 text-lg leading-8 text-slate-600">{t.howDesc}</p></div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">{t.steps.map(([number, title, body]) => <article key={number} className="rounded-[1.7rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-xl font-black text-[#e94e32]">{number}</span><h3 className="mt-7 text-xl font-extrabold">{title}</h3><p className="mt-4 leading-7 text-slate-600">{body}</p></article>)}</div>
        </div>
      </section>
      <section id="beneficii" className="scroll-mt-24 bg-[#f8f9fb] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t.why}</h2><p className="mt-5 text-lg leading-8 text-slate-600">{t.whyDesc}</p></div><div className="mt-12 grid gap-5 sm:grid-cols-2">{t.perks.map(([icon, title, detail]) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-8"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl font-bold text-[#e94e32]">{icon}</span><h3 className="mt-5 text-xl font-extrabold">{title}</h3><p className="mt-3 leading-7 text-slate-600">{detail}</p></article>)}</div></div></section>
      <section aria-labelledby="employers-title" className="overflow-hidden bg-white px-4 py-16 sm:py-20">
        <h2 id="employers-title" className="mx-auto max-w-3xl text-center text-2xl font-extrabold tracking-tight sm:text-3xl">{t.employersTitle}</h2>
        <div className="employers-marquee mx-auto mt-12 max-w-7xl overflow-hidden" aria-label="Examples of employers">
          <div className="employers-marquee-track flex w-max items-center gap-14 sm:gap-20">
            {[0, 1].map((copyIndex) => <div key={copyIndex} aria-hidden={copyIndex === 1} className="flex shrink-0 items-center gap-14 sm:gap-20">
              {employerLogos.map((logo) => <span key={logo.name} className="flex h-10 shrink-0 items-center justify-center grayscale opacity-65 transition hover:grayscale-0 hover:opacity-100" style={{ width: logo.width * 1.35 }}><img src={logo.src} alt={copyIndex === 0 ? logo.name : ""} width={logo.width * 2} height={40} loading="lazy" className="max-h-8 w-auto max-w-full object-contain" /></span>)}
            </div>)}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-slate-500">{t.employersNote}</p>
      </section>
      <section id="intrebari" aria-labelledby="faq-title" className="scroll-mt-24 bg-[#f8f9fb] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 id="faq-title" className="mb-10 text-center text-3xl font-black tracking-tight sm:mb-14 sm:text-5xl">{t.faqTitle}</h2>
          <div className="divide-y divide-slate-300 border-t border-b border-slate-300">
            {t.faq.map(([question, answer]) => <details key={question} className="group py-6 sm:py-8">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-lg font-extrabold marker:hidden sm:text-2xl [&::-webkit-details-marker]:hidden">
                <span>{question}</span><span aria-hidden="true" className="shrink-0 text-2xl font-normal leading-none text-[#e94e32] group-open:rotate-45">+</span>
              </summary>
              <p className="mt-5 max-w-4xl pr-9 text-base leading-8 text-slate-600 sm:text-lg">{answer}</p>
            </details>)}
          </div>
        </div>
      </section>
      <section className="bg-[#253847] px-4 py-20 text-center text-white sm:px-6"><h2 className="text-3xl font-black sm:text-4xl">{t.final}</h2><p className="mt-5 text-lg text-slate-200">{t.finalDesc}</p><Link href="/register" className="mt-8 inline-block rounded-full bg-[#ed5135] px-9 py-4 font-bold text-white hover:bg-[#d8432a]">{t.create} →</Link></section>
      <footer className="bg-[#1d2b38] px-4 py-8 text-center text-sm text-slate-300">© 2026 CV Adapt · {t.footer}</footer>
    </main>
  );
}
