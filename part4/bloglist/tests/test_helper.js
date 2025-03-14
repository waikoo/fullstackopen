const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Title 1',
    author: 'Author 1',
    url: 'http://url1.com',
    likes: 1
  },
  {
    title: 'Title 2',
    author: 'Author 2',
    url: 'http://url2.com',
    likes: 2
  },
  {
    title: 'Title 3',
    author: 'Author 3',
    url: 'http://url3.com',
    likes: 3
  },
  {
    title: 'Title 4',
    author: 'Author 4',
    url: 'http://url4.com',
    likes: 4
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}
