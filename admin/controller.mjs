import { $, $$, setMessage } from "./dom.mjs";
import { createStore } from "./storage.mjs";
import { createAdminApi } from "./api.mjs";
import { createAdminView } from "./view.mjs";
import {
  today,
  createInventoryItem,
  selectSaleItems,
  recordSale,
  restockItem,
} from "./domain.mjs";
import { csvDownload, inventoryRows, salesRows } from "./exports.mjs";

// Composition root: connects events to domain rules, persistence, transport, and views.
export function startAdmin() {
  if (!document.getElementById("adminPortal")) return;
  const store = createStore(localStorage);
  const db = store.state;
  const saveStore = () => store.save();
  const api = createAdminApi();
  const { addSaleLine, updateSaleTotals, renderAll, showInvoice } =
    createAdminView(db);

  function showTab(tab) {
    $$(".admin-tab-btn").forEach(function (button) {
      button.classList.toggle("active", button.dataset.adminTab === tab);
    });
    $$("[data-admin-panel]").forEach(function (panel) {
      panel.hidden = panel.dataset.adminPanel !== tab;
    });
  }

  function openPortal() {
    $("#ownerGate").hidden = true;
    $("#adminPortal").hidden = false;
    $("#adminDate").textContent = new Date().toLocaleDateString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    renderAll();
    pullFromSheet();
  }

  // Keep the shared-sheet refresh added on main, with all transport in api.mjs.
  function pullFromSheet(messageTarget) {
    const localSnapshot = JSON.stringify(db);
    return api.pull().then(function (data) {
      // A delayed refresh must not discard a sale/item saved while it was loading.
      if (JSON.stringify(db) !== localSnapshot) {
        setMessage(messageTarget || '#settingsMessage', 'Local records changed during refresh. Saved records were kept; refresh again when ready.', true);
        return false;
      }
      if (!Array.isArray(data.inventory) || !Array.isArray(data.sales)) throw new Error('Invalid spreadsheet response');
      if (!data.inventory.length && !data.sales.length && (db.inventory.length || db.sales.length)) {
        return syncSheet(messageTarget, "Setting up shared sync with this device's existing data...", "This device's data is now the shared copy in Google Sheets.");
      }
      db.inventory = data.inventory;
      db.sales = data.sales;
      saveStore();
      renderAll();
      if (messageTarget) setMessage(messageTarget, 'Refreshed with the latest data from Google Sheets.');
      return true;
    }).catch(function (error) {
      if (error.status === 503 && !messageTarget) return false;
      setMessage(messageTarget || '#settingsMessage', 'Could not refresh from Google Sheets - showing the last saved copy on this device.', true);
      return false;
    });
  }

  function closePortal() {
    window.location.href = "index.html";
  }

  function startOwnerAccess() {
    api
      .session()
      .then(openPortal)
      .catch(function () {
        $("#ownerGate").hidden = false;
        $("#ownerEmail").focus();
      });
  }

  function signOut() {
    api
      .logout()
      .catch(function () {})
      .finally(function () {
        closePortal();
        $("#ownerGate").hidden = true;
        setMessage("#ownerLoginMessage", "You have signed out.");
      });
  }

  function syncSheet(messageTarget, pendingMessage, successMessage) {
    setMessage(
      messageTarget || "#settingsMessage",
      pendingMessage || "Saving changes securely...",
    );
    return api
      .sync({ inventory: db.inventory, sales: db.sales })
      .then(function () {
        setMessage(
          messageTarget || "#settingsMessage",
          successMessage || "Changes securely synced to Google Sheets.",
        );
        return true;
      })
      .catch(function (error) {
        if (error.status === 401) {
          closePortal();
          $("#ownerGate").hidden = false;
          setMessage(
            "#ownerLoginMessage",
            "Your session expired. Please sign in again.",
            true,
          );
        }
        setMessage(messageTarget || "#settingsMessage", error.message, true);
        return false;
      });
  }

  var ownerLaunch = $("#openOwnerPortal");
  if (ownerLaunch) ownerLaunch.addEventListener("click", startOwnerAccess);
  else startOwnerAccess();
  $("#closeOwnerGate").addEventListener("click", function () {
    $("#ownerGate").hidden = true;
  });
  $("#ownerLoginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var button = $('button[type="submit"]', event.currentTarget);
    button.disabled = true;
    setMessage("#ownerLoginMessage", "Signing in...");
    api
      .login({
        email: $("#ownerEmail").value,
        password: $("#ownerPassword").value,
      })
      .then(function () {
        $("#ownerPassword").value = "";
        setMessage("#ownerLoginMessage", "");
        openPortal();
      })
      .catch(function (error) {
        setMessage("#ownerLoginMessage", error.message, true);
      })
      .finally(function () {
        button.disabled = false;
      });
  });
  $("#closeAdminPortal").addEventListener("click", closePortal);
  $("#ownerLogout").addEventListener("click", signOut);
  $("#settingsLogout").addEventListener("click", signOut);
  $("#refreshFromSheets").addEventListener("click", function () {
    setMessage('#settingsMessage', 'Refreshing...');
    pullFromSheet('#settingsMessage');
  });
  $$(".admin-tab-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      showTab(button.dataset.adminTab);
    });
  });
  $$("[data-go-tab]").forEach(function (button) {
    button.addEventListener("click", function () {
      showTab(button.dataset.goTab);
    });
  });
  $("#addSaleLine").addEventListener("click", function () {
    addSaleLine();
  });
  $("#saleLines").addEventListener("input", updateSaleTotals);
  $("#saleLines").addEventListener("change", updateSaleTotals);
  $("#saleLines").addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-sale-line")) {
      if ($$(".sale-line").length > 1)
        event.target.closest(".sale-line").remove();
      updateSaleTotals();
    }
  });
  $("#saleForm").elements.date.value = today();
  $("#inventoryForm").elements.stockedDate.value = today();
  $("#saleForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    const lines = $$(".sale-line").map((line) => ({
      productId: $(".sale-product", line).value,
      quantity: $(".sale-quantity", line).value,
      discountPercent: $(".sale-discount", line).value,
    }));
    const { items, error } = selectSaleItems(db.inventory, lines);
    if (error) return setMessage("#saleMessage", error, true);
    const data = new FormData(form);
    const sale = recordSale(
      db,
      {
        customer: data.get("customer"),
        phone: data.get("phone"),
        payment: data.get("payment"),
        date: data.get("date"),
      },
      items,
    );
    saveStore();
    form.reset();
    form.elements.date.value = today();
    renderAll();
    syncSheet(
      "#saleMessage",
      "Sale saved. Syncing inventory and invoice securely...",
      "Sale saved and synced to Google Sheets. Invoice " +
        sale.invoice +
        " is ready.",
    );
    showInvoice(sale.id);
  });
  $("#inventoryForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    db.inventory.push(
      createInventoryItem(Object.fromEntries(new FormData(form))),
    );
    saveStore();
    form.reset();
    form.elements.reorderAt.value = 10;
    form.elements.stockedDate.value = today();
    renderAll();
    syncSheet(
      "#inventoryMessage",
      "Inventory item saved. Syncing securely...",
      "Inventory item saved and synced to Google Sheets.",
    );
  });
  $("#inventoryBody").addEventListener("click", function (event) {
    if (!event.target.dataset.restock) return;
    var item = db.inventory.find(function (record) {
        return record.id === event.target.dataset.restock;
      }),
      amount = Number(
        window.prompt(
          "How many units of " + item.name + " are you adding?",
          "0",
        ),
      );
    if (restockItem(item, amount)) {
      saveStore();
      renderAll();
      syncSheet(
        "#inventoryMessage",
        "Stock updated. Syncing securely...",
        "Stock updated and synced to Google Sheets.",
      );
    }
  });
  document.addEventListener("click", function (event) {
    if (event.target.dataset.invoice) showInvoice(event.target.dataset.invoice);
  });
  $("#closeInvoice").addEventListener("click", function () {
    $("#invoiceSheet").hidden = true;
  });
  $("#printInvoice").addEventListener("click", function () {
    window.print();
  });
  $("#exportInventory").addEventListener("click", () =>
    csvDownload("ruach-terra-inventory.csv", inventoryRows(db.inventory)),
  );
  $("#exportSales").addEventListener("click", () =>
    csvDownload("ruach-terra-sales.csv", salesRows(db.sales)),
  );
}
