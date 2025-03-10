const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ? 0 : blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const result = blogs
    .toSorted((a, b) => a.likes - b.likes)
    .at(-1)

  delete result.__v
  delete result.url
  delete result._id

  return result
}

const mostBlogs = (blogs) => {
  const ommitted = blogs.map(blog => {
    return _.omit(blog, ['_id', 'title', 'url', '__v', 'likes'])
  })
  const countBy = _.countBy(ommitted, 'author')
  const maxValue = _.max(Object.values(countBy))

  const result = {}
  Object.entries(countBy)
    .forEach(([key, value]) => {
      if (value === maxValue) {
        result.author = key,
          result.blogs = value
      }
    })

  return result
}

const mostLikes = (blogs) => {
  const ommitted = blogs.map(blog => {
    return _.omit(blog, ['_id', 'title', 'url', '__v'])
  })

  const counter = {}

  ommitted.forEach(blog => {
    if (!counter[blog.author]) {
      counter[blog.author] = blog.likes
    } else {
      counter[blog.author] += blog.likes
    }
  })

  const maxValue = _.max(Object.values(counter))

  const result = {}
  Object.entries(counter)
    .forEach(([key, value]) => {
      if (value === maxValue) {
        result.author = key,
          result.likes = value
      }
    })

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
