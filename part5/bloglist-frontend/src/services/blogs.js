import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const newBlogEntry = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user?.id
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, newBlogEntry, config)
  return response.data
}

const remove = async blogToRemoveId => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${blogToRemoveId}`, config)
  console.log(response)
}

export default { getAll, setToken, create, update, remove }