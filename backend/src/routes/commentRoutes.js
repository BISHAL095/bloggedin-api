const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { createComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/", authMiddleware, createComment);

module.exports = router;
