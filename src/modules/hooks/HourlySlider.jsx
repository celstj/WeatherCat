import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { DateTime } from "luxon";

const HourlySlider = ({ hourlyData, onHourSelect, weatherData, selectedDay }) => {    
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [filteredHours, setFilteredHours] = useState([]);

    useEffect(() => {
        if (hourlyData && hourlyData.length > 0) {
            setIsDataLoaded(true);
        } else {
            setIsDataLoaded(false);
        }
    }, [hourlyData]);

    const now = DateTime.fromISO(weatherData?.location?.localtime);
    const currentHour = now.hour;

    useEffect(() => {
        // console.log('hourlyData:', hourlyData);
        console.log('selectedDay:', selectedDay.toString());

        if (hourlyData && selectedDay) {
            const selectedDate = DateTime.fromJSDate(new Date(selectedDay));
            const localNow = DateTime.local();
            const localTimeZone = localNow.zoneName;
            // console.log('selectedDate:', selectedDate.toString());
            // console.log("filteredHours before filter:", hourlyData);

            const filtered = hourlyData
            .map(hour => {
                const hourTime = DateTime.fromFormat(hour.time, "yyyy-MM-dd HH:mm", { zone: localTimeZone });
                return {
                    ...hour,
                    hourTime,
                    hourDate: hourTime.startOf('day')
                };
            })
            .filter(hour => {
                // Check if this hour belongs to the selected day
                return hour.hourDate.hasSame(selectedDate, 'day');
            })
            .filter(hour => {
                // Check if this hour is in the future
                return hour.hourTime > localNow;
            })
            .map(hour => ({
                ...hour,
                hourString: hour.hourTime.toLocaleString(DateTime.TIME_SIMPLE)
            }))
            .filter((_, index) => index % 3 === 0);  // Every 3rd hour only

        setFilteredHours(filtered);
        console.log('Filtered Hours:', filtered);

        if (filtered.length === 0) {
            console.warn("No matching hours found. Might be due to timezone mismatch or old data.");
        }
    }
}, [hourlyData, selectedDay]);  // Re-run this effect whenever hourlyData or selectedDay changes

    
    // useEffect(() => {
    //     console.log('Hourly Data:', hourlyData);
    //     console.log('Selected Day:', selectedDay);
    //     console.log('Filtered Hours:', filteredHours);
    // }, [filteredHours]);

    
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

    return (
        <div className="hourly-component"> 
            {filteredHours.length > 0 ? (
                <Slider {...settings}>
                    {filteredHours.map((hour) => {
                        const isCurrentHour = DateTime.fromISO(hour.time).hour === currentHour;
                        return (
                            <div
                                key={hour.time}
                                className={`hour-slider ${isCurrentHour ? 'current-hour' : ''}`}
                                onClick={() => onHourSelect(hour)}
                            >
                                <p>{hour.hourString}</p>
                                <p>{hour.temp_c}°C</p>
                            </div>
                        );
                    })}
                </Slider>
            ) : (
                <p>Loading hourly data...</p> 
            )}
        </div>
    );
};

export default HourlySlider;
