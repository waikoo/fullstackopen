const Country = ({ name, capital, area, languages, flagSrc }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Capital {capital}</p>
      <p>Area {area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={flagSrc.png} alt={flagSrc.alt} />
    </div>
  )
}

export default Country
