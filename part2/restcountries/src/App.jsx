import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'
import Weather from './components/Weather'

function App() {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setSelectedCountry(filteredCountries[0])
    } else {
      setSelectedCountry(null)
    }
  }, [filteredCountries])

  useEffect(() => {
    if (!selectedCountry?.latlng) return

    const openWeatherApiKey = import.meta.env.VITE_OPEN_WEATHER
    const [lat, lon] = selectedCountry.latlng
    const openWeatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`

    axios.get(openWeatherUrl)
      .then(response => setWeather(response.data))
      .catch(error => console.log(error))
  }, [selectedCountry])

  const showSingleCountry = (country) => {
    setQuery(country.name.common)
    setSelectedCountry(country)
  }

  return (
    <div>
      <p>find countries <input value={query} onChange={(e) => setQuery(e.target.value)} /></p>
      <p>{filteredCountries.length > 10 ? 'Too many matches, specify another filter' : null}</p>

      <div>
        {filteredCountries.length > 1 && filteredCountries.length < 10 ? (
          filteredCountries.map((country) => (
            <div key={country.name.common}>
              {country.name.common}
              <button onClick={() => showSingleCountry(country)}>Show</button>
            </div>
          ))
        ) : null}
      </div>

      {selectedCountry && (
        <Country
          name={selectedCountry.name.common}
          capital={selectedCountry.capital?.[0]}
          area={selectedCountry.area}
          languages={selectedCountry.languages}
          flagSrc={selectedCountry.flags}
        />
      )}

      {weather && selectedCountry && (
        <Weather
          capital={selectedCountry.capital?.[0]}
          temperature={weather.current?.temp}
          wind={weather.current?.wind_speed}
          iconSrc={`http://openweathermap.org/img/wn/${weather.current?.weather?.[0]?.icon}@2x.png`}
          iconAlt={weather.current?.weather?.[0]?.description}
        />
      )}
    </div>
  )
}

export default App

