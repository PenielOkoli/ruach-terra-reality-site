# Website enquiry delivery

All project-enquiry emails are addressed to **info@ruachdredging.com**. The recipient cannot be changed by form input. Careers links also open an email to that address; they do not submit a server form.

## SMTP setup

In Vercel's server environment settings, enter the values supplied by the existing mailbox provider:

- `SMTP_HOST`: the provider's outgoing SMTP hostname.
- `SMTP_PORT`: `465` for implicit TLS or `587` for mandatory STARTTLS.
- `SMTP_USER`: the provider's authenticated username (often the full email address).
- `SMTP_PASSWORD`: its SMTP/app password, stored only in server environment variables.
- `SMTP_FROM`: a provider-approved sender on `ruachdredging.com`; defaults to `info@ruachdredging.com`.
- `QUOTE_DELIVERY_MODE=smtp` (default).

Do not put credentials in chat, source control or `NEXT_PUBLIC_` variables. Verify provider-specific sending permissions and domain SPF/DKIM/DMARC. Both supported ports require encryption and certificate validation; insecure port 25 is not supported. Restart/redeploy after setting the variables.

The visitor's optional email becomes Reply-To, not From. Uploaded files remain in memory and are never saved to public storage. Messages are plain text. SMTP success means the relay accepted the recipient; it is not proof of inbox delivery. There are no automatic retries after ambiguous failures.

## Validation and delivery failures

Name, phone, site location, project type and consent are required. Uploads are limited to 4 MB (PDF, DOC, DOCX, PNG or JPEG) with extension, MIME and basic signature checks. These checks are not malware scanning. Read timeout is 10 seconds and the total multipart request limit is 4.1 MB.

Missing/invalid configuration returns 503, rejected/failed SMTP delivery returns 502, invalid input returns 400, excessive body size returns 413, and throttled submissions return 429 with Retry-After. The form retains entered values on failure and offers the company email, call and WhatsApp links. It never shows fake success.

The in-process rate limiter is only a backstop. Configure distributed WAF limits at the hosting provider before relying on this endpoint under public traffic. Requests are not logged with enquiry content or credentials.

## Optional existing webhook

Set `QUOTE_DELIVERY_MODE=webhook` only if maintaining an existing approved receiver, then configure `QUOTE_WEBHOOK_URL` (HTTPS) and `QUOTE_WEBHOOK_SECRET`. The multipart payload contains JSON `payload` with type `ruach_quote_request`, version `1`, recipient `info@ruachdredging.com`, validated data, units, attachment metadata and optional `attachment` bytes. The receiver must enforce the company recipient and return 2xx only after accepting/persisting the request. Setting the recipient field cannot reconfigure a third-party workflow automatically; check that workflow before deployment. A failed receiver returns 502 or 504; no simultaneous SMTP copy is sent.

## Required launch check

Send one approved test enquiry after deployment and confirm receipt at the mailbox, its Reply-To and attachment. Local automated tests mock SMTP and do not send email. Review spam placement, provider quotas and attachment scanning. A deployment without valid credentials intentionally leaves direct email/phone available but cannot deliver online forms.
