import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'

import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    dispatch(createAnecdote(content))
    e.target.anecdote.value = ''
    dispatch(showNotification(`you added '${content}'`, 5))
  }

  return (

    <>
      <h2>create new</h2>
      <form onSubmit={(e) => create(e)}>
        <div><input name="anecdote" /></div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
