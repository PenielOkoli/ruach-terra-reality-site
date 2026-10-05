import { $, $$ } from "./dom.mjs";
import { number, getOverview } from "./domain.mjs";
import { money, escapeHtml, formatDate } from "./format.mjs";

// Rendering reads state but never persists, syncs, or changes business records.
export function createAdminView(db) {
  function lineMarkup(item) {
    var options =
      '<option value="">Select item</option>' +
      db.inventory
        .map(function (product) {
          return (
            '<option value="' +
            product.id +
            '"' +
            (item && item.productId === product.id ? " selected" : "") +
            ">" +
            escapeHtml(product.name) +
            " (" +
            product.quantity +
            " in stock)</option>"
          );
        })
        .join("");
    return (
      '<div class="sale-line"><label>Product<select class="sale-product" required>' +
      options +
      '</select></label><label>Quantity<input class="sale-quantity" required type="number" min="1" step="1" value="' +
      (item ? item.quantity : 1) +
      '"></label><label>Line total<div class="sale-line-total">0</div></label><button class="row-action remove-sale-line" type="button">Remove</button></div>'
    );
  }

  function addSaleLine(item) {
    $("#saleLines").insertAdjacentHTML("beforeend", lineMarkup(item));
    updateSaleTotals();
  }

  function updateSaleTotals() {
    var total = 0;
    $$(".sale-line").forEach(function (line) {
      var product = db.inventory.find(function (candidate) {
        return candidate.id === $(".sale-product", line).value;
      });
      var amount = product
        ? number($(".sale-quantity", line).value) * number(product.price)
        : 0;
      $(".sale-line-total", line).textContent = money.format(amount);
      total += amount;
    });
    $("#saleGrandTotal").textContent = "Total: " + money.format(total);
    return total;
  }

  function refreshSaleLines() {
    var previous = $$(".sale-line").map(function (line) {
      return {
        productId: $(".sale-product", line).value,
        quantity: number($(".sale-quantity", line).value) || 1,
      };
    });
    $("#saleLines").innerHTML = "";
    (previous.length ? previous : [null]).forEach(addSaleLine);
  }

  function renderInventory() {
    $("#inventoryBody").innerHTML = db.inventory.length
      ? db.inventory
          .map(function (item) {
            var low = item.quantity <= item.reorderAt;
            return (
              "<tr><td><strong>" +
              escapeHtml(item.name) +
              "</strong></td><td>" +
              escapeHtml(item.sku || "-") +
              "</td><td>" +
              (item.stockedDate ? formatDate(item.stockedDate) : "-") +
              '</td><td><span class="stock-pill ' +
              (low ? "low" : "") +
              '">' +
              item.quantity +
              " units" +
              (low ? " - reorder" : "") +
              "</span></td><td>" +
              (item.cost ? money.format(item.cost) : "-") +
              "</td><td>" +
              money.format(item.price) +
              '</td><td><button class="row-action" type="button" data-restock="' +
              item.id +
              '">Restock</button></td></tr>'
            );
          })
          .join("")
      : '<tr><td colspan="7" class="admin-muted">No inventory yet. Add your first product above.</td></tr>';
  }

  function renderSales() {
    var recent = db.sales.slice().reverse().slice(0, 6);
    $("#recentSalesBody").innerHTML = recent.length
      ? recent
          .map(function (sale) {
            return (
              "<tr><td><strong>" +
              escapeHtml(sale.invoice) +
              "</strong></td><td>" +
              escapeHtml(sale.customer) +
              "</td><td>" +
              formatDate(sale.date) +
              "</td><td>" +
              money.format(sale.total) +
              '</td><td><button class="row-action" type="button" data-invoice="' +
              sale.id +
              '">View</button></td></tr>'
            );
          })
          .join("")
      : '<tr><td colspan="5" class="admin-muted">No sales recorded yet.</td></tr>';
    $("#invoiceBody").innerHTML = db.sales.length
      ? db.sales
          .slice()
          .reverse()
          .map(function (sale) {
            return (
              "<tr><td><strong>" +
              escapeHtml(sale.invoice) +
              "</strong></td><td>" +
              escapeHtml(sale.customer) +
              "</td><td>" +
              formatDate(sale.date) +
              "</td><td>" +
              escapeHtml(sale.payment) +
              "</td><td>" +
              money.format(sale.total) +
              '</td><td><button class="row-action" type="button" data-invoice="' +
              sale.id +
              '">Print / view</button></td></tr>'
            );
          })
          .join("")
      : '<tr><td colspan="6" class="admin-muted">Invoices will appear here after you save a sale.</td></tr>';
  }

  function renderAll() {
    renderOverview();
    renderInventory();
    renderSales();
    refreshSaleLines();
  }

  function showInvoice(id) {
    var sale = db.sales.find(function (record) {
      return record.id === id;
    });
    if (!sale) return;
    var rows = sale.items
      .map(function (item) {
        return (
          "<tr><td>" +
          escapeHtml(item.name) +
          '</td><td class="invoice-quantity">' +
          item.quantity +
          '</td><td class="invoice-amount">' +
          money.format(item.price) +
          '</td><td class="invoice-amount"><strong>' +
          money.format(item.total) +
          "</strong></td></tr>"
        );
      })
      .join("");
    $("#invoicePaper").innerHTML =
      '<div class="invoice-header"><div class="invoice-logo">Ruach &amp; Terra<span>Reality Ltd.</span></div><div><div class="invoice-title">Invoice</div><div class="invoice-meta"><strong>' +
      escapeHtml(sale.invoice) +
      "</strong><br>Issued " +
      formatDate(sale.date) +
      '</div></div></div><div class="invoice-party"><div><span class="label">Bill to</span><strong>' +
      escapeHtml(sale.customer) +
      "</strong><br>" +
      escapeHtml(sale.phone || "-") +
      '</div><div><span class="label">Business</span>10A Covel Plaza, opp. Beechwood Estate<br>Malete, Lagos<br>0703 069 5474</div></div><table class="invoice-table"><thead><tr><th>Item</th><th class="invoice-quantity">Qty</th><th class="invoice-amount">Unit price</th><th class="invoice-amount">Amount</th></tr></thead><tbody>' +
      rows +
      '</tbody></table><div class="invoice-total"><div><span>Total</span><span>' +
      money.format(sale.total) +
      '</span></div></div><div class="invoice-note">Payment method: ' +
      escapeHtml(sale.payment) +
      "<br>Thank you for choosing Ruach &amp; Terra Reality Ltd.</div>";
    $("#invoiceSheet").hidden = false;
  }

  function renderOverview() {
    const { todaySales, monthSales, todayTotal, monthTotal, units, low } =
      getOverview(db);
    $("#metricToday").textContent = money.format(todayTotal);
    $("#metricTodayHint").textContent =
      todaySales.length +
      (todaySales.length === 1 ? " transaction today" : " transactions today");
    $("#metricMonth").textContent = money.format(monthTotal);
    $("#metricMonthHint").textContent =
      monthSales.length +
      (monthSales.length === 1
        ? " transaction this month"
        : " transactions this month");
    $("#metricItems").textContent = db.inventory.length;
    $("#metricItemsHint").textContent = units + " units in stock";
    $("#metricLow").textContent = low.length;
    $("#lowStockList").innerHTML = low.length
      ? low
          .map(function (item) {
            return (
              '<p class="admin-stock-alert"><strong>' +
              escapeHtml(item.name) +
              '</strong><br><span class="stock-pill low">' +
              item.quantity +
              " left - reorder at " +
              item.reorderAt +
              "</span></p>"
            );
          })
          .join("")
      : "No items need reordering.";
  }
  return { addSaleLine, updateSaleTotals, renderAll, showInvoice };
}
