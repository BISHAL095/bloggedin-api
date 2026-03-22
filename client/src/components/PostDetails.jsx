import CommentForm from './CommentForm'

function PostDetails({ busy, onCommentSubmit, post, session, status }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Reader View</p>
          <h2>{post ? post.title : 'Select a post'}</h2>
        </div>
      </div>

      {status ? <p className="status-line">{status}</p> : null}

      {!post ? (
        <p className="status-line">Choose a published post to read comments and respond.</p>
      ) : (
        <>
          <article className="detail-card">
            <div className="meta-row">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>{post.author.email}</span>
            </div>
            <p className="detail-copy">{post.content}</p>
          </article>

          <div className="comments-block">
            <div className="section-head compact-head">
              <div>
                <p className="eyebrow">Discussion</p>
                <h3>{post.comments.length} comments</h3>
              </div>
            </div>

            <div className="comment-list">
              {post.comments.map((comment) => (
                <article className="comment-card" key={comment.id}>
                  <div className="meta-row">
                    <span>{comment.user?.email || 'Unknown user'}</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{comment.content}</p>
                </article>
              ))}
            </div>

            <CommentForm disabled={busy} onSubmit={onCommentSubmit} session={session} />
          </div>
        </>
      )}
    </section>
  )
}

export default PostDetails
