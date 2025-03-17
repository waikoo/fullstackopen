import { useState } from 'react'

const Blog = ({ blog, incrementLike, handleRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    border: '1px solid black',
    padding: '10px',
    margin: '10px 0'
  }

  return (
    <div style={blogStyle}>
      <span>{blog.title}</span> <span>{blog.author}</span>
      {showDetails && (
        <>
          <p>{blog.url}</p>
          <p>{blog.likes} <button onClick={() => incrementLike(blog)}>like</button></p>
          <p>{blog.user?.name}</p>
          <button onClick={() => handleRemove(blog)}>remove</button>
        </>
      )}
      <button onClick={() => setShowDetails(!showDetails)}>{!showDetails ? 'view' : 'hide'}</button>
    </div>
  )
}

export default Blog