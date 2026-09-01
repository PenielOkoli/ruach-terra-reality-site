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
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

    replaceSheet_(spreadsheet, 'Inventory', [
      ['Item ID', 'Product name', 'SKU', 'Quantity', 'Reorder at', 'Cost per unit', 'Selling price', 'Synced at']
    ], (payload.inventory || []).map(function (item) {
      return [item.id, item.name, item.sku, item.quantity, item.reorderAt, item.cost, item.price, payload.syncedAt];
    }));

    replaceSheet_(spreadsheet, 'Sales', [
      ['Sale ID', 'Invoice', 'Date', 'Customer', 'Phone', 'Payment', 'Items', 'Total', 'Recorded at', 'Synced at']
    ], (payload.sales || []).map(function (sale) {
      var items = (sale.items || []).map(function (item) {
        return item.name + ' x' + item.quantity + ' @ ' + item.price;
      }).join('; ');
      return [sale.id, sale.invoice, sale.date, sale.customer, sale.phone, sale.payment, items, sale.total, sale.createdAt, payload.syncedAt];
    }));

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
