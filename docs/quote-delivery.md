# Quote delivery setup

The form is fail-closed. It reports acceptance only after a configured HTTPS service returns 2xx. This acknowledges service acceptance, not inbox delivery. No service has been provisioned or externally tested in this pass.

## Configure

Set `QUOTE_WEBHOOK_URL` and, where the receiver requires authentication, `QUOTE_WEBHOOK_SECRET` in server-only environment variables. Never prefix them with `NEXT_PUBLIC_`. Restart the app after local configuration. The receiver must support this contract, not the old JSON-only request:

- HTTP POST, `multipart/form-data` with automatically generated boundary.
- `payload`: JSON string containing `type: ruach_quote_request`, `version: 1`, `data` (validated enquiry fields), `units` (`volume: m³`, `pipelineDistance: m`), and attachment metadata or null.
- `attachment`: optional file part containing the actual bytes. At most 5,000,000 bytes; PDF, DOC, DOCX, PNG or JPEG. Filenames are normalized for delivery.
- `Authorization: Bearer …` only when a secret is configured.
- Return 2xx only after durably accepting the enquiry and uploaded file. Non-2xx, redirect or network failure becomes 502; a 15-second timeout becomes 504; missing/invalid configuration becomes 503. No automatic retry, because ambiguous delivery could cause duplicate enquiries.

Name, phone/WhatsApp, location and project type are required, plus contact consent. Email is optional. Blank engineering fields mean unknown; explicit `Not sure yet` is also supported. Numeric engineering inputs must be positive and finite. Unexpected fields are discarded. The browser retains form values on failure and offers direct phone/WhatsApp links.

## Before public launch

1. Choose/provision the recipient service, mailbox/CRM and retention policy. Confirm its multipart contract or implement a provider adapter in `lib/quote/delivery.ts`.
2. Add provider/edge-level rate limiting and bot protection. The included honeypot and same-origin browser check are basic safeguards, not distributed anti-abuse protection. Configure hosting request/time limits in addition to the application's bounded 5.1 MB body reader.
3. Treat all attachments as untrusted. MIME/extension checks are not malware scanning or proof of file content. Scan/quarantine at the receiver, restrict access, and never execute/render uploaded files in a privileged context.
4. Verify a real submission reaches the agreed destination, including byte-identical attachments. Verify failures/timeouts do not show success. Configure monitoring without logging enquiry data or secrets.
5. Obtain legal review of the existing Privacy/Terms placeholders and publish approved retention/contact information.

The app intentionally does not store enquiries locally. If stronger delivery guarantees are needed, use a durable queue and idempotent recipient before displaying acceptance.
