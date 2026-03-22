const prisma = require("../prisma");
const TITLE_MAX_LENGTH = 180;
const CONTENT_MAX_LENGTH = 20000;

const postListSelect = {
  id: true,
  title: true,
  content: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
  _count: {
    select: {
      comments: true,
    },
  },
};

const postDetailSelect = {
  id: true,
  title: true,
  content: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      email: true,
      role: true,
    },
  },
  comments: {
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  },
};

const getPublishedPosts = async () => {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: postListSelect,
  });
};

const getAllPosts = async (user) => {
  ensureAdmin(user);

  return prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: postDetailSelect,
  });
};

const getPublishedPostById = async (id) => {
  return prisma.post.findFirst({
    where: {
      id,
      published: true,
    },
    select: postDetailSelect,
  });
};

const ensureAdmin = (user) => {
  if (!user || user.role !== "ADMIN") {
    const error = new Error("Forbidden");
    error.statusCode = 403;
    throw error;
  }
};

const ensurePostExists = (post) => {
  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }
};

const createPost = async ({ title, content, published }, user) => {
  ensureAdmin(user);

  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedContent = typeof content === "string" ? content.trim() : "";

  if (!normalizedTitle || !normalizedContent) {
    const error = new Error("title and content are required");
    error.statusCode = 400;
    throw error;
  }

  if (normalizedTitle.length > TITLE_MAX_LENGTH) {
    const error = new Error("title is too long");
    error.statusCode = 400;
    throw error;
  }

  if (normalizedContent.length > CONTENT_MAX_LENGTH) {
    const error = new Error("content is too long");
    error.statusCode = 400;
    throw error;
  }

  return prisma.post.create({
    data: {
      title: normalizedTitle,
      content: normalizedContent,
      published: Boolean(published),
      authorId: user.userId,
    },
    select: postDetailSelect,
  });
};

const updatePost = async (id, { title, content, published }, user) => {
  ensureAdmin(user);

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  ensurePostExists(existingPost);

  const data = {};

  if (typeof title === "string") {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      const error = new Error("title cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    if (normalizedTitle.length > TITLE_MAX_LENGTH) {
      const error = new Error("title is too long");
      error.statusCode = 400;
      throw error;
    }

    data.title = normalizedTitle;
  }

  if (typeof content === "string") {
    const normalizedContent = content.trim();

    if (!normalizedContent) {
      const error = new Error("content cannot be empty");
      error.statusCode = 400;
      throw error;
    }

    if (normalizedContent.length > CONTENT_MAX_LENGTH) {
      const error = new Error("content is too long");
      error.statusCode = 400;
      throw error;
    }

    data.content = normalizedContent;
  }

  if (typeof published === "boolean") {
    data.published = published;
  }

  if (Object.keys(data).length === 0) {
    const error = new Error("At least one of title, content, or published is required");
    error.statusCode = 400;
    throw error;
  }

  return prisma.post.update({
    where: { id },
    data,
    select: postDetailSelect,
  });
};

const deletePost = async (id, user) => {
  ensureAdmin(user);

  const existingPost = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });

  ensurePostExists(existingPost);

  await prisma.comment.deleteMany({
    where: { postId: id },
  });

  await prisma.post.delete({
    where: { id },
  });
};

module.exports = {
  getPublishedPosts,
  getAllPosts,
  getPublishedPostById,
  createPost,
  updatePost,
  deletePost,
};
