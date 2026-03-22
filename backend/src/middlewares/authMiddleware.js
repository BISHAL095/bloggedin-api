const { getAuthCookie, verifySessionToken } = require("../lib/auth");

/**
 * Verifies a JWT from the secure auth cookie or Authorization header and attaches user to request
 */
const authMiddleware = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not configured" });
  }

  const authHeader = req.headers.authorization;
  const cookieToken = getAuthCookie(req);

  if (!cookieToken && (!authHeader || !authHeader.startsWith("Bearer "))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = cookieToken || authHeader.split(" ")[1];

  try {
    const decoded = verifySessionToken(token);

    req.user = decoded; // attach user info to request

    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const csrfMiddleware = (req, res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return next();
  }

  const csrfHeader = req.headers["x-csrf-token"];

  if (!req.user?.csrfToken || !csrfHeader || csrfHeader !== req.user.csrfToken) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  return next();
};

module.exports = {
  authMiddleware,
  csrfMiddleware,
};
