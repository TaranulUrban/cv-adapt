import { Suspense } from "react";
import CVListContent from "./cv-list-content";

export default function MyCVsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
          <p>Se încarcă CV-urile tale...</p>
        </main>
      }
    >
      <CVListContent />
    </Suspense>
  );
}
