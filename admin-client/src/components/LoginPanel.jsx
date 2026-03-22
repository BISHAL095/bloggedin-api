function LoginPanel({ busy, form, onChange, onLogout, onSubmit, session, status }) {
  return (
    <section className="panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Authentication</p>
          <h2>{session ? 'Admin session active' : 'Admin login'}</h2>
        </div>
        {session ? (
          <button type="button" className="ghost-button" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>

      {session ? (
        <div className="info-card">
          <p className="status-line">Logged in with role {session.role}.</p>
          <p>This dashboard can create, edit, publish, delete posts, and remove comments.</p>
        </div>
      ) : (
        <form className="stack-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => onChange('email', event.target.value)}
              placeholder="admin@bloggedin.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              placeholder="password123"
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={busy}>
            {busy ? 'Signing in...' : 'Login'}
          </button>
        </form>
      )}

      {status ? <p className="status-line">{status}</p> : null}
    </section>
  )
}

export default LoginPanel
