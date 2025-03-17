import { useState } from 'react'

const NewBlogForm = ({ setFeedbackMessage, createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const postNewBlog = async (e) => {
    e.preventDefault()
    try {
      setNewBlog({ title: '', author: '', url: '' })
      createBlog(newBlog)
      setFeedbackMessage({ type: 'success', message: `the blog ${newBlog.title} by ${newBlog.author} successfully added` })
    } catch (exception) {
      setFeedbackMessage({ type: 'error', message: exception.message })
    } finally {
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 5000)
    }
  }



  return (
    <>
      <h2>create new</h2>
      <form onSubmit={postNewBlog}>
        <div>title: <input value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="title" /></div>
        <div>author: <input value={newBlog.author} onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })} placeholder="author" /></div>
        <div>url: <input value={newBlog.url} onChange={(e) => setNewBlog({ ...newBlog, url: e.target.value })} placeholder="url" /></div>
        <button>create</button>
      </form>
    </>
  )
}

export default NewBlogForm
