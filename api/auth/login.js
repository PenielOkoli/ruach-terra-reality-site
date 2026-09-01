const { canAttemptLogin, clearFailedLogins, createSession, getConfig, isSameOrigin, readBody, recordFailedLogin, sendJson, sessionCookie, validPassword } = require('../_admin-auth');

module.exports = function login(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed.' });
  if (!isSameOrigin(req)) return sendJson(res, 403, { error: 'Invalid request origin.' });
  if (!canAttemptLogin(req)) return sendJson(res, 429, { error: 'Too many sign-in attempts. Try again in 10 minutes.' });
  try {
    const config = getConfig();
    const body = readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const matchesEmail = email === config.email.trim().toLowerCase();
    const matchesPassword = validPassword(body.password, config);
    if (!matchesEmail || !matchesPassword) {
      recordFailedLogin(req);
      return sendJson(res, 401, { error: 'Invalid email or password.' });
    }
    clearFailedLogins(req);
    res.setHeader('Set-Cookie', sessionCookie(createSession(config.email, config.sessionSecret)));
    return sendJson(res, 200, { ok: true });
  } catch (_) {
    return sendJson(res, 503, { error: 'Owner sign-in is not configured yet.' });
  }
};
