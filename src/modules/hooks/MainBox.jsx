import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from './SearchBar';
import useWeatherData from './useWeatherData';
import Upcoming from './UpcomingForecast';
import HourlySlider from './HourlySlider';

function MainBox() {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const { weatherData, forecastData, error, handleSearch } = useWeatherData(apiKey);

    const [selectedHour, setSelectedHour] = useState(null);

    const hourlyData = useMemo(() => {
        if (!forecastData || !forecastData.forecast || 
            !forecastData.forecast.forecastday || forecastData.length === 0) {   
            return [];
        }
        return forecastData.forecast.forecastday[0]?.hour || [];
    }, [forecastData]);

                // Log the weatherData structure
                // useEffect(() => {
                //     console.log("forecastData:", forecastData);
                // }, [forecastData]);

    const onHourSelect = (hour) => {
        setSelectedHour(hour);
    }

    const formattedSelectedHour = useMemo(() => {
        console.log("selected hour: ", selectedHour);
        
        if (!selectedHour) return null;

        const hourDate = new Date(selectedHour.time);
        const time = hourDate;

        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };

        const formattedTime = time.toLocaleString('en-US', timeOptions).replace(/:\d{2}/, ':00');
        const formattedDate = time.toLocaleDateString('en-US', dateOptions);

        return {
            time: formattedTime, 
            date: formattedDate,
            temp_c: selectedHour.temp_c,
            temp_f: selectedHour.temp_f,
            condition: selectedHour.condition.text,
            wind: selectedHour.wind_kph,
            humidity: selectedHour.humidity,
        };
    }, [selectedHour]);
    console.log("formattedSelectedHour:", formattedSelectedHour);


    const formattedDateTime = useMemo(() => {
        if (!weatherData) return {time: '', date: ''};

        const localtime = weatherData.location.localtime;
        const time = new Date(localtime);

        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

        const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };

        const formattedTime = time.toLocaleString('en-US', timeOptions).replace(/:\d{2}/, ':00');
        const formattedDate = time.toLocaleDateString('en-US', dateOptions);

        return { time: formattedTime, date: formattedDate };
    }, [weatherData]);

    const { time: currentTime, date: currentDate } = formattedDateTime;


    return (
        <div className='header-section'>
            <h2>Weather Cat</h2>
    
            <SearchBar onSearch={handleSearch} />
    
            {error && <p>Error loading weather data: {error.message}</p>}
    
            {weatherData && (
            <div className='weather-body'>
                <div className='today-weather'>
                <h2>
                    { weatherData.location.name ? `${weatherData.location.name},
                    ${weatherData.location.country}` : 'Location Not Available' }
                </h2>
                <h3>{ formattedSelectedHour?.date || currentDate }</h3>
                <h3>{formattedSelectedHour?.time || currentTime }</h3>
                <p>Temperature: {formattedSelectedHour?.temp_c || weatherData.current.temp_c}°C</p>
                <p>Weather: {formattedSelectedHour?.condition || weatherData.current.condition.text}</p>
                <p>Wind Speed: {formattedSelectedHour?.wind || weatherData.current.wind_kph}/kph</p>
                <p>Humidity: {formattedSelectedHour?.humidity || weatherData.current.humidity}%</p>
                </div>
                
                {forecastData && <Upcoming forecastData={forecastData} />}
                
                <HourlySlider hourlyData={hourlyData} onHourSelect={onHourSelect} />
            </div>
            )}
        </div>
    );
}

export default MainBox;