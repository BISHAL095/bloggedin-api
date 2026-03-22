import { useState } from 'react'

function CommentForm({ disabled, onSubmit, session }) {
  const [content, setContent] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const wasSubmitted = await onSubmit(content)

    if (wasSubmitted) {
      setContent('')
    }
  }

  if (!session) {
    return <p className="status-line">Login or register to comment.</p>
  }

  return (
    <form className="stack-form comment-form" onSubmit={handleSubmit}>
      <label>
        Add a comment
        <textarea
          rows="4"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share a thoughtful response..."
          required
        />
      </label>
      <button type="submit" className="primary-button" disabled={disabled}>
        {disabled ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  )
}

export default CommentForm
