import React from 'react';

const Forecast = ({forecastData}) => {
    if(!forecastData) return null;

    const getDayOfWeek = (date) => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayIndex = new Date(date).getDay();
        return daysOfWeek[dayIndex];
    }; 

    //exclude "today"
    const upcomingForecast = forecastData.forecast.forecastday.slice(1);

    return (
    <div className="upcoming-weather">
        <div className="forecast-container">
        {upcomingForecast.map((day) => {
            const dayOfWeek = getDayOfWeek(day.date);
            return (
            <div key={day.date} className="forecast-day">
                <h4 className="day-of-week">{dayOfWeek}</h4>
                <p className="condition">{day.day.condition.text}</p>
                <p className="max-temp">{Math.trunc(day.day.maxtemp_c)}°C</p>
                <p className="min-temp">{Math.trunc(day.day.mintemp_c)}°C</p>
            </div>
            );
        })}
        </div>
    </div>
    );
};

export default Forecast;