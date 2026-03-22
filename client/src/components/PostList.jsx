function PostList({ onRefresh, onSelect, posts, selectedPostId, status }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Published Feed</p>
          <h2>Posts</h2>
        </div>
        <button type="button" className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {status ? <p className="status-line">{status}</p> : null}

      <div className="card-grid">
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            className={`post-card action-card ${selectedPostId === post.id ? 'selected-card' : ''}`}
            onClick={() => onSelect(post.id)}
          >
            <div className="meta-row">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>{post._count.comments} comments</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <footer>
              <span>{post.author.email}</span>
              <span className="pill live-pill">Published</span>
            </footer>
          </button>
        ))}
      </div>
    </section>
  )
}

export default PostList
