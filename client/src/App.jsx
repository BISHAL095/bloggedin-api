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

function App() {
  const [posts, setPosts] = useState([])
  const [selectedPostId, setSelectedPostId] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [token, setToken] = useState(() => getStoredToken())
  const [session, setSession] = useState(() => decodeToken(getStoredToken()))
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [listStatus, setListStatus] = useState('Loading published posts...')
  const [detailStatus, setDetailStatus] = useState('Pick a post to read.')
  const [authStatus, setAuthStatus] = useState('')
  const [busyAction, setBusyAction] = useState('')

  const loadPosts = async () => {
    setListStatus('Refreshing published posts...')

    try {
      const data = await fetchPublishedPosts()
      setPosts(data)

      if (!data.length) {
        setSelectedPostId('')
        setSelectedPost(null)
        setListStatus('No published posts yet.')
        setDetailStatus('There is nothing live to read yet.')
        return
      }

      setSelectedPostId((current) => current || data[0].id)
      setListStatus('')
    } catch (error) {
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
    loadPostDetails(selectedPostId)
  }, [selectedPostId])

  useEffect(() => {
    setSession(token ? decodeToken(token) : null)
  }, [token])

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
    if (!selectedPostId) {
      return
    }

    setBusyAction('comment')
    setDetailStatus('Posting comment...')

    try {
      await createComment(token, { content, postId: selectedPostId })
      await Promise.all([loadPosts(), loadPostDetails(selectedPostId)])
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
      <div className="top-grid">
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
      </div>
      <main className="content-grid">
        <PostList
          onRefresh={loadPosts}
          onSelect={setSelectedPostId}
          posts={posts}
          selectedPostId={selectedPostId}
          status={listStatus}
        />
        <PostDetails
          busy={busyAction === 'comment'}
          onCommentSubmit={handleCommentSubmit}
          post={selectedPost}
          session={session}
          status={detailStatus}
        />
      </main>
    </div>
  )
}

export default App
