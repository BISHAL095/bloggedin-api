function AuthPanel({
  authForm,
  authMode,
  authStatus,
  busy,
  onChange,
  onLogout,
  onModeChange,
  onSubmit,
  session,
}) {
  return (
    <section className="panel auth-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Account</p>
          <h2>{session ? 'Reader session' : 'Login or register'}</h2>
        </div>
        {session ? (
          <button type="button" className="ghost-button" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>

      {session ? (
        <div className="session-card">
          <p className="status-line">Signed in as {session.role}</p>
          <p>{session.userId ? 'You can now comment on published posts.' : 'Session is active.'}</p>
        </div>
      ) : (
        <form className="stack-form" onSubmit={onSubmit}>
          <div className="mode-switch">
            <button
              type="button"
              className={authMode === 'login' ? 'active-chip' : 'ghost-chip'}
              onClick={() => onModeChange('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'active-chip' : 'ghost-chip'}
              onClick={() => onModeChange('register')}
            >
              Register
            </button>
          </div>

          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(event) => onChange('email', event.target.value)}
              placeholder="reader@bloggedin.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(event) => onChange('password', event.target.value)}
              placeholder="password123"
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={busy}>
            {busy ? 'Working...' : authMode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      )}

      {authStatus ? <p className="status-line">{authStatus}</p> : null}
    </section>
  )
}

export default AuthPanel
