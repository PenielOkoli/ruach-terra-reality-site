const { readSession, sendJson } = require('../_admin-auth');

module.exports = function session(req, res) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed.' });
  const owner = readSession(req);
  return owner ? sendJson(res, 200, { authenticated: true, email: owner.email }) : sendJson(res, 401, { authenticated: false });
};
