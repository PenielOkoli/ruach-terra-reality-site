/**
 * Ruach & Terra business desk -> Google Sheets receiver.
 *
 * Create a Google Sheet, then open Extensions > Apps Script and replace its
 * Code.gs contents with this file. Deploy it as a Web app with access set to
 * your Google account, copy the /exec URL and paste it in Owner portal >
 * Sheet connection.
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var expectedSecret = PropertiesService.getScriptProperties().getProperty('SYNC_SECRET');
    if (!expectedSecret || payload.secret !== expectedSecret) {
      return json_({ ok: false, error: 'Unauthorized sync request.' });
    }
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    replaceSheet_(spreadsheet, 'Inventory', [
      ['Item ID', 'Product name', 'SKU', 'Date bought / stocked', 'Quantity', 'Reorder at', 'Cost per unit', 'Selling price', 'Synced at']
    ], (payload.inventory || []).map(function (item) {
      return [safeText_(item.id), safeText_(item.name), safeText_(item.sku), safeText_(item.stockedDate || ''), item.quantity, item.reorderAt, item.cost, item.price, safeText_(payload.syncedAt)];
    }));

    replaceSheet_(spreadsheet, 'Sales', [
      ['Sale ID', 'Invoice', 'Date', 'Customer', 'Phone', 'Payment', 'Items', 'Total', 'Recorded at', 'Synced at']
    ], (payload.sales || []).map(function (sale) {
      var items = (sale.items || []).map(function (item) {
        return safeText_(item.name) + ' x' + item.quantity + ' @ ' + item.price;
      }).join('; ');
      return [safeText_(sale.id), safeText_(sale.invoice), safeText_(sale.date), safeText_(sale.customer), safeText_(sale.phone), safeText_(sale.payment), items, sale.total, safeText_(sale.createdAt), safeText_(payload.syncedAt)];
    }));

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeText_(value) {
  var text = String(value == null ? '' : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function replaceSheet_(spreadsheet, name, headers, rows) {
  var sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  sheet.clearContents();
  var values = headers.concat(rows);
  sheet.getRange(1, 1, values.length, headers[0].length).setValues(values);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers[0].length).setFontWeight('bold').setBackground('#204F41').setFontColor('#FFFFFF');
  sheet.autoResizeColumns(1, headers[0].length);
}
