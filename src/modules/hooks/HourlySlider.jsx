import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { DateTime } from "luxon";

const HourlySlider = ({ hourlyData, onHourSelect, weatherData, selectedDay, locationTimezone }) => {    
    const [filteredHours, setFilteredHours] = useState([]);

    const now = DateTime.fromISO(weatherData?.location?.localtime);
    const currentHour = now.hour;

    // console.log("before fulter", hourlyData);
    useEffect(() => {
        if (hourlyData && selectedDay) {
            const selectedDate = DateTime.fromJSDate(new Date(selectedDay)).startOf('day');
            const localNow = DateTime.now().setZone(locationTimezone);
            // const localTimeZone = localNow.zoneName;

               // Log to check selectedDay and localNow
                // console.log("Selected Day:", selectedDate.toISO());
                // console.log("Local Now:", localNow.toISO());

            const filtered = hourlyData
            .map(hour => {
                const hourTime = DateTime.fromFormat(hour.time, "yyyy-MM-dd HH:mm", { zone: locationTimezone });
                
                // Log to check each hour's time
                // console.log("Hour Time: (UTC)", hourTime.toISO());

                return {
                    ...hour,
                    hourTime,
                    hourDate: hourTime.startOf('day')
                };
            })
            .filter(hour =>  {
                return hour.hourDate >= selectedDate;
            })
            .filter(hour => hour.hourTime > localNow)
            .map(hour => ({
                ...hour,
                hourString: hour.hourTime.toLocaleString(DateTime.TIME_SIMPLE)
            }))
            .filter((_, index) => index % 3 === 0);  // Every 3rd hour only

        setFilteredHours(filtered);
        // console.log('Filtered Hours:', filtered);

        if (filtered?.length === 0) {
            console.warn("No matching hours found. Might be due to timezone mismatch or old data.");
        }
    }
}, [hourlyData, selectedDay, locationTimezone]);  // Re-run this effect whenever hourlyData or selectedDay changes


    
    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        slidesToShow: 7,
        slidesToScroll: 1,
        swipeToSlide: false,
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
                                <img className="hourly_condition" src={hour.condition.icon} />
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
