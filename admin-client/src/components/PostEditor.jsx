function PostEditor({ busy, draft, onCancel, onChange, onSubmit }) {
  return (
    <form className="stack-form editor-form" onSubmit={onSubmit}>
      <label>
        Title
        <input
          type="text"
          value={draft.title}
          onChange={(event) => onChange('title', event.target.value)}
          required
        />
      </label>

      <label>
        Content
        <textarea
          rows="6"
          value={draft.content}
          onChange={(event) => onChange('content', event.target.value)}
          required
        />
      </label>

      <label className="inline-check">
        <input
          type="checkbox"
          checked={draft.published}
          onChange={(event) => onChange('published', event.target.checked)}
        />
        Published
      </label>

      <div className="action-row">
        <button type="submit" className="primary-button" disabled={busy}>
          {busy ? 'Saving...' : 'Save changes'}
        </button>
        <button type="button" className="ghost-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default PostEditor
