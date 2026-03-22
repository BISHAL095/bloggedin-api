const express = require("express");

const { getSession, registerUser, logUser, logoutUser } = require("../controllers/authController");
const { authMiddleware, csrfMiddleware } = require("../middlewares/authMiddleware");
const { createRateLimiter } = require("../middlewares/securityMiddleware");

const router = express.Router();

router.post("/register", createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 10 }), registerUser);

router.post("/login", createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 10 }), logUser);
router.get("/session", authMiddleware, getSession);
router.post("/logout", authMiddleware, csrfMiddleware, logoutUser);

module.exports = router;
