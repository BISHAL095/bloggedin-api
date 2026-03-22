import { useEffect, useState } from 'react'
import './App.css'
import AdminHero from './components/AdminHero'
import CommentModerationList from './components/CommentModerationList'
import LoginPanel from './components/LoginPanel'
import PostComposer from './components/PostComposer'
import PostEditor from './components/PostEditor'
import PostList from './components/PostList'
import {
  createPost,
  deleteComment,
  deletePost,
  fetchAdminPosts,
  loginAdmin,
  updatePost,
} from './lib/api'
import { clearToken, decodeToken, getStoredToken, storeToken } from './lib/auth'

const emptyPostForm = {
  title: '',
  content: '',
  published: false,
}

const getCurrentPath = () => window.location.pathname || '/login'

const matchEditRoute = (path) => path.match(/^\/posts\/([^/]+)\/edit$/)

const getRoute = (path) => {
  if (path === '/' || path === '/login') {
    return { name: 'login' }
  }

  if (path === '/posts') {
    return { name: 'posts' }
  }

  if (path === '/posts/new') {
    return { name: 'new-post' }
  }

  const editMatch = matchEditRoute(path)

  if (editMatch) {
    return { name: 'edit-post', postId: editMatch[1] }
  }

  return { name: 'not-found' }
}

