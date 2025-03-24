import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

import { create } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const createAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    dispatch(create(content))
    e.target.anecdote.value = ''
    dispatch(setNotification(`you added '${content}'`))
    setTimeout(() => {
      dispatch(setNotification(``))
    }, 5000)
  }

  return (

    <>
      <h2>create new</h2>
      <form onSubmit={(e) => createAnecdote(e)}>
        <div><input name="anecdote" /></div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
