// Export serialization is pure; downloading is an explicit browser adapter.
export function serializeCsv(rows) {
  const quote = (value) =>
    '"' + String(value == null ? "" : value).replace(/"/g, '""') + '"';
  return rows.map((row) => row.map(quote).join(",")).join("\r\n");
}

export function inventoryRows(inventory) {
  return [
    [
      "Name",
      "SKU",
      "Date Bought / Stocked",
      "Quantity",
      "Reorder At",
      "Cost",
      "Selling Price",
    ],
  ].concat(
    inventory.map((item) => [
      item.name,
      item.sku,
      item.stockedDate || "",
      item.quantity,
      item.reorderAt,
      item.cost,
      item.price,
    ]),
  );
}

export function salesRows(sales) {
  return [
    ["Invoice", "Date", "Customer", "Phone", "Payment", "Items", "Total"],
  ].concat(
    sales.map((sale) => [
      sale.invoice,
      sale.date,
      sale.customer,
      sale.phone,
      sale.payment,
      sale.items.map((item) => item.name + " x" + item.quantity).join("; "),
      sale.total,
    ]),
  );
}

export function csvDownload(filename, rows) {
  const blob = new Blob([serializeCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
