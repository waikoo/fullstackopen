import { useState } from 'react'

const Blog = ({ blog, incrementLike, handleRemove, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    border: '1px solid black',
    padding: '10px',
    margin: '10px 0'
  }

  return (
    <div style={blogStyle} data-testid="blog">
      <span data-testid="title">{blog.title}</span> <span>{blog.author}</span>
      {showDetails && (
        <>
          <p>{blog.url}</p>
          <p><span data-testid="likes-value">{blog.likes}</span> <button data-testid="likebutton" onClick={() => incrementLike(blog)}>like</button></p>
          <p>{blog.user?.name}</p>
          {blog.user === user.id && <button onClick={() => handleRemove(blog)}>remove</button>}
        </>
      )}
      <button onClick={() => setShowDetails(!showDetails)}>{!showDetails ? 'view' : 'hide'}</button>
    </div>
  )
}

export default Blog