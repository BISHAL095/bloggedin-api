function CommentModerationList({ busyId, comments, onDelete }) {
  if (!comments.length) {
    return <p className="status-line">No comments on this post yet.</p>
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <article className="comment-card" key={comment.id}>
          <div className="meta-row">
            <span>{comment.user?.email || 'Unknown user'}</span>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p>{comment.content}</p>
          <button
            type="button"
            className="danger-button"
            disabled={busyId === comment.id}
            onClick={() => onDelete(comment.id)}
          >
            {busyId === comment.id ? 'Removing...' : 'Delete comment'}
          </button>
        </article>
      ))}
    </div>
  )
}

export default CommentModerationList
