import CommentModerationList from './CommentModerationList'
import PostEditor from './PostEditor'

function PostList({
  busyAction,
  editDraft,
  editingId,
  onDeleteComment,
  onDeletePost,
  onEditChange,
  onEditStart,
  onEditSubmit,
  onRefresh,
  onTogglePublished,
  onCancelEdit,
  posts,
  status,
}) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Library</p>
          <h2>All posts</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {status ? <p className="status-line">{status}</p> : null}

      <div className="post-stack">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <div className="meta-row">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>{post.author.email}</span>
            </div>

            {editingId === post.id ? (
              <PostEditor
                busy={busyAction === `save:${post.id}`}
                draft={editDraft}
                onCancel={onCancelEdit}
                onChange={onEditChange}
                onSubmit={(event) => onEditSubmit(event, post.id)}
              />
            ) : (
              <>
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <span className={`pill ${post.published ? 'live-pill' : 'draft-pill'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p>{post.content}</p>
                <div className="action-row wrap-row">
                  <button type="button" className="ghost-button" onClick={() => onEditStart(post)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="ghost-button"
                    disabled={busyAction === `toggle:${post.id}`}
                    onClick={() => onTogglePublished(post)}
                  >
                    {busyAction === `toggle:${post.id}`
                      ? 'Updating...'
                      : post.published
                        ? 'Unpublish'
                        : 'Publish'}
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    disabled={busyAction === `delete:${post.id}`}
                    onClick={() => onDeletePost(post.id)}
                  >
                    {busyAction === `delete:${post.id}` ? 'Deleting...' : 'Delete post'}
                  </button>
                </div>

                <div className="moderation-block">
                  <div className="section-head compact-head">
                    <div>
                      <p className="eyebrow">Comments</p>
                      <h3>{post.comments.length} items</h3>
                    </div>
                  </div>
                  <CommentModerationList
                    busyId={busyAction.startsWith('comment:') ? busyAction.slice(8) : ''}
                    comments={post.comments}
                    onDelete={onDeleteComment}
                  />
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default PostList
