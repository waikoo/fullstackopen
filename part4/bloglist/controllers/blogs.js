const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const userFromToken = request.user
  if (!userFromToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(userFromToken.id)

  if (!request.body.likes) {
    request.body.likes = 0
  }

  if (!request.body.title) {
    return response.status(400).json({ error: 'missing title property' })
  }

  if (!request.body.url) {
    return response.status(400).json({ error: 'missing url property' })
  }

  if (!request.body.userId) {
    const allUsers = await User.find({})
    request.body.userId = allUsers[0]._id.toString()
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id,
  }
  )

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogToBeDeleted = await Blog.findById(request.params.id)
  const decodedUserFromToken = request.user

  const userIdFromBlogToBeDeleted = blogToBeDeleted.user.toString()
  const userIdFromToken = decodedUserFromToken.id.toString()

  if (userIdFromBlogToBeDeleted !== userIdFromToken) {
    return response.status(401).json({ error: 'token invalid' })
  }

  await Blog.findOneAndDelete(request.params.id)
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  return response.status(200).send(request.body)
})

module.exports = blogsRouter
