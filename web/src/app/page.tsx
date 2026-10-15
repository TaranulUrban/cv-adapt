
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-bold tracking-tight text-blue-700">
          CV Adapt
        </div>

        <nav className="flex items-center gap-3">
          <Link href="/login" className="rounded-lg px-4 py-2 font-medium hover:bg-slate-200">
            Login
          </Link>
          <Link href="/register" className="rounded-lg bg-blue-700 px-5 py-2 font-medium text-white hover:bg-blue-800">
            Register
          </Link>
        </nav>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center">
        <span className="mb-6 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          CV-uri personalizate cu ajutorul AI
        </span>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          CV-ul tău, adaptat pentru jobul pe care îl dorești.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
          Completează experiența ta profesională, adaugă descrierea jobului
          și generează un CV relevant în română sau engleză.
          Fără experiență sau competențe inventate.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/register" className="rounded-xl bg-blue-700 px-8 py-4 font-semibold text-white hover:bg-blue-800">
            Creează CV-ul meu
          </Link>
          <a href="#cum-functioneaza" className="rounded-xl border border-slate-300 px-8 py-4 font-semibold hover:bg-white">
            Cum funcționează
          </a>
        </div>
      </section>

      <section id="cum-functioneaza" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">
          Cum funcționează?
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["01", "Creează CV-ul", "Introdu experiența, studiile și competențele tale."],
            ["02", "Adaugă jobul", "Introdu linkul LinkedIn sau descrierea postului."],
            ["03", "Generează și descarcă", "Verifică CV-ul adaptat și descarcă-l în format PDF."],
          ].map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-5 text-2xl font-bold text-blue-700">{number}</div>
              <h3 className="mb-3 text-xl font-semibold">{title}</h3>
              <p className="text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CV Adapt. Toate drepturile rezervate.
      </footer>
    </main>
  );
}
