const Filter = ({ setQuery }) => {

  return (
    <p>filter shown with <input onChange={e => setQuery(e.target.value)} /></p>
  )
}

export default Filter
