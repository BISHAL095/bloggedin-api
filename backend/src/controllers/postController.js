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

module.exports = {
  getPublishedPosts,
  getPublishedPostById,
};
