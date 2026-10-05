// Browser transport only; the form component owns UI state and feedback.
export async function sendQuote(
  form: FormData,
  fetchRequest: typeof fetch = fetch,
) {
  const response = await fetchRequest("/api/quote", {
    method: "POST",
    body: form,
  });
  const payload = await response.json();
  if (!response.ok)
    throw new Error(payload.error || "The request could not be sent.");
}
