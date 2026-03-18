const prisma = require("../prisma");

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

const getPublishedPostById = async (id) => {
  return prisma.post.findFirst({
    where: {
      id,
      published: true,
    },
    select: postDetailSelect,
  });
};

module.exports = {
  getPublishedPosts,
  getPublishedPostById,
};
