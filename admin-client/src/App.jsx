import { useEffect, useState } from 'react'
import './App.css'
import AdminHero from './components/AdminHero'
import LoginPanel from './components/LoginPanel'
import PostComposer from './components/PostComposer'
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

function App() {
  const [token, setToken] = useState(() => getStoredToken())
  const [session, setSession] = useState(() => decodeToken(getStoredToken()))
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [composeForm, setComposeForm] = useState(emptyPostForm)
  const [posts, setPosts] = useState([])
  const [editingId, setEditingId] = useState('')
  const [editDraft, setEditDraft] = useState(emptyPostForm)
  const [loginStatus, setLoginStatus] = useState('')
  const [adminStatus, setAdminStatus] = useState('Admin login required.')
  const [busyAction, setBusyAction] = useState('')

  const isAdmin = session?.role === 'ADMIN'

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
    setEditingId('')
    setAdminStatus('Logged out.')
    setLoginStatus('')
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
    } catch (error) {
      setAdminStatus(error.message)
    } finally {
      setBusyAction('')
    }
  }

  const handleEditStart = (post) => {
    setEditingId(post.id)
    setEditDraft({
      title: post.title,
      content: post.content,
      published: post.published,
    })
  }

  const handleEditSubmit = async (event, postId) => {
    event.preventDefault()
    setBusyAction(`save:${postId}`)
    setAdminStatus('Saving post...')

    try {
      await updatePost(token, postId, editDraft)
      setEditingId('')
      setEditDraft(emptyPostForm)
      await loadPosts()
      setAdminStatus('Post updated.')
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
      <div className="layout-grid">
        <div className="sidebar-stack">
          <LoginPanel
            busy={busyAction === 'login'}
            form={loginForm}
            onChange={handleLoginChange}
            onLogout={handleLogout}
            onSubmit={handleLogin}
            session={session}
            status={loginStatus}
          />

          {isAdmin ? (
            <PostComposer
              busy={busyAction === 'create'}
              form={composeForm}
              onChange={handleComposeChange}
              onSubmit={handleCreatePost}
            />
          ) : null}
        </div>

        <PostList
          busyAction={busyAction}
          editDraft={editDraft}
          editingId={editingId}
          onDeleteComment={handleDeleteComment}
          onDeletePost={handleDeletePost}
          onEditChange={handleEditChange}
          onEditStart={handleEditStart}
          onEditSubmit={handleEditSubmit}
          onRefresh={loadPosts}
          onTogglePublished={handleTogglePublished}
          onCancelEdit={() => setEditingId('')}
          posts={posts}
          status={adminStatus}
        />
      </div>
    </div>
  )
}

export default App