function App() {
  const [path, setPath] = useState(() => getCurrentPath())
  const [token, setToken] = useState(() => getStoredToken())
  const [session, setSession] = useState(() => decodeToken(getStoredToken()))
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [composeForm, setComposeForm] = useState(emptyPostForm)
  const [posts, setPosts] = useState([])
  const [editDraft, setEditDraft] = useState(emptyPostForm)
  const [loginStatus, setLoginStatus] = useState('')
  const [adminStatus, setAdminStatus] = useState('Admin login required.')
  const [busyAction, setBusyAction] = useState('')

  const route = getRoute(path)
  const isAdmin = session?.role === 'ADMIN'
  const activePost = route.name === 'edit-post' ? posts.find((post) => post.id === route.postId) : null

  const navigate = (nextPath) => {
    if (nextPath === window.location.pathname) {
      setPath(nextPath)
      return
    }

    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  const loadPosts = async (currentToken = token) => {
    if (!currentToken) {
      setPosts([])
      setAdminStatus('Admin login required.')
      return
    }

    setAdminStatus('Loading posts...')

    try {
      const data = await fetchAdminPosts(currentToken)
      setPosts(data)
      setAdminStatus(data.length ? '' : 'No posts created yet.')
    } catch (error) {
      setPosts([])
      setAdminStatus(error.message)
    }
  }

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
    if (token && isAdmin) {
      loadPosts(token)
      return
    }

    if (!token) {
      setPosts([])
      setAdminStatus('Admin login required.')
    } else {
      setPosts([])
      setAdminStatus('This account is authenticated but not an admin.')
    }
  }, [token, isAdmin])

  useEffect(() => {
    if (route.name === 'edit-post' && activePost) {
      setEditDraft({
        title: activePost.title,
        content: activePost.content,
        published: activePost.published,
      })
    }
  }, [route.name, route.postId, activePost])

  const handleLoginChange = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }))
  }

  const handleComposeChange = (field, value) => {
    setComposeForm((current) => ({ ...current, [field]: value }))
  }

  const handleEditChange = (field, value) => {
    setEditDraft((current) => ({ ...current, [field]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setBusyAction('login')
    setLoginStatus('Signing in...')

    try {
      const data = await loginAdmin(loginForm)
      storeToken(data.token)
      setToken(data.token)
      setLoginForm({ email: '', password: '' })
      setLoginStatus('Admin session active.')
      navigate('/posts')
    } catch (error) {
      setLoginStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  const handleLogout = () => {
    clearToken()
    setToken('')
    setPosts([])
    setEditDraft(emptyPostForm)
    setAdminStatus('Logged out.')
    setLoginStatus('')
    navigate('/login')
  }

  const handleCreatePost = async (event) => {
    event.preventDefault()
    setBusyAction('create')
    setAdminStatus('Creating post...')

    try {
      await createPost(token, composeForm)
      setComposeForm(emptyPostForm)
      await loadPosts()
      setAdminStatus('Post created.')
      navigate('/posts')
    } catch (error) {
      setAdminStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()

    if (route.name !== 'edit-post') {
      return
    }

    setBusyAction(`save:${route.postId}`)
    setAdminStatus('Saving post...')

    try {
      await updatePost(token, route.postId, editDraft)
      await loadPosts()
      setAdminStatus('Post updated.')
      navigate('/posts')
    } catch (error) {
      setAdminStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  const handleTogglePublished = async (post) => {
    setBusyAction(`toggle:${post.id}`)
    setAdminStatus(post.published ? 'Unpublishing post...' : 'Publishing post...')

    try {
      await updatePost(token, post.id, { published: !post.published })
      await loadPosts()
      setAdminStatus('Post status updated.')
    } catch (error) {
      setAdminStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  const handleDeletePost = async (postId) => {
    setBusyAction(`delete:${postId}`)
    setAdminStatus('Deleting post...')

    try {
      await deletePost(token, postId)
      await loadPosts()
      setAdminStatus('Post deleted.')

      if (route.name === 'edit-post' && route.postId === postId) {
        navigate('/posts')
      }
    } catch (error) {
      setAdminStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  const handleDeleteComment = async (commentId) => {
    setBusyAction(`comment:${commentId}`)
    setAdminStatus('Deleting comment...')

    try {
      await deleteComment(token, commentId)
      await loadPosts()
      setAdminStatus('Comment deleted.')
    } catch (error) {
      setAdminStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  return (
    <div className="page-shell">
      <AdminHero />

      <nav className="panel route-bar">
        <div>
          <p className="eyebrow">Navigation</p>
          <h2>Admin routes</h2>
        </div>
        <div className="route-actions">
          <button
            type="button"
            className={route.name === 'login' ? 'active-chip' : 'ghost-button'}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button
            type="button"
            className={route.name === 'posts' ? 'active-chip' : 'ghost-button'}
            onClick={() => navigate('/posts')}
          >
            Posts
          </button>
          <button
            type="button"
            className={route.name === 'new-post' ? 'active-chip' : 'ghost-button'}
            onClick={() => navigate('/posts/new')}
          >
            New post
          </button>
          {isAdmin ? (
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </nav>

      {route.name === 'login' ? (
        <main className="single-panel">
          <LoginPanel
            busy={busyAction === 'login'}
            form={loginForm}
            onChange={handleLoginChange}
            onLogout={handleLogout}
            onSubmit={handleLogin}
            session={session}
            status={loginStatus}
          />
        </main>
      ) : null}

      {route.name === 'posts' ? (
        <main className="single-panel">
          <PostList
            busyAction={busyAction}
            editDraft={emptyPostForm}
            editingId=""
            onDeleteComment={handleDeleteComment}
            onDeletePost={handleDeletePost}
            onEditChange={() => {}}
            onEditStart={(post) => navigate(`/posts/${post.id}/edit`)}
            onEditSubmit={() => {}}
            onRefresh={loadPosts}
            onTogglePublished={handleTogglePublished}
            onCancelEdit={() => {}}
            posts={posts}
            status={adminStatus}
          />
        </main>
      ) : null}

      {route.name === 'new-post' ? (
        <main className="single-panel">
          <PostComposer
            busy={busyAction === 'create'}
            form={composeForm}
            onChange={handleComposeChange}
            onSubmit={handleCreatePost}
          />
        </main>
      ) : null}

      {route.name === 'edit-post' ? (
        <main className="page-stack">
          <section className="panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Post editor</p>
                <h2>{activePost ? `Edit "${activePost.title}"` : 'Edit post'}</h2>
              </div>
              <div className="route-actions">
                <button type="button" className="ghost-button" onClick={() => navigate('/posts')}>
                  Back to posts
                </button>
                {activePost ? (
                  <button
                    type="button"
                    className="danger-button"
                    disabled={busyAction === `delete:${activePost.id}`}
                    onClick={() => handleDeletePost(activePost.id)}
                  >
                    {busyAction === `delete:${activePost.id}` ? 'Deleting...' : 'Delete post'}
                  </button>
                ) : null}
              </div>
            </div>

            {activePost ? (
              <PostEditor
                busy={busyAction === `save:${activePost.id}`}
                draft={editDraft}
                onCancel={() => navigate('/posts')}
                onChange={handleEditChange}
                onSubmit={handleEditSubmit}
              />
            ) : (
              <p className="status-line">{adminStatus || 'Post not found.'}</p>
            )}
          </section>

          {activePost ? (
            <section className="panel">
              <div className="section-head compact-head">
                <div>
                  <p className="eyebrow">Moderation</p>
                  <h2>Comments on this post</h2>
                </div>
              </div>
              <CommentModerationList
                busyId={busyAction.startsWith('comment:') ? busyAction.slice(8) : ''}
                comments={activePost.comments}
                onDelete={handleDeleteComment}
              />
            </section>
          ) : null}
        </main>
      ) : null}

      {route.name === 'not-found' ? (
        <main className="single-panel">
          <section className="panel">
            <p className="eyebrow">Not found</p>
            <h2>This admin page does not exist.</h2>
            <button type="button" className="primary-button" onClick={() => navigate('/login')}>
              Go to admin login
            </button>
          </section>
        </main>
      ) : null}
    </div>
  )
}

export default App
