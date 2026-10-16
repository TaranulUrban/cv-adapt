
import CVForm from "./cv-form";

export default function CreateCVPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Creează CV-ul tău
      </h1>

      <p className="mt-3 text-gray-400">
        Completează informațiile tale profesionale pentru
        a crea un CV pe care îl vom putea adapta cu AI.
      </p>

      <CVForm />
    </main>
  );
}
