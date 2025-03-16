import { useState } from 'react'
import blogService from '../services/blogs'

const NewBlogForm = ({ setFeedbackMessage }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const postNewBlog = async (e) => {
    e.preventDefault()
    try {
      setTitle('')
      setAuthor('')
      setUrl('')
      await blogService.create({ title, author, url })
      setFeedbackMessage({ type: 'success', message: `the blog ${title} by ${author} successfully added` })
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
      <form>
        <div>title: <input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div>author: <input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div>url: <input value={url} onChange={(e) => setUrl(e.target.value)} /></div>
        <button onClick={postNewBlog}>create</button>
      </form>
    </>
  )
}

export default NewBlogForm
