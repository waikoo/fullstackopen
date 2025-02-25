const Persons = ({ filteredPersons }) => {

  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.name}>
          <p>{person.name} {person.number}</p>
        </div>
      ))}
    </div>
  )
}

export default Persons
