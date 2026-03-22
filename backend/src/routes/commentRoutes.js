const express = require("express");

const { authMiddleware, csrfMiddleware } = require("../middlewares/authMiddleware");
const { createRateLimiter } = require("../middlewares/securityMiddleware");
const { createComment, deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/", authMiddleware, csrfMiddleware, createRateLimiter({ windowMs: 60 * 1000, maxRequests: 20 }), createComment);
router.delete("/:id", authMiddleware, csrfMiddleware, createRateLimiter({ windowMs: 60 * 1000, maxRequests: 20 }), deleteComment);

module.exports = router;
