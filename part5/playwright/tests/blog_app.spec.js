const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, like } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        username: 'barney',
        name: 'Barney Rubble',
        password: 'bambam'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()

    await expect(page.getByTestId('login-form')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'barney', 'bambam')
      await expect(page.getByText('Barney Rubble logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'barney', 'wrong_password')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'barney', 'bambam')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'newtitle2', 'newauthor2', 'www.newurl2.com')
      const blogsContainer = page.getByTestId('bloglist')
      await expect(blogsContainer.getByText('newtitle')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'newtitle3', 'newauthor3', 'www.newurl3.com')
      await page.getByRole('button', { name: 'view' }).click()
      const initialLikes = Number(await page.getByTestId('likes-value').textContent())
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByTestId('likes-value')).toHaveText(String(initialLikes + 1))
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await createBlog(page, 'newtitle4', 'newauthor4', 'www.newurl4.com')

      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('remove blog newtitle4 by newauthor4')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      const blogsContainer = page.getByTestId('bloglist')
      await expect(blogsContainer.getByText('newtitle4')).not.toBeVisible()
    })

    test('user who added the blog sees the blog\'s delete button', async ({ page }) => {
      await createBlog(page, 'newtitle5', 'newauthor5', 'www.newurl5.com')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('blogs are arranged in the order of most likes on top', async ({ page }) => {
      await createBlog(page, 'newtitle6', 'newauthor6', 'www.newurl6.com')
      await createBlog(page, 'newtitle7', 'newauthor7', 'www.newurl7.com')
      await createBlog(page, 'newtitle8', 'newauthor8', 'www.newurl8.com')

      await expect(page.getByTestId('blog')).toHaveCount(3)

      // 8 liked 1
      await page.getByRole('button', { name: 'view' }).last().click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'hide' }).click()

      // 7 liked 2
      await page.getByRole('button', { name: 'view' }).last().click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'hide' }).click()

      // 6 liked 3
      await page.getByRole('button', { name: 'view' }).last().click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'hide' }).click()

      await expect(page.getByTestId('title').nth(0)).toHaveText('newtitle6')
      await expect(page.getByTestId('title').nth(1)).toHaveText('newtitle7')
      await expect(page.getByTestId('title').nth(2)).toHaveText('newtitle8')
    })
  })
})
