import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  const notification = useSelector(state => state.notification)

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [])

  return (
    <div>
      <h2>Anecdotes</h2>
      {notification && <Notification />}
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App