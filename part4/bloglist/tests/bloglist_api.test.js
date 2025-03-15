const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
let token
let withAuth


beforeEach(async () => {
  await Blog.deleteMany({})

  const username = 'barney'
  const password = 'bambam'

  await api
    .post('/api/users')
    .send({ username, password })

  const response = await api
    .post('/api/login')
    .send({ username, password })

  token = response.body.token
  withAuth = supertest.agent(app).set('Authorization', `Bearer ${response.body.token}`)

  await Promise.all(helper.initialBlogs.map(async (blog) => {
    let blogObject = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: jwt.decode(token).id
    })
    return blogObject.save()
  }))

})

test('returns the correct amount of blog posts in JSON format', async () => {
  const response = await withAuth
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier is named "id"', async () => {
  const response = await withAuth
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert(response.body.length > 0)
  assert(Object.hasOwn(response.body[0], 'id'))
})

test('POST request creates blog post in db', async () => {
  const initialLength = helper.initialBlogs.length

  const newBlog = {
    title: 'Star Wars',
    author: 'Anakin Skywalker',
    url: 'https://www.star-wars.com',
    likes: 99
  }

  await withAuth
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await withAuth.get('/api/blogs')
  const contents = response.body.map(blog => blog.url)
  assert.strictEqual(response.body.length, initialLength + 1)
  assert(contents.includes('https://www.star-wars.com'))
})

test('if the likes property is missing, it defaults to 0', async () => {
  const noLikePropBlog = {
    title: 'Scrappy Dappy Doo',
    author: 'Where are you?',
    url: 'https://www.we-got-some-work-todo-now2.com',
  }

  await withAuth
    .post('/api/blogs')
    .send(noLikePropBlog)

  const response = await withAuth.get('/api/blogs')
  const lastBlog = response.body.at(-1)
  assert(lastBlog.likes === 0)
})

test('if title property is missing, the backend responds with 400', async () => {
  const noTitleBlog = {
    author: 'BonJovi',
    url: 'https://www.hip-hop.com',
    likes: '11'
  }

  const response = await withAuth
    .post('/api/blogs')
    .send(noTitleBlog)
    .expect(400)

  assert.strictEqual(response.status, 400)
})

test('if url property is missing, the backend responds with 400', async () => {
  const noUrlBlog = {
    title: 'If I was a rich girl',
    author: 'BonJovi',
    likes: '11'
  }

  const response = await withAuth
    .post('/api/blogs')
    .send(noUrlBlog)
    .expect(400)

  assert.strictEqual(response.status, 400)
})

test('on a delete request with an id, there is one less blog in db', async () => {
  const response = await withAuth
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const initialLength = response.body.length
  const firstBlogId = response.body[0].id

  await withAuth
    .delete(`/api/blogs/${firstBlogId}`)
    .expect(204)

  const responseAfterDeletion = await withAuth
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(responseAfterDeletion.body.length, initialLength - 1)
})

test('on a put request with an id, the blog is updated', async () => {
  const response = await withAuth
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const firstBlogId = response.body[0].id

  const newBlog = {
    title: 'PutPut',
    author: 'PutPutTheCar',
    url: 'https://www.putput.com',
    likes: 2
  }

  await withAuth
    .put(`/api/blogs/${firstBlogId}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const responseAfterUpdate = await withAuth
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(responseAfterUpdate.body[0].title, 'PutPut')
  assert.strictEqual(responseAfterUpdate.body[0].author, 'PutPutTheCar')
  assert.strictEqual(responseAfterUpdate.body[0].url, 'https://www.putput.com')
  assert.strictEqual(responseAfterUpdate.body[0].likes, 2)
})

test.only('adding a blog fails if not signed in, with a 401', async () => {
  const newBlog = {
    title: 'Tom & Jerry',
    author: 'Idont Know',
    url: 'https://www.tomandjerry.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

})

after(async () => {
  console.log('Closing resources...')
  await mongoose.connection.close()
  console.log('MongoDB connection closed')
})
