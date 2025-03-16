import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = ({ username, password, setUsername, setPassword, setUser, setFeedbackMessage }) => {
  const handleLogin = async e => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setFeedbackMessage({ type: 'error', message: 'wrong username or password' })
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>log in to application</h1>
      <form>
        <div>
          <label>
            username
            <input onChange={({ target }) => setUsername(target.value)} />
          </label>
        </div>

        <div><label>
          password
          <input onChange={({ target }) => setPassword(target.value)} />
        </label></div>
        <button onClick={(e) => handleLogin(e)}>login</button>
      </form>
    </div>
  )
}

export default LoginForm
