const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
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
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
