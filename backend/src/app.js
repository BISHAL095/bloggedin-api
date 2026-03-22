const express = require("express");
const { applySecurityHeaders, createRateLimiter } = require("./middlewares/securityMiddleware");

const app = express();

const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const authRoutes = require("./routes/authRoutes");

const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use((req, res, next) => {
  const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || defaultOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.set("trust proxy", 1);
app.use(applySecurityHeaders);
app.use(express.json({ limit: "100kb" }));
app.use(createRateLimiter({ windowMs: 60 * 1000, maxRequests: 120 }));
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;
