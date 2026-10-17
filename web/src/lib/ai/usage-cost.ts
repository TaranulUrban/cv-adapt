export function calculateAIUsage(usage: {
  input_tokens: number;
  output_tokens: number;
  output_tokens_details?: {
    reasoning_tokens?: number;
  };
} | null | undefined) {
  if (!usage) {
    throw new Error("OpenAI nu a returnat informații despre consum.");
  }

  const inputTokens = usage.input_tokens;
  const outputTokens = usage.output_tokens;
  const reasoningTokens =
    usage.output_tokens_details?.reasoning_tokens ?? 0;

  // Tarife GPT-5 mini standard, USD per milion de tokenuri.
  // Verificăm tarifele înainte de lansarea în producție.
  const estimatedCostUsd =
    (inputTokens / 1_000_000) * 0.25 +
    (outputTokens / 1_000_000) * 2;

  return {
    inputTokens,
    outputTokens,
    reasoningTokens,
    estimatedCostUsd,
  };
}