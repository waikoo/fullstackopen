import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('NewBlogForm calls the event handler upon new blog creation with right data', async () => {
  const setFeedbackMessage = vi.fn()
  const createBlog = vi.fn()
  render(<NewBlogForm createBlog={createBlog} setFeedbackMessage={setFeedbackMessage} />)

  const title = screen.getByPlaceholderText('title')
  const author = screen.getByPlaceholderText('author')
  const url = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await userEvent.type(title, 'title')
  await userEvent.type(author, 'author')
  await userEvent.type(url, 'www.url.com')
  await userEvent.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(
    {
      title: 'title',
      author: 'author',
      url: 'www.url.com'
    }
  )
})

