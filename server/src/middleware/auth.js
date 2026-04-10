const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'travelxplore-secret-key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireHost(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'host') {
      return res.status(403).json({ error: 'Host access only' });
    }
    next();
  });
}

function requireTraveller(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'traveller') {
      return res.status(403).json({ error: 'Traveller access only' });
    }
    next();
  });
}

module.exports = { authMiddleware, requireHost, requireTraveller, JWT_SECRET };
