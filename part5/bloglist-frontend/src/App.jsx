import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import './styles/styles.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState({ type: null, message: null })

  const sortedBlogsByLikes = blogs.toSorted((a, b) => b.likes - a.likes)

  useEffect(() => {
    const getAllBlogs = async () => {
      setBlogs(await blogService.getAll())
    }
    getAllBlogs()
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const loginForm = () => {

    return (
      <Togglable buttonLabel="log in">
        <LoginForm username={username} password={password} setUsername={setUsername} setPassword={setPassword} setUser={setUser} setFeedbackMessage={setFeedbackMessage} />
      </Togglable>
    )
  }

  const newBlog = async (blogObject) => {
    try {
      const newestBlog = await blogService.create(blogObject)
      if (!newestBlog || !newestBlog.id) {
        throw new Error('no blog returned')
      }
      setBlogs(prevBlogs => [...prevBlogs, newestBlog])
    } catch (exception) {
      setFeedbackMessage({ type: 'error', message: exception.message })
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    }
  }

  const incrementLike = async (blog) => {
    try {
      const likedBlog = await blogService.update(blog)
      setBlogs(prevBlogs => prevBlogs.map(prevBlog => prevBlog.id === blog.id ? likedBlog : prevBlog))
    } catch (exception) {
      setFeedbackMessage({ type: 'error', message: exception.message })
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(prevBlogs => prevBlogs.filter(prevBlog => prevBlog.id !== blog.id))
      } catch (exception) {
        setFeedbackMessage({ type: 'error', message: exception.message })
        setTimeout(() => {
          setFeedbackMessage(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <Notification message={feedbackMessage} />
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogOut}>logout</button>

          <Togglable buttonLabel="new blog">
            <NewBlogForm setFeedbackMessage={setFeedbackMessage} createBlog={newBlog} />
          </Togglable>

          {sortedBlogsByLikes.map(blog =>
            <Blog key={blog.id} blog={blog} incrementLike={incrementLike} handleRemove={handleRemove} />
          )}
        </div>
      )}
    </div>
  )
}

export default App