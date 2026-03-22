function PostComposer({ busy, form, onChange, onSubmit }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">New Post</p>
          <h2>Create a draft</h2>
        </div>
      </div>

      <form className="stack-form" onSubmit={onSubmit}>
        <label>
          Title
          <input
            type="text"
            value={form.title}
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="Weekly update"
            required
          />
        </label>

        <label>
          Content
          <textarea
            rows="6"
            value={form.content}
            onChange={(event) => onChange('content', event.target.value)}
            placeholder="Write the post body..."
            required
          />
        </label>

        <label className="inline-check">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(event) => onChange('published', event.target.checked)}
          />
          Publish immediately
        </label>

        <button type="submit" className="primary-button" disabled={busy}>
          {busy ? 'Creating...' : 'Create post'}
        </button>
      </form>
    </section>
  )
}

export default PostComposer
