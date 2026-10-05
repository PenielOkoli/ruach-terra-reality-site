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
      ['Item ID', 'Product name', 'SKU', 'Date bought / stocked', 'Quantity', 'Reorder at', 'Cost per unit', 'Selling price', 'Synced at', 'Data (raw - do not edit)']
    ], (payload.inventory || []).map(function (item) {
      return [safeText_(item.id), safeText_(item.name), safeText_(item.sku), safeText_(item.stockedDate || ''), item.quantity, item.reorderAt, item.cost, item.price, safeText_(payload.syncedAt), JSON.stringify(item)];
    }));

    replaceSheet_(spreadsheet, 'Sales', [
      ['Sale ID', 'Invoice', 'Date', 'Customer', 'Phone', 'Payment', 'Items', 'Discount', 'Total', 'Recorded at', 'Synced at', 'Data (raw - do not edit)']
    ], (payload.sales || []).map(function (sale) {
      var items = (sale.items || []).map(function (item) {
        return safeText_(item.name) + ' x' + item.quantity + ' @ ' + item.price + (item.discountPercent ? ' (' + item.discountPercent + '% off)' : '');
      }).join('; ');
      return [safeText_(sale.id), safeText_(sale.invoice), safeText_(sale.date), safeText_(sale.customer), safeText_(sale.phone), safeText_(sale.payment), items, sale.discountTotal || 0, sale.total, safeText_(sale.createdAt), safeText_(payload.syncedAt), JSON.stringify(sale)];
    }));

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doGet(e) {
  try {
    var expectedSecret = PropertiesService.getScriptProperties().getProperty('SYNC_SECRET');
    if (!expectedSecret || !e.parameter || e.parameter.secret !== expectedSecret) {
      return json_({ ok: false, error: 'Unauthorized sync request.' });
    }
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    return json_({ ok: true, inventory: readRaw_(spreadsheet, 'Inventory'), sales: readRaw_(spreadsheet, 'Sales') });
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function readRaw_(spreadsheet, name) {
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var lastColumn = sheet.getLastColumn();
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastColumn).getValues();
  var records = [];
  values.forEach(function (row) {
    try {
      var parsed = JSON.parse(row[lastColumn - 1]);
      if (parsed) records.push(parsed);
    } catch (err) { /* skip rows without valid raw data */ }
  });
  return records;
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
  var columnCount = headers[0].length;
  sheet.getRange(1, 1, values.length, columnCount).setValues(values);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, columnCount).setFontWeight('bold').setBackground('#204F41').setFontColor('#FFFFFF');
  sheet.autoResizeColumns(1, columnCount - 1);
  sheet.hideColumns(columnCount);
}

