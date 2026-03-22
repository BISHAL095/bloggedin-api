const postService = require("../services/postService");

const getPublishedPosts = async (req, res) => {
  try {
    const posts = await postService.getPublishedPosts();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to fetch published posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const getPublishedPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.getPublishedPostById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return res.status(500).json({ error: "Failed to fetch post" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts(req.user);

    return res.status(200).json(posts);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to fetch admin posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await postService.createPost(req.body, req.user);

    return res.status(201).json(post);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to create post:", error);
    return res.status(500).json({ error: "Failed to create post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.updatePost(id, req.body, req.user);

    return res.status(200).json(post);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to update post:", error);
    return res.status(500).json({ error: "Failed to update post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await postService.deletePost(id, req.user);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to delete post:", error);
    return res.status(500).json({ error: "Failed to delete post" });
  }
};

module.exports = {
  getPublishedPosts,
  getAllPosts,
  getPublishedPostById,
  createPost,
  updatePost,
  deletePost,
};
