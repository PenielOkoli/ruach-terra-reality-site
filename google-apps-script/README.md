# Protected Google Sheets sync

The website no longer exposes this web-app URL or its secret in the browser. Vercel sends the sync request only after the owner has signed in.

1. In the chosen Google Sheet, select **Extensions → Apps Script** and replace the generated `Code.gs` with this folder's `Code.gs`.
2. In Apps Script, open **Project Settings** (the gear icon) → **Script properties** and add `SYNC_SECRET`. Its value must exactly match the `SHEETS_SYNC_SECRET` environment variable set in Vercel.
3. Use **Deploy → New deployment → Web app**. Set **Execute as** to yourself and **Who has access** to **Anyone**. The script's secret, rather than public access settings, is what authorizes write requests.
4. Copy the deployed URL ending in `/exec` and set it as Vercel's `SHEETS_WEB_APP_URL` environment variable. Do not put it in the website or browser settings.
5. Each inventory update or sale now uses the secure Vercel endpoint and updates the `Inventory` and `Sales` tabs automatically.

After updating `Code.gs`, use **Deploy → Manage deployments → Edit → New version → Deploy**. Keep the existing `/exec` URL.

Never share `SYNC_SECRET`, `SHEETS_SYNC_SECRET`, or any Vercel environment variable.
