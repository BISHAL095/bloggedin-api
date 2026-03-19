const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getPublishedPosts,
  getPublishedPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const router = express.Router();

router.get("/", getPublishedPosts);
router.get("/:id", getPublishedPostById);
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;

