function AdminHero() {
  return (
    <section className="hero-banner">
      <div className="hero-copy">
        <p className="eyebrow">Admin Client</p>
        <h1>Write, edit, publish, and moderate without touching the public site.</h1>
        <p className="hero-text">
          This app is the protected authoring surface for BloggedIn. Only admins should log in here,
          and every action routes through the JWT-protected API.
        </p>
      </div>
      <div className="hero-metrics">
        <span>Control room</span>
        <strong>Drafts</strong>
        <strong>Publishing</strong>
        <strong>Comment moderation</strong>
      </div>
    </section>
  )
}

export default AdminHero
