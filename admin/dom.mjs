// All selectors and status messages are kept in the UI layer.
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

export function setMessage(selector, message, isError) {
  var node = $(selector);
  if (node) {
    node.textContent = message || "";
    node.classList.toggle("error", !!isError);
  }
}
