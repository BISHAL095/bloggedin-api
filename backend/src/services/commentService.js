const prisma = require("../prisma");

const createComment = async ({ content, postId }, user) => {
  const normalizedContent = typeof content === "string" ? content.trim() : "";

  if (!normalizedContent || !postId) {
    const error = new Error("content and postId are required");
    error.statusCode = 400;
    throw error;
  }

  if (!user || !user.userId) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, published: true },
  });

  if (!post || !post.published) {
    const error = new Error("Published post not found");
    error.statusCode = 404;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true },
  });

  if (!existingUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.comment.create({
    data: {
      content: normalizedContent,
      postId,
      userId: user.userId,
    },
    select: {
      id: true,
      content: true,
      postId: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

module.exports = {
  createComment,
};
