const express = require("express");

const { registerUser, logUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", logUser);

module.exports = router;
