const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  try {
    const comment = await commentService.createComment(req.body);

    return res.status(201).json(comment);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error("Failed to create comment:", error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
};

module.exports = {
  createComment,
};
