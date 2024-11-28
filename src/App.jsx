import { useState, useEffect, useMemo } from 'react';
import SearchBar from './modules/hooks/SearchBar';
import getWeather from './modules/weatherAPI/getWeather';
import Forecast from './modules/hooks/UpcomingDays';
import getForecast from './modules/weatherAPI/getForecast';
import useWeatherData from './modules/hooks/WeatherData';
import getLocationByIP from './modules/weatherAPI/getLocationByIP';

// Main App component
function App() {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const { weatherData, forecastData, error, handleSearch } = useWeatherData(apiKey);

  const formattedDateTime = useMemo(() => {
    if (!weatherData) return {time: '', date: ''}; 

    const localtime = weatherData.location.localtime;
    const time = new Date(localtime);

    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const dateOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    const formattedTime = time.toLocaleString('en-US', timeOptions).replace(/:\d{2}/, ':00');
    const formattedDate = time.toLocaleDateString('en-US', dateOptions);

    return {time: formattedTime, date: formattedDate};
  }, [weatherData]);

const {time: currentTime, date: currentDate} = formattedDateTime;

  return (
    <div className='header-section'>
      <h2>Weather Cat</h2>

      <SearchBar onSearch={handleSearch} />

      {error && <p>Error loading weather data: {error.message}</p>}

      {weatherData && (
        <div className='weather-body'>
          <div className='today-weather'>
            <h2>{
              weatherData.location.name}, {weatherData.location.country}
            </h2>
            <h3>{currentDate}</h3>
            <h3>{currentTime}</h3>
            <p>Temperature: {weatherData.current.temp_c}°C</p>
            <p>Weather: {weatherData.current.condition.text}</p>
            <p>Wind Speed: {weatherData.current.wind_kph}/kph</p>
            <p>Humidity: {weatherData.current.humidity}%</p>
          </div>

          {forecastData && <Forecast forecastData={forecastData} />}
          
        </div>
      )}
    </div>
  );
}

export default App;