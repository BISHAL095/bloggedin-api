const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "bloggedin_session";

const parseCookies = (cookieHeader = "") => {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const [rawKey, ...rawValue] = part.trim().split("=");

    if (!rawKey) {
      return cookies;
    }

    cookies[rawKey] = decodeURIComponent(rawValue.join("=") || "");
    return cookies;
  }, {});
};

const isProduction = () => process.env.NODE_ENV === "production";

const getCookieOptions = () => {
  const options = {
    httpOnly: true,
    path: "/",
    sameSite: isProduction() ? "none" : "lax",
    secure: isProduction(),
  };

  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};

const serializeCookie = (name, value, options = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.httpOnly) {
    parts.push("HttpOnly");
  }

  if (options.secure) {
    parts.push("Secure");
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join("; ");
};

const getAuthCookie = (req) => {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[AUTH_COOKIE_NAME] || "";
};

const signSessionToken = (user, csrfToken) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      csrfToken,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const verifySessionToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const generateCsrfToken = () => crypto.randomBytes(24).toString("hex");

const buildSessionPayload = (user, csrfToken) => ({
  userId: user.id,
  email: user.email,
  role: user.role,
  csrfToken,
});

module.exports = {
  AUTH_COOKIE_NAME,
  buildSessionPayload,
  generateCsrfToken,
  getAuthCookie,
  getCookieOptions,
  parseCookies,
  serializeCookie,
  signSessionToken,
  verifySessionToken,
};
