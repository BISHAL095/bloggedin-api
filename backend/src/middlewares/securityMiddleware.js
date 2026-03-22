const createRateLimiter = ({ windowMs, maxRequests }) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= maxRequests) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({ error: "Too many requests" });
    }

    entry.count += 1;
    return next();
  };
};

const applySecurityHeaders = (req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  next();
};

module.exports = {
  applySecurityHeaders,
  createRateLimiter,
};
