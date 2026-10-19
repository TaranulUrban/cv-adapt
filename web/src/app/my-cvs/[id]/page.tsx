import LocalizedText from "@/components/localized-text";
import { Suspense } from "react";
import CVDetailsContent from "./cv-details-content";

export default function CVDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
          <p><LocalizedText source="Se încarcă CV-ul..." /></p>
        </main>
      }
    >
      <CVDetailsContent params={params} />
    </Suspense>
  );
}
