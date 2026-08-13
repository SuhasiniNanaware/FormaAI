const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/ApiResponse");

// Accepts the token from either the httpOnly cookie set on login (the
// intended path now that cookie-parser is actually used for something) or an
// "Authorization: Bearer <token>" header, so both a browser client and a
// plain API client (Postman, a mobile app, tests) work against the same
// routes.
module.exports = function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const token = (req.cookies && req.cookies.token) || bearerToken;

    if (!token) {
      return res.status(401).json(new ApiResponse(false, "Authentication required"));
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json(new ApiResponse(false, "Server auth misconfigured: JWT_SECRET is not set"));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    return next();
  } catch (_error) {
    return res.status(401).json(new ApiResponse(false, "Invalid or expired session"));
  }
};
