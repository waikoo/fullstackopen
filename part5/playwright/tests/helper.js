const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {

  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  const blogsContainer = page.getByTestId('bloglist')
  await blogsContainer.getByText(title).waitFor()
  await blogsContainer.getByText(author).waitFor()
  await page.getByRole('button', { name: 'cancel' }).click()
}

const likeOnce = async (page, title) => {

  const blogsContainer = page.getByTestId('bloglist')
  await blogsContainer.getByText(title).waitFor()
  const instance = () => blogsContainer.locator('div').filter({ hasText: title })
  await instance().getByRole('button', { name: 'view' }).click()
  await instance().getByRole('button', { name: 'like' }).waitFor()
  await instance().getByRole('button', { name: 'like' }).click()
  await instance().getByRole('button', { name: 'hide' }).waitFor()
  await instance().getByRole('button', { name: 'hide' }).click()
}

const like = async (page, title, times) => {

  const blogsContainer = page.getByTestId('bloglist')
  await blogsContainer.getByText(title).waitFor()
  const instance = () => blogsContainer.locator('div').filter({ hasText: title })
  await instance().getByRole('button', { name: 'view' }).click()

  for (let i = 0; i < times - 1; i++) {
    await instance().getByRole('button', { name: 'like' }).waitFor()
    await instance().getByRole('button', { name: 'like' }).click()
  }
  await instance().getByRole('button', { name: 'hide' }).waitFor({ state: 'visible' })
  await instance().getByRole('button', { name: 'hide' }).click()
}

export { loginWith, createBlog, likeOnce, like }

