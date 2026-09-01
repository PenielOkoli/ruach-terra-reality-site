# Google Sheets connection

1. Create the Google Sheet you want to use for inventory and sales.
2. In that Sheet, choose **Extensions → Apps Script**.
3. Replace the generated `Code.gs` file with the supplied `Code.gs` in this folder and save.
4. Choose **Deploy → New deployment → Web app**. Run as yourself and grant access to the people who will use the owner portal.
5. Copy the deployed URL ending in `/exec`.
6. In the website, open **Owner portal → Sheet connection**, paste that URL and save. This creates and populates the `Inventory` and `Sales` tabs. Future inventory and sales saves update the workbook automatically; **Sync sheet** remains available as an optional manual refresh.

The receiver replaces the `Inventory` and `Sales` tabs on each sync, making the Sheet a current operational copy. Keep access limited to the owner/account that should handle business records.
