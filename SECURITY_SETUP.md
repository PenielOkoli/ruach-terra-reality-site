# Secure owner portal setup

The owner portal uses a server-verified email and password. All changes to Google Sheets are sent by a protected Vercel Function; no password, spreadsheet URL, or Sheet secret is included in the browser code.

## 1. Generate credentials locally

Run this command locally from the project directory. It asks for the password without echoing it, then outputs the password salt and hash needed below. Use a unique password of at least 12 characters. This is a one-time setup command; do not commit its output.

```powershell
node scripts/generate-admin-password-hash.js
```

Generate two additional secrets:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Use one as `ADMIN_SESSION_SECRET` and the other as `SHEETS_SYNC_SECRET`.

## 2. Configure Vercel

In **Vercel → Project → Settings → Environment Variables**, add every item below for **Production** and **Preview**:

| Variable | Value |
| --- | --- |
| `ADMIN_OWNER_EMAIL` | The owner's email address, e.g. `owner@example.com` |
| `ADMIN_PASSWORD_SALT` | Value generated in step 1 |
| `ADMIN_PASSWORD_HASH` | Value generated in step 1 |
| `ADMIN_SESSION_SECRET` | First random secret from step 1 |
| `SHEETS_WEB_APP_URL` | Deployed Apps Script URL ending in `/exec` |
| `SHEETS_SYNC_SECRET` | Second random secret from step 1 |

Redeploy after saving environment variables. They only take effect in new deployments.

## 3. Configure Apps Script

Follow [google-apps-script/README.md](google-apps-script/README.md). Set the Apps Script property `SYNC_SECRET` to the same value as `SHEETS_SYNC_SECRET`, then deploy a new version.

## What this protects

- Sign-in is verified on Vercel; the email/password are never included in `app.js`.
- The browser receives an `HttpOnly`, `Secure`, `SameSite=Strict` session cookie, not a reusable password token.
- Only an authenticated owner can call `/api/admin/sync`.
- The Sheets URL and sync secret exist only in Vercel environment variables.
- The Apps Script receiver rejects requests without the correct secret and neutralizes spreadsheet formula injection in synced text.

## Current storage limitation

Inventory and sales are still stored in the signed-in browser's local storage. The secured server prevents unauthorized users from updating the central Google Sheet, but it does not make the portal a multi-device database. The next security/data-integrity upgrade should move inventory and sales to a database behind authenticated Vercel API routes.
