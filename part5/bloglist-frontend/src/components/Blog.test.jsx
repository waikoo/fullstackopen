import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  beforeEach(() => {
    const myBlog = {
      title: 'title',
      author: 'author',
      url: 'www.url.com',
      likes: 3
    }

    const incrementLike = vi.fn()
    render(<Blog blog={myBlog} incrementLike={incrementLike} />)
  })

  test('title and author are rendered, URL and likes are not', () => {
    const titleElement = screen.getByText('title')
    const authorElement = screen.getByText('author')
    const urlElement = screen.queryByText('www.url.com')
    const likesElement = screen.queryByText('3')

    expect(titleElement).toBeInTheDocument()
    expect(authorElement).toBeInTheDocument()
    expect(urlElement).not.toBeInTheDocument()
    expect(likesElement).not.toBeInTheDocument()
  })

  test('URL and likes are shown when the view button is clicked', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlElement = screen.getByText('www.url.com')
    const likesElement = screen.getByText('3')

    expect(urlElement).toHaveTextContent('www.url.com')
    expect(likesElement).toHaveTextContent('3')
  })

})

test('if the like button is clicked twice, the event handler is called twice', async () => {
  const myBlog = {
    title: 'title',
    author: 'author',
    url: 'www.url.com',
    likes: 3
  }
  const incrementLike = vi.fn()
  render(<Blog blog={myBlog} incrementLike={incrementLike} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(incrementLike.mock.calls).toHaveLength(2)
})

