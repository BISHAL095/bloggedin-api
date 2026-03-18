const express = require("express");
const {
  getPublishedPosts,
  getPublishedPostById,
} = require("../controllers/postController");

const router = express.Router();

router.get("/", getPublishedPosts);
router.get("/:id", getPublishedPostById);

module.exports = router;
