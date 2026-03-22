import { useEffect, useState } from 'react'
import './App.css'
import AuthPanel from './components/AuthPanel'
import HeroSection from './components/HeroSection'
import PostDetails from './components/PostDetails'
import PostList from './components/PostList'
import {
  createComment,
  fetchPostDetails,
  fetchPublishedPosts,
  loginUser,
  registerUser,
} from './lib/api'
import { clearToken, decodeToken, getStoredToken, storeToken } from './lib/auth'

const getCurrentPath = () => window.location.pathname || '/'

const matchPostRoute = (path) => path.match(/^\/posts\/([^/]+)$/)

const getRoute = (path) => {
  if (path === '/') {
    return { name: 'home' }
  }

  if (path === '/login') {
    return { name: 'login' }
  }

  const postMatch = matchPostRoute(path)

  if (postMatch) {
    return { name: 'post', postId: postMatch[1] }
  }

  return { name: 'not-found' }
}

function App() {
  const [path, setPath] = useState(() => getCurrentPath())
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [token, setToken] = useState(() => getStoredToken())
  const [session, setSession] = useState(() => decodeToken(getStoredToken()))
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [listStatus, setListStatus] = useState('Loading published posts...')
  const [detailStatus, setDetailStatus] = useState('Pick a post to read.')
  const [authStatus, setAuthStatus] = useState('')
  const [busyAction, setBusyAction] = useState('')

  const route = getRoute(path)

  const navigate = (nextPath) => {
    if (nextPath === window.location.pathname) {
      setPath(nextPath)
      return
    }

    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  const loadPosts = async () => {
    setListStatus('Refreshing published posts...')

    try {
      const data = await fetchPublishedPosts()
      setPosts(data)
      setListStatus(data.length ? '' : 'No published posts yet.')
    } catch (error) {
      setPosts([])
      setListStatus(error.message)
    }
  }

  const loadPostDetails = async (postId) => {
    if (!postId) {
      setSelectedPost(null)
      setDetailStatus('Pick a post to read.')
      return
    }

    setDetailStatus('Loading post...')

    try {
      const data = await fetchPostDetails(postId)
      setSelectedPost(data)
      setDetailStatus('')
    } catch (error) {
      setSelectedPost(null)
      setDetailStatus(error.message)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    const handlePopstate = () => {
      setPath(getCurrentPath())
    }

    window.addEventListener('popstate', handlePopstate)

    return () => window.removeEventListener('popstate', handlePopstate)
  }, [])

  useEffect(() => {
    setSession(token ? decodeToken(token) : null)
  }, [token])

  useEffect(() => {
    if (route.name === 'post') {
      loadPostDetails(route.postId)
      return
    }

    setSelectedPost(null)
    setDetailStatus('Pick a post to read.')
  }, [route.name, route.postId])

  const handleAuthChange = (field, value) => {
    setAuthForm((current) => ({ ...current, [field]: value }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setBusyAction('auth')
    setAuthStatus(authMode === 'login' ? 'Logging in...' : 'Creating account...')

    try {
      const data = authMode === 'login' ? await loginUser(authForm) : await registerUser(authForm)
      storeToken(data.token)
      setToken(data.token)
      setAuthForm({ email: '', password: '' })
      setAuthStatus(authMode === 'login' ? 'Logged in successfully.' : 'Account created and logged in.')
      navigate('/')
    } catch (error) {
      setAuthStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  const handleLogout = () => {
    clearToken()
    setToken('')
    setSession(null)
    setAuthStatus('Logged out.')
  }

  const handleCommentSubmit = async (content) => {
    if (route.name !== 'post') {
      return
    }

    setBusyAction('comment')
    setDetailStatus('Posting comment...')

    try {
      await createComment(token, { content, postId: route.postId })
      await Promise.all([loadPosts(), loadPostDetails(route.postId)])
      setDetailStatus('Comment posted.')
    } catch (error) {
      setDetailStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  return (
    <div className="page-shell">
      <HeroSection />

      <nav className="panel route-bar">
        <div>
          <p className="eyebrow">Navigation</p>
          <h2>Reader routes</h2>
        </div>
        <div className="route-actions">
          <button
            type="button"
            className={route.name === 'home' ? 'active-chip' : 'ghost-chip'}
            onClick={() => navigate('/')}
          >
            Published posts
          </button>
          <button
            type="button"
            className={route.name === 'login' ? 'active-chip' : 'ghost-chip'}
            onClick={() => navigate('/login')}
          >
            {session ? 'Account' : 'Login'}
          </button>
          {session ? (
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </nav>

      {route.name === 'home' ? (
        <main className="page-stack">
          <section className="panel page-intro">
            <div>
              <p className="eyebrow">Published feed</p>
              <h2>Browse live posts</h2>
            </div>
            <p className="hero-text">
              Open any story on its own page to read the full post and join the discussion.
            </p>
            {session ? (
              <p className="status-line">Signed in as {session.role}. You can comment on published posts.</p>
            ) : (
              <p className="status-line">Sign in from the account page if you want to comment.</p>
            )}
          </section>

          <PostList
            onRefresh={loadPosts}
            onSelect={(postId) => navigate(`/posts/${postId}`)}
            posts={posts}
            selectedPostId=""
            status={listStatus}
          />
        </main>
      ) : null}

      {route.name === 'login' ? (
        <main className="single-panel">
          <AuthPanel
            authForm={authForm}
            authMode={authMode}
            authStatus={authStatus}
            busy={busyAction === 'auth'}
            onChange={handleAuthChange}
            onLogout={handleLogout}
            onModeChange={setAuthMode}
            onSubmit={handleAuthSubmit}
            session={session}
          />
        </main>
      ) : null}

      {route.name === 'post' ? (
        <main className="content-grid detail-layout">
          <section className="panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Published feed</p>
                <h2>More stories</h2>
              </div>
              <button type="button" className="ghost-button" onClick={() => navigate('/')}>
                Back to list
              </button>
            </div>
            <PostList
              onRefresh={loadPosts}
              onSelect={(postId) => navigate(`/posts/${postId}`)}
              posts={posts}
              selectedPostId={route.postId}
              status={listStatus}
            />
          </section>

          <PostDetails
            busy={busyAction === 'comment'}
            onCommentSubmit={handleCommentSubmit}
            post={selectedPost}
            session={session}
            status={detailStatus}
          />
        </main>
      ) : null}

      {route.name === 'not-found' ? (
        <main className="single-panel">
          <section className="panel">
            <p className="eyebrow">Not found</p>
            <h2>This reader page does not exist.</h2>
            <button type="button" className="primary-button" onClick={() => navigate('/')}>
              Go to published posts
            </button>
          </section>
        </main>
      ) : null}
    </div>
  )
}

export default App
