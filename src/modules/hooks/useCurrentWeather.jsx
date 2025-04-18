import { useState, useEffect } from 'react';

const useCurrentWeather = (apiKey, location) => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (location) {
                try {
                    const response = await fetch(
                        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
                    );
                    const data = await response.json();

                    console.log("Weather Data: ", data);

                    if (data.error) {
                        throw new Error(data.error.message);
                    }

                    setWeatherData(data);
                    setError(null);
                } catch (error) {
                    setError(error.message || 'Failed to fetch current weather data');
                }
            }
        };

        fetchWeather();
    }, [apiKey, location]);

    return { weatherData, error, setWeatherData };
};

export default useCurrentWeather;
