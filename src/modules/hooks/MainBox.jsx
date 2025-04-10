import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from './SearchBar';
import useWeatherData from './useWeatherData';
import Upcoming from './UpcomingForecast';
import HourlySlider from './HourlySlider';
import { isSameHourBlock } from '../utils/timeGrem';
import useFetchCatMascot from './useFetchCatMascot';

function MainBox() {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const { weatherData, forecastData, setQuery, error, handleSearch } = useWeatherData(apiKey);

    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedDay, setSelectedDay] = useState(new Date()); 
    const [mascotImage, setMascotImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [combinedHourlyData, setCombinedHourlyData] = useState([]);

    // flatten hourly data from all forecast days
    useEffect(() => {
        if (forecastData?.forecast?.forecastday) {
            const combined = forecastData.forecast.forecastday.flatMap(day =>
                day.hour.map(hour => ({
                    ...hour,
                    timeObj: new Date(hour.time),
                    hourString: new Date(hour.time).toLocaleTimeString([], {
                        hour: 'numeric',
                        hour12: true
                    })
                }))
            );
            setCombinedHourlyData(combined);
        }
    }, [forecastData, weatherData]);

    // const combinedHourlyData = useMemo(() => {
    //     if (!forecastData?.forecast?.forecastday) return [];

    //     return forecastData.forecast.forecastday.flatMap(day =>
    //         day.hour.map(hour => ({
    //             ...hour,
    //             timeObj: new Date(hour.time),
    //             hourString: new Date(hour.time).toLocaleTimeString([], {
    //                 hour:"numeric",
    //                 hour12: true
    //             })
    //         }))
    //     );
    // },[weatherData, forecastData, isLoading]);

    // on forecast load, select nearest future hour
    useEffect(() => {
        if (combinedHourlyData.length > 0 && weatherData?.location?.localtime) {
            const now = new Date(weatherData.location.localtime);

            const currentHour = combinedHourlyData.find(h => 
                isSameHourBlock (h.timeObj, now)
            );

            setSelectedHour(currentHour || combinedHourlyData.find(h => h.timeObj > now));
            }
        }, [combinedHourlyData, weatherData]);
        
        // change display data according to hour clicked on slider
        const handleSelectHour = (hour) => {
            setSelectedHour(hour);
        };

    // Get weather condition for selected hour for Mascot change
    // const weatherConditionCode = useMemo(() => {
    //     const selectedHour = hourlyData?.find(
    //         hour => new Date(hour.time).getHours() === selectedHour
    //     );
    //     return selectedHour?.condition?.code;
    // }, [hourlyData, selectedHour]);

    // Use the custom hook here to fetch the mascot image
    // const mascotImageUrl = useFetchCatMascot(weatherConditionCode);

    // useEffect(() => {
    //     if (mascotImageUrl) {
    //         setMascotImage(mascotImageUrl);
    //     }
    // }, [mascotImageUrl]);

    // Update the day and time at midnight
    useEffect(() => {
        let timeoutId;
        const updateDayAtMidnight = () => {
            const now = new Date();
            const msUntilMidnight = new Date(now.setHours(23, 59, 59, 999)) - now;
            setSelectedDay(new Date());
            timeoutId = setTimeout(updateDayAtMidnight, msUntilMidnight);
        };
        updateDayAtMidnight();
        return () => clearTimeout(timeoutId);
    }, []);

    // Handle search functionality
    const handleSearchWrapper = async (query) => {
        setIsLoading(true);
        setQuery(query);
        setSelectedHour(null);  // Reset selected hour after search
        setSelectedDay(new Date());  // Reset to today after search
        setIsLoading(false);

        console.log("is combined changed", combinedHourlyData);
        console.log('selectedHour', selectedHour);
        console.log("whats in query", query);
    };

    return (
        <div className='header-section'>
            <h2>Weather Cat</h2>
    
            <SearchBar onSearch={handleSearchWrapper} />    
            
            {error && (
                <p className="error-message">
                    Error fetching location: {error.message}
                </p>
            )}
    
            {weatherData?.location && !isLoading && (
                <div className='weather-body'>
                    {mascotImage && <img className='weather-mascot' src={mascotImage} alt="Weather mascot"/>}
                    <div className='today-weather'>
                        <h2>
                            {weatherData.location.name ? 
                                `${weatherData.location.name}, ${weatherData.location.country}` 
                                : 'Location Not Available'}
                        </h2>              
                        <h3>{selectedHour 
                            ? new Date(selectedHour.time).toLocaleDateString('en-US', 
                                { day: '2-digit', month: 'long', year: 'numeric' }) 
                            : weatherData?.current?.currentDate}
                        </h3>
                        <h3>{selectedHour 
                            ? new Date(selectedHour.time).toLocaleTimeString('en-US', 
                                { hour: '2-digit', minute: '2-digit', hour12: true }).replace(/:\d{2}/, ':00') 
                            : weatherData?.current?.currentTime}
                        </h3>

                        <p>Temperature: {selectedHour?.temp_c ?? weatherData?.current?.temperature}°C</p>
                        <p>Weather Condition: {selectedHour?.condition?.text ?? weatherData?.current?.condition.text}</p>
                        <p>Wind Speed: {selectedHour?.wind_kph ?? weatherData?.current?.windSpeed} /kph</p>
                        <p>Humidity: {selectedHour?.humidity ?? weatherData?.current?.humidity}%</p>
                    </div>
                    
                    {forecastData && (
                        <Upcoming 
                            forecastData={forecastData}
                            onDaySelect={(day) => setSelectedDay(new Date(day))}
                            selectedDay={selectedDay}
                        />
                    )}

                    <HourlySlider  
                        hourlyData={combinedHourlyData} 
                        onHourSelect={handleSelectHour} 
                        weatherData={weatherData}
                    />
                </div>
            )}
            {isLoading && <p>Loading...</p>}
        </div>
    );
}

export default MainBox;
