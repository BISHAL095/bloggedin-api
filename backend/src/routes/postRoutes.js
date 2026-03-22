const express = require("express");
const { authMiddleware, csrfMiddleware } = require("../middlewares/authMiddleware");
const { createRateLimiter } = require("../middlewares/securityMiddleware");
const {
  getPublishedPosts,
  getAllPosts,
  getPublishedPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.get("/admin/all", authMiddleware, getAllPosts);
router.get("/", getPublishedPosts);
router.get("/:id", getPublishedPostById);
router.post("/", authMiddleware, csrfMiddleware, createRateLimiter({ windowMs: 60 * 1000, maxRequests: 30 }), createPost);
router.put("/:id", authMiddleware, csrfMiddleware, createRateLimiter({ windowMs: 60 * 1000, maxRequests: 30 }), updatePost);
router.delete("/:id", authMiddleware, csrfMiddleware, createRateLimiter({ windowMs: 60 * 1000, maxRequests: 30 }), deletePost);

module.exports = router;
