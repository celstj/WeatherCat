import React, { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import SearchBar from './SearchBar';
import useWeatherData from './useWeatherData';
import Upcoming from './UpcomingForecast';
import HourlySlider from './HourlySlider';
import useFetchCatMascot from './useFetchCatMascot';

function MainBox() {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const { weatherData, forecastData, setQuery, error } = useWeatherData(apiKey);

    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedDay, setSelectedDay] = useState(DateTime.local().startOf('day')); 
    const [isLoading, setIsLoading] = useState(false);
    const [combinedHourlyData, setCombinedHourlyData] = useState([]);
    // const [mascotImage, setMascotImage] = useState(null);


     // Update selected hour when selectedDay changes
    const getFirstHourForSelectedDay = (hourlyData, day) => {
        const selectedDate = DateTime.isDateTime(day) ? day.startOf('day') : DateTime.fromISO(day).startOf('day');
    
        const forecastForDay = hourlyData.filter(hour => 
            hour.timeObj.hasSame(selectedDate, 'day')
        );
    
        if (!forecastForDay.length) return null;

        const now = DateTime.local().setZone(hourlyData[0]?.timeObj.zoneName);
        const futureHour = forecastForDay.find(hour => hour.timeObj > now);
    
        return futureHour || forecastForDay[0] || null;
    };
    

    // flatten hourly data from all forecast days
    useEffect(() => {
        if (forecastData?.forecast?.forecastday) {
            console.log("Forecast data is valid, combining hourly data...");
            const combined = forecastData.forecast.forecastday.flatMap(day =>
                day.hour.map(hour => ({
                    ...hour,
                    timeObj: DateTime.fromSQL(hour.time, { 
                        zone: forecastData.location?.tz_id || "UTC",
                    }),
                    hourString: DateTime.fromSQL(hour.time).toLocaleString(DateTime.TIME_SIMPLE)
                }))
            );
            setCombinedHourlyData(combined);
            console.log("Combined Hourly Data:", combined); // Log the combined data
        }
    }, [forecastData?.forecast?.forecastday]);


    // set default selected day/hour when data loads
    useEffect(() => {
        if (combinedHourlyData?.length > 0 && weatherData?.location?.localtime) {
            const localTimeZone = weatherData.location.timezone;

            // grab time from API and real current time in same timezone
            let localNowFromAPI = DateTime.fromISO(weatherData.location.localtime.replace(" ", "T")).startOf('hour');
            const realNow = DateTime.local().setZone(localTimeZone).startOf('hour');
            const localNow = realNow > localNowFromAPI ? realNow : localNowFromAPI;

            const matchingHour = combinedHourlyData.find(h => 
                h.timeObj.setZone(localTimeZone).hasSame(localNow, 'hour'));

            const newSelectedHour = matchingHour || combinedHourlyData.find(h => 
                h.timeObj.setZone(localTimeZone) >= localNow);

            // If a new selected hour is found, update both selectedHour and selectedDay
            if (newSelectedHour) {
                const newSelectedDay = newSelectedHour.timeObj.startOf('day');

                setSelectedDay(newSelectedDay);
                setSelectedHour(newSelectedHour);
            }
        }
    }, [weatherData, combinedHourlyData]);
    

    // Search handler
    const handleSearchWrapper = async (query) => {
        console.log("Search Query:", query);
        if (query.length > 0) {
            setIsLoading(true);
            await setQuery(query); 
            console.log("Weather Data after query:", weatherData);  // Debug log
            setIsLoading(false);
        }
    };

    // manual hour select (from slider)
    const handleSelectHour = (hour) => {
        setSelectedHour(hour);
    };

    // change selected day
    const handleDayChange = (day) => {
        const newDay = DateTime.fromJSDate(day);
        if (!newDay.hasSame(selectedDay, 'day')) {
            setSelectedDay(newDay);

            const hourForDay = getFirstHourForSelectedDay(combinedHourlyData, newDay);
            if (hourForDay) {
                setSelectedHour(hourForDay); 
            }
        }
    };
    
    // clicked Day forecast update
    const forecastForSelectedDay = forecastData?.forecast?.forecastday?.find(
        (day) => DateTime.fromISO(day.date).hasSame(selectedDay, 'day')
    );
    
    // Get the timezone from weatherData (fallback to "UTC" if not available)
    const locationTimezone = weatherData?.location?.tz_id || "UTC";

    const currentWeatherCode = selectedHour?.condition?.code ?? weatherData?.current?.condition?.code;

    // mascot images feedback
    const mascotUrl = useFetchCatMascot(currentWeatherCode);
    

    return (
        <div className='header-section'>
            <h2>Weather Cat</h2>
            <SearchBar onSearch={handleSearchWrapper} />    

            {/* Display error message without affecting the weather data */}
            {error && !weatherData?.location && (
                <p className="error-message">
                    Error fetching location: {error}
                </p>
            )}

            {!forecastForSelectedDay && !isLoading && !weatherData?.location &&(
            <div className="no-data-warning">😭 No forecast found for this day.</div>
            )}
            
            {weatherData?.location && !isLoading && forecastForSelectedDay ? (
                <div className='weather-body'>

                    {mascotUrl ? (
                        <img className='weather-mascot' src={mascotUrl} alt="Weather mascot"/>
                        ) : (
                            <p>Loading mascot...</p>
                        )
                    }
                    
                    <div className='today-weather'>
                        <h2>
                            {weatherData?.location?.name ? 
                                `${weatherData.location.name}, ${weatherData.location.country}` 
                                : 'Location Not Available'}
                        </h2>    
                        <h3>
                            {selectedHour?.timeObj.toLocaleString(DateTime.DATE_FULL)}
                        </h3>
                        <h3>
                            {selectedHour?.timeObj.toLocaleString(DateTime.TIME_SIMPLE)}
                        </h3>

                        <p>Temperature: {selectedHour?.temp_c ?? weatherData?.current?.temperature}°C</p>
                        <p>Weather Condition: {selectedHour?.condition?.text ?? weatherData?.current?.condition.text}</p>
                        <p>Wind Speed: {selectedHour?.wind_kph ?? weatherData?.current?.windSpeed} /kph</p>
                        <p>Humidity: {selectedHour?.humidity ?? weatherData?.current?.humidity}%</p>
                    </div>
                    
                    {forecastData?.forecast?.forecastday && forecastData?.forecast?.forecastday?.length > 0 ? (
                        <Upcoming 
                            forecastData={forecastData}
                            onDaySelect={handleDayChange}
                            selectedDay={selectedDay}
                        />
                    ) : (
                        <div className="no-data-warning">😭 No forecast found for this location.</div>
                    )}

                    <HourlySlider  
                        hourlyData={combinedHourlyData} 
                        onHourSelect={handleSelectHour} 
                        weatherData={weatherData}
                        selectedDay={selectedDay}
                        locationTimezone={locationTimezone}
                    />
                </div>
            ) : (
                // if weather data or selected hour isnt ready, show a loading message
                <div className='loading-state'>
                    {isLoading ? <p> Loading ... </p> : <p>Please wait, loading weather data...</p>}
                </div>
            )}
        </div>
    );
}

export default MainBox;
