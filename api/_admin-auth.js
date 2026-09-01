const crypto = require('crypto');

const COOKIE_NAME = '__Host-rt-admin';
const SESSION_SECONDS = 60 * 60 * 8;
const loginAttempts = new Map();

function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').setHeader('Cache-Control', 'no-store').send(JSON.stringify(body));
}

function getConfig() {
  const config = {
    email: process.env.ADMIN_OWNER_EMAIL,
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
    passwordSalt: process.env.ADMIN_PASSWORD_SALT,
    sessionSecret: process.env.ADMIN_SESSION_SECRET,
  };
  if (Object.values(config).some((value) => !value)) {
    throw new Error('Admin authentication has not been configured.');
  }
  return config;
}

function parseCookies(header) {
  return (header || '').split(';').reduce((cookies, piece) => {
    const separator = piece.indexOf('=');
    if (separator > -1) cookies[piece.slice(0, separator).trim()] = decodeURIComponent(piece.slice(separator + 1).trim());
    return cookies;
  }, {});
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function createSession(email, secret) {
  const body = base64url(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
  return `${body}.${sign(body, secret)}`;
}

function readSession(req) {
  try {
    const config = getConfig();
    const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
    if (!token || !token.includes('.')) return null;
    const [body, signature] = token.split('.');
    const expected = sign(body, config.sessionSecret);
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const session = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (session.email !== config.email || session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch (_) {
    return null;
  }
}

function sessionCookie(token, maxAge = SESSION_SECONDS) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch (_) { return false; }
}

function clientKey(req) {
  return String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

function canAttemptLogin(req) {
  const record = loginAttempts.get(clientKey(req));
  return !record || record.resetAt < Date.now() || record.count < 5;
}

function recordFailedLogin(req) {
  const key = clientKey(req);
  const record = loginAttempts.get(key);
  if (!record || record.resetAt < Date.now()) loginAttempts.set(key, { count: 1, resetAt: Date.now() + 10 * 60 * 1000 });
  else record.count += 1;
}

function clearFailedLogins(req) {
  loginAttempts.delete(clientKey(req));
}

function requireOwner(req, res) {
  if (!isSameOrigin(req)) {
    sendJson(res, 403, { error: 'Invalid request origin.' });
    return null;
  }
  const session = readSession(req);
  if (!session) {
    sendJson(res, 401, { error: 'Owner sign-in required.' });
    return null;
  }
  return session;
}

function validPassword(password, config) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 256) return false;
  const derived = crypto.scryptSync(password, config.passwordSalt, 64).toString('hex');
  return derived.length === config.passwordHash.length && crypto.timingSafeEqual(Buffer.from(derived), Buffer.from(config.passwordHash));
}

function readBody(req) {
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return req.body || {};
}

module.exports = { canAttemptLogin, clearFailedLogins, createSession, getConfig, isSameOrigin, readBody, readSession, recordFailedLogin, requireOwner, sendJson, sessionCookie, validPassword };
