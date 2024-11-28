import { useState, useEffect } from 'react';
import getWeather from '../weatherAPI/getWeather';
import getLocationByIP from '../weatherAPI/getLocationByIP';
import getForecast from '../weatherAPI/getForecast';

const useWeatherData = (apiKey) => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const locationData = await getLocationByIP();
          if (locationData) {
            setLocation(locationData);
            console.log("IP-based location: " + locationData);
  
            const weather = await getWeather(apiKey, locationData); 
            setWeatherData(weather);
  
            const forecast = await getForecast(apiKey, locationData, 5); 
            setForecastData(forecast);
          } else {
            throw new Error('Unable to fetch location');
          }
        } catch (error) {
          console.error('Error fetching weather or location:', error);
          setError(error);
        }
      };
  
      fetchData();
    }, [apiKey]);
  

    const handleSearch = async (query) => {
      try {
        // Fetch current weather based on the searched location
        const weather = await getWeather(apiKey, query);
        setWeatherData(weather);  // Update current weather
  
        // Fetch the forecast based on the searched location
        const forecast = await getForecast(apiKey, query, 5);  // Get 5-day forecast
        setForecastData(forecast);  // Update forecast data
      } catch (error) {
        console.error('Error fetching data for search:', error);
        setError(error);
      }
    };

    return { weatherData, location, forecastData, error, handleSearch };
  };

  export default useWeatherData;