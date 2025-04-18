import { useState, useEffect } from 'react';

const useForecastData = (apiKey, location, days = 5) => {
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForecast = async () => {
            if (location) {
                try {
                    const response = await fetch(
                        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}`
                    );
                    const data = await response.json();

                    console.log("Forecast Data: ", data);

                    if (data.error) {
                        throw new Error(data.error.message);

                    }
                    setForecastData(data);
                    setError(null);
                } catch (error) {
                    setError(error.message || "Failed to fetch forecast data");
                }
            }
        };

        fetchForecast();
    }, [apiKey, location, days]);

    return { forecastData,setForecastData, error };
};

export default useForecastData;
