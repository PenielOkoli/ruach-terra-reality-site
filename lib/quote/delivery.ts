import type { QuoteSubmission } from "./validation";

// Server integration only. Credentials are read at the route boundary, not in UI.
export interface QuoteDeliveryConfig {
  url?: string;
  secret?: string;
}

export async function deliverQuote(
  submission: QuoteSubmission,
  config: QuoteDeliveryConfig,
  fetchRequest: typeof fetch = fetch,
) {
  // Preserve preview mode when no HTTPS webhook is configured.
  if (!config.url?.startsWith("https://")) return;
  await fetchRequest(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.secret ? { Authorization: `Bearer ${config.secret}` } : {}),
    },
    // Existing integration sends metadata, not uploaded file bytes.
    body: JSON.stringify({ type: "ruach_quote_request", ...submission }),
  });
}
