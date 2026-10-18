import { Suspense } from "react";
import CVEditContent from "./cv-edit-content";

export default function EditCVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-6 py-12">
          <p>Se încarcă formularul de editare...</p>
        </main>
      }
    >
      <CVEditContent params={params} />
    </Suspense>
  );
}
