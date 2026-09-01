const { isSameOrigin, sendJson, sessionCookie } = require('../_admin-auth');

module.exports = function logout(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });
  if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'Invalid request origin.' });
  res.setHeader('Set-Cookie', sessionCookie('', 0));
  return sendJson(res, 200, { ok: true });
};
