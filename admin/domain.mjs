// Business rules only. No browser, persistence, network, or markup dependencies.
export function number(value) {
  return Number(value) || 0;
}

export function saleLineAmounts(quantity, price, discountInput = 0) {
  const discountPercent = Math.min(100, Math.max(0, number(discountInput)));
  const subtotal = number(quantity) * number(price);
  const discountAmount = subtotal * (discountPercent / 100);
  return { subtotal, discountPercent, discountAmount, total: subtotal - discountAmount };
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function makeId(prefix) {
  return (
    prefix +
    "-" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 6)
  );
}

export function invoiceNumber(salesCount, year = new Date().getFullYear()) {
  return "RT-" + year + "-" + String(salesCount + 1).padStart(4, "0");
}

export function createInventoryItem(
  values,
  id = makeId("item"),
  stockedDate = today(),
) {
  return {
    id,
    name: values.name.trim(),
    sku: values.sku.trim(),
    quantity: number(values.quantity),
    reorderAt: number(values.reorderAt),
    cost: number(values.cost),
    price: number(values.price),
    stockedDate: values.stockedDate || stockedDate,
  };
}

export function selectSaleItems(inventory, lines) {
  const selected = [];
  let error = "";
  lines.forEach(({ productId, quantity: input, discountPercent: discountInput }) => {
    const product = inventory.find((item) => item.id === productId);
    const quantity = number(input);
    if (!product) error = "Select a product for every line item.";
    else if (quantity < 1 || quantity > product.quantity) {
      error =
        "Check stock levels - " +
        product.name +
        " has only " +
        product.quantity +
        " units available.";
    } else {
      const { discountPercent, discountAmount, total } = saleLineAmounts(quantity, product.price, discountInput);
      selected.push({
        productId: product.id,
        name: product.name,
        quantity,
        price: number(product.price),
        discountPercent,
        discountAmount,
        total,
      });
    }
  });
  return {
    items: selected,
    error:
      error || (!selected.length ? "Add at least one item to the sale." : ""),
  };
}

export function recordSale(
  db,
  details,
  items,
  id = makeId("sale"),
  createdAt = new Date().toISOString(),
) {
  const sale = {
    id,
    invoice: invoiceNumber(db.sales.length),
    ...details,
    items,
    subtotal: items.reduce((sum, line) => sum + line.quantity * line.price, 0),
    discountTotal: items.reduce((sum, line) => sum + number(line.discountAmount), 0),
    total: items.reduce((sum, line) => sum + line.total, 0),
    createdAt,
  };
  items.forEach((line) => {
    db.inventory.find((item) => item.id === line.productId).quantity -=
      line.quantity;
  });
  db.sales.push(sale);
  return sale;
}

export function restockItem(item, amount, stockedDate = today()) {
  if (!Number.isFinite(amount) || amount <= 0) return false;
  item.quantity += amount;
  item.stockedDate = stockedDate;
  return true;
}

export function getOverview(db, now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  const todaySales = db.sales.filter((sale) => sale.date === day);
  const monthSales = db.sales.filter((sale) => {
    const date = new Date(sale.date + "T12:00:00");
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
  const total = (sales) =>
    sales.reduce((sum, sale) => sum + number(sale.total), 0);
  return {
    todaySales,
    monthSales,
    todayTotal: total(todaySales),
    monthTotal: total(monthSales),
    units: db.inventory.reduce((sum, item) => sum + number(item.quantity), 0),
    low: db.inventory.filter((item) => item.quantity <= item.reorderAt),
  };
}
