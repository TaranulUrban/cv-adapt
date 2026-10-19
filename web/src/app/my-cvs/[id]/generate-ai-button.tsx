
"use client";
import { useLocale } from "@/lib/i18n/client";
import { uiText } from "@/lib/i18n/dictionary";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GenerateAIButtonProps = {
  cvId: string;
};

type GenerationResponse = {
  success?: boolean;
  generatedCvId?: string;
  error?: string;
};

export default function GenerateAIButton({
  cvId,
}: GenerateAIButtonProps) {
  const locale = useLocale();

  const router = useRouter();

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGenerate() {
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvId }),
      });

      const result: GenerationResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          uiText(locale, result.error || "Nu am putut genera CV-ul.")
        );
      }

      if (!result.success || !result.generatedCvId) {
        throw new Error(
          uiText(locale, "Serverul nu a returnat identificatorul CV-ului generat.")
        );
      }

      router.push(`/generated-cvs/${result.generatedCvId}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : uiText(locale, "A apărut o eroare neașteptată.")
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating
          ? uiText(locale, "Se generează CV-ul...")
          : uiText(locale, "Generează CV cu AI")}
      </button>

      {isGenerating && (
        <p role="status" className="mt-3 text-sm text-gray-400">{uiText(locale, "GPT-5 mini adaptează CV-ul pentru jobul ales. Te rugăm să aștepți și să nu închizi pagina.")}</p>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-800 p-4 text-sm text-red-400"
        >
          {errorMessage}
        </p>
      )}

      <p className="mt-3 text-xs text-gray-400">{uiText(locale, "Maximum 5 generări pe zi, inclusiv încercările eșuate. Generarea poate consuma credit API.")}</p>
    </div>
  );
}
