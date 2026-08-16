const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'forma-ai-local-dev-secret';

    const payload = jwt.verify(token, secret);
    if (!payload || !payload.id) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized', error: error.message });
  }
};

module.exports = authMiddleware;
