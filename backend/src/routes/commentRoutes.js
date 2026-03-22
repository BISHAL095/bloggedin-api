const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { createComment, deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
