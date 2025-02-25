const PersonForm = ({ handleSubmit, handleOnChange, handleNumberOnChange, newName, newNumber }) => {

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input onChange={handleOnChange} value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberOnChange} value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
