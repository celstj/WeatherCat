import { useState, useEffect } from 'react';
import useLocationByIP from './useLocationbyIP';
import useForecastData from './useForecastData';
import useCurrentWeather from './useCurrentWeather';

const useWeatherData = (apiKey) => {
    const { location, error: locationError } = useLocationByIP();
    const [query, setQuery] = useState(location?.city || location?.region);
    const { weatherData, error: weatherError, setWeatherData} = useCurrentWeather(apiKey, query);
    const { forecastData, error: forecastError, setForecastData } = useForecastData(apiKey, query);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (location && isInitialLoad) {
            setIsInitialLoad(false);
            setQuery(location?.city || location?.region);
            console.log("check IP:", location,",",isInitialLoad );
        }
    }, [location, isInitialLoad]);

    const handleSearch = async (newQuery) => {
        try {

            setQuery(newQuery); //update query state

            const {weather, forecast} = await Promise.all([
                    useCurrentWeather(apiKey, newQuery), // Get weather data for query
                    useForecastData(apiKey, newQuery) // Get forecast data for query 
                ]);


            // Update the location based on the search query
            setWeatherData(prevData => ({
                ...prevData,
                current: weather.current,
            }));

            setForecastData(prevData => ({
                ...prevData,
                forecast: forecast.data,
            }));

        } catch (error) {
            console.error('Error fetching data for search:', errorGroup);
        }
    };

    const errorGroup = locationError || weatherError || forecastData;

    return {
        weatherData,
        setWeatherData,
        forecastData,
        setForecastData,
        location,
        errorGroup,
        handleSearch,
        setQuery,
        isInitialLoad
    };
};

export default useWeatherData;