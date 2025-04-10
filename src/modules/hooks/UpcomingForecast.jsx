import React from 'react';

const Upcoming = ({forecastData, onDaySelect, selectedDay}) => {
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
            const isSelected = selectedDay instanceof Date ? selectedDay : new Date(selectedDay);

            return (
            <div 
                key={day.date} 
                className={`forecast-day ${isSelected ? 'selected' : ""}`}
                onClick = {() => onDaySelect(new Date(day.date).toDateString())}
            >
                <h4 className="day-of-week">{dayOfWeek}</h4>
                <img className="upcoming_condition" src={day.day.condition.icon} />
                <p className="max-temp">{Math.trunc(day.day.maxtemp_c)}°C</p>
                <p className="min-temp">{Math.trunc(day.day.mintemp_c)}°C</p>
            </div>
            );
        })}
        </div>
    </div>
    );
};

export default Upcoming;