const rateLimit = require('express-rate-limit');

const aiGenerateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many AI generation requests. Please wait a moment and try again.',
  },
});

module.exports = {
  aiGenerateLimiter,
};