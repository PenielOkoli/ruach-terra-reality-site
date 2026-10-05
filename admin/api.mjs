// Transport only: no DOM access, local storage, or business calculations.
export function createAdminApi(fetchRequest = globalThis.fetch) {
  function request(path, options) {
    options = options || {};
    return fetchRequest(path, {
      method: options.method || "GET",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: options.body ? JSON.stringify(options.body) : undefined,
    }).then(function (response) {
      return response
        .json()
        .catch(function () {
          return {};
        })
        .then(function (body) {
          if (!response.ok) {
            var error = new Error(body.error || "Request failed.");
            error.status = response.status;
            throw error;
          }
          return body;
        });
    });
  }
  return {
    session: () => request("/api/auth/session"),
    login: (credentials) =>
      request("/api/auth/login", { method: "POST", body: credentials }),
    logout: () => request("/api/auth/logout", { method: "POST", body: {} }),
    sync: (records) =>
      request("/api/admin/sync", { method: "POST", body: records }),
  };
}
