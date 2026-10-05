# PR merge resolution

Merged main at `1fcf30d` into `codex/launch-refinements`. The original development working tree was not reset, staged or rewritten.

## Both branches retained

- `app.js` remains the four-line ES-module entry point. Main's new behaviour is implemented in the existing admin modules, rather than restoring the monolithic script.
- `admin.html` keeps the formatted markup, external admin CSS, static stocked-date field, correct inventory headers, module script tag and `closeOwnerGate` ID required by the controller. Main's Refresh from Google Sheets button is included using the existing CSS class instead of inline styling.
- Discounts use `saleLineAmounts` in the domain layer, both in preview and saved sales. Line records retain `discountPercent` and `discountAmount`; sales retain `subtotal`, `discountTotal` and net `total`. Invoices show a discount column and totals; CSV exports include discounts. Old records without discount fields remain usable. Draft discount values survive view rerenders.
- GET spreadsheet refresh lives in the API adapter and is called on owner entry and by the Settings button. Empty shared sheets preserve/bootstrap existing local records, matching main. Failed/malformed pulls retain the saved local copy. A snapshot guard prevents a delayed refresh from erasing records saved during the request.
- `api/admin/sync.js` and `google-apps-script/Code.gs` retain main's changes unchanged, including GET loading and discount/raw-record fields.
- Quote-delivery safeguards, responsive images, metadata and project evidence remain unchanged from the launch-refinement commit.

## Validation

37 unit tests and the isolated admin browser workflow pass. Browser coverage includes discounted totals, invoice columns, CSV, shared refresh, failed refresh, delayed-refresh data preservation and 360/768/1280px admin layouts. All HTTP requests in the admin check are intercepted: no real account, inventory, sale or spreadsheet is changed. Server handler and Apps Script syntax checks pass.

The production build is verified with dependencies installed directly in the worktree. Turbopack rejected the temporary shared dependency junction, so that link was removed without touching the original dependency directory and replaced by a clean lockfile installation.

This resolves the PR branch only. It does not merge the PR into main or deploy/reconfigure Google Apps Script.
