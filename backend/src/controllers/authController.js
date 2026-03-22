const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const {
  AUTH_COOKIE_NAME,
  buildSessionPayload,
  generateCsrfToken,
  getCookieOptions,
  serializeCookie,
  signSessionToken,
} = require("../lib/auth");

const PASSWORD_MIN_LENGTH = 8;
const EMAIL_MAX_LENGTH = 320;

const setSessionCookie = (res, user) => {
  const csrfToken = generateCsrfToken();
  const token = signSessionToken(user, csrfToken);

  res.setHeader(
    "Set-Cookie",
    serializeCookie(AUTH_COOKIE_NAME, token, {
      ...getCookieOptions(),
      maxAge: 60 * 60 * 24,
    })
  );

  return buildSessionPayload(user, csrfToken);
};

const clearSessionCookie = (res) => {
  res.setHeader(
    "Set-Cookie",
    serializeCookie(AUTH_COOKIE_NAME, "", {
      ...getCookieOptions(),
      maxAge: 0,
    })
  );
};

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (normalizedEmail.length > EMAIL_MAX_LENGTH) {
      return res.status(400).json({ error: "Email is too long" });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: "USER",
      },
    });

    const session = setSessionCookie(res, user);

    res.status(201).json({
      message: "User created successfully",
      session,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Handles user authentication and JWT token generation

const logUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (normalizedEmail.length > EMAIL_MAX_LENGTH) {
      return res.status(400).json({ error: "Email is too long" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const session = setSessionCookie(res, user);

    res.json({
      message: "Login successful",
      session,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSession = async (req, res) => {
  if (!req.user?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    clearSessionCookie(res);
    return res.status(401).json({ error: "Session user not found" });
  }

  return res.status(200).json({
    session: buildSessionPayload(user, req.user.csrfToken),
  });
};

const logoutUser = (req, res) => {
  clearSessionCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  getSession,
  registerUser,
  logUser,
  logoutUser,
};
