const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.likes) {
    request.body.likes = 0
  }

  if (!request.body.title) {
    return response.status(400).json({ error: 'missing title property' })
  }

  if (!request.body.url) {
    return response.status(400).json({ error: 'missing url property' })
  }

  const blog = new Blog(request.body)

  const result = await blog.save()
  return response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findOneAndDelete(request.params.id)
  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  return response.status(200).send(request.body)
})

module.exports = blogsRouter
