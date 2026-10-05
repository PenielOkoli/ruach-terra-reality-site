// Browser transport only; the form component owns UI state and feedback.
export async function sendQuote(
  form: FormData,
  fetchRequest: typeof fetch = fetch,
) {
  const response = await fetchRequest("/api/quote", {
    method: "POST",
    body: form,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(payload?.error || "The request could not be sent. Please call or WhatsApp Ruach.");
  if (payload?.ok !== true) throw new Error('Delivery could not be confirmed. Please contact Ruach before retrying.');
}
