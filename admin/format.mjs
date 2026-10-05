// Presentation-only formatting shared by the admin views and exports.
export const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function escapeHtml(value) {
  return String(value == null ? "" : value).replace(
    /[&<>'"]/g,
    function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[character];
    },
  );
}

export function formatDate(value) {
  return value
    ? new Date(value + "T12:00:00").toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
}
