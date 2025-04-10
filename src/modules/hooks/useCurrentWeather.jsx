import { useState, useEffect } from 'react';

const useCurrentWeather = (apiKey, location) => {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (location) {
                try {
                    const response = await fetch(
                        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
                    );
                    const data = await response.json();
                    console.log("Weather Data: ", data);
                    setWeatherData(data);
                } catch (error) {
                    setError(error);
                }
            }
        };

        fetchWeather();
    }, [apiKey, location]);

    return { weatherData, error, setWeatherData };
};

export default useCurrentWeather;
