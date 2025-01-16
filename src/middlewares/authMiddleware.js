const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../utils/blacklist')

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  if (tokenBlacklist.has(token)) {
    return res.status(403).json({ message: 'Token has been revoked' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
    }; 
    next();
  });
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };