const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  try {
    const comment = await commentService.createComment(req.body, req.user);

    return res.status(201).json(comment);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to create comment:", error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await commentService.deleteComment(id, req.user);

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to delete comment:", error);
    return res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  createComment,
  deleteComment,
};
