const Weather = ({ capital, temperature, wind, iconSrc, iconAlt }) => {

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {temperature} Celsius</p>
      <img src={iconSrc} alt={iconAlt} />
      <p>Wind: {wind} m/s</p>
    </div>
  )
}

export default Weather
