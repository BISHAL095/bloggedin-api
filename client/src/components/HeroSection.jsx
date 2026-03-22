function HeroSection() {
  return (
    <section className="hero-banner">
      <div className="hero-copy">
        <p className="eyebrow">Public Reader</p>
        <h1>Read the latest published stories from BloggedIn.</h1>
        <p className="hero-text">
          This frontend is intentionally reader-first. Visitors can browse published posts, signed-in
          users can join the discussion, and authoring stays isolated in the admin app.
        </p>
      </div>
      <div className="hero-stat">
        <span>Frontend</span>
        <strong>Public site</strong>
        <p>Reader browsing, account auth, and comment posting.</p>
      </div>
    </section>
  )
}

export default HeroSection
