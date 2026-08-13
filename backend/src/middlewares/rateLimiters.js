const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
const ApiResponse = require("../utils/ApiResponse");

// AI generation is the one route that costs real money per call once past a
// free tier, so it gets its own stricter limiter keyed by user (falls back
// to IP for any unauthenticated edge case) rather than the app-wide default.
// In practice this route always sits behind requireAuth, so req.user.id is
// always set by the time this runs - the IP branch exists only as a safe
// default, normalized through express-rate-limit's own helper so it doesn't
// mis-bucket IPv6 clients.
const aiGenerateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.user && req.user.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip)),
  handler: (_req, res) => {
    return res
      .status(429)
      .json(new ApiResponse(false, "Too many AI generation requests. Please try again later."));
  },
});

module.exports = { aiGenerateLimiter };
