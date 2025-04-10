import React, {useEffect, useState} from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const HourlySlider = ({ hourlyData, onHourSelect, weatherData }) => {    
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (hourlyData && hourlyData.length > 0) {
            setIsDataLoaded(true);
        } else {
            setIsDataLoaded(false);
        }
    }, [hourlyData]);

    const now = new Date(weatherData?.location?.localtime);
    const currentHour = now.getHours();

    const filteredHours = isDataLoaded ? hourlyData
        .filter(hour => hour.timeObj.getHours() > now.getHours() 
            || (hour.timeObj.getHours() === now.getHours()
            && hour.timeObj.getMinutes() > now.getMinutes()))
        .map((hour, index) => ({
            ...hour,
            hourString: new Date(hour.time).toLocaleTimeString([], {hour: 'numeric', hour12:true}),
        }))
        .filter((_, index) => index % 3 === 0) : [];

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

    useEffect(() => {
        console.log('hourlyData',hourlyData);
    }, [hourlyData]);


    return (
        <div className="hourly-component"> 
        {filteredHours.length > 0 ? (
                <Slider {...settings}>
                    {filteredHours.map((hour) => {
                        const isCurrentHour = new Date(hour.time).getHours() === currentHour;
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
