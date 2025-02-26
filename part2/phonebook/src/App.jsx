import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState({ text: null, type: null })

  useEffect(() => {
    document.title = 'persons'
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const filteredPersons = persons.filter(person => person?.name?.toLowerCase().includes(query.toLowerCase()))

  const handleOnChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberOnChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (persons.find(obj => obj.name === newName)) {
      if (
        confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      ) {
        const person = persons.find(person => person.name === newName)
        const updatedNumber = { ...person, number: newNumber }

        personsService
          .update(person.id, updatedNumber).then(updatedPerson => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(err => {
            setMessage({ text: `Information of ${updatedNumber.name} has already been removed from server`, type: 'error' })
            setTimeout(() => setMessage({ text: null, type: null }), 5000)
          })

        return
      }
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    personsService
      .create(newPerson)
      .then(returnedPerson => {
        setMessage({ text: `Added ${returnedPerson.name}`, type: 'success' })
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setTimeout(() => setMessage({ text: null, type: null }), 5000)
      }).catch(err => {
        console.log(err)
      })
  }

  const removePerson = (id) => {
    const matchingPerson = persons.find(person => person.id === id)
    if (confirm(`Delete ${matchingPerson.name}?`))
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.text} type={message.type} />
      <Filter setQuery={setQuery} />
      <h3>Add a new</h3>
      <PersonForm handleOnChange={handleOnChange} handleNumberOnChange={handleNumberOnChange} handleSubmit={handleSubmit} newName={newName} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} removePerson={removePerson} />
    </div>
  )
}

export default App
