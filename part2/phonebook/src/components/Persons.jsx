const Persons = ({ filteredPersons, removePerson }) => {

  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.name}>
          <p>{person.name} {person.number}<button onClick={() => removePerson(person.id)}>delete</button></p>
        </div>
      ))}
    </div>
  )
}

export default Persons
