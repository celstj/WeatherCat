import React from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const HourlySlider = ({ hourlyData, onHourSelect }) => {

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        swipeToSlide: true,
    };

    const currentHour = new Date().getHours();

    console.log("hourly data: ",hourlyData); 

    const processedHourlyData = hourlyData
        .filter(hour => {
            const hourDate = new Date(hour.time);
            const hourInRange = hourDate.getHours() >= currentHour;

            console.log(`Filtering hour: ${hourDate.getHours()} in range: ${hourInRange}`);

            return hourInRange && (hourDate.getHours() % 3 === 0 || hourDate.getHours() === currentHour);
    })
    .map(hour => {
        const hourDate = new Date(hour.time);
        const hourString = hourDate.toLocaleTimeString(
            [], {hour: 'numeric', hour12: true}
        );
        
        return {
            ...hour,
            hourString,
        };
    });

    console.log("processed hourly data: ", processedHourlyData); 

    return (
        <div className="hourly-component">
            {processedHourlyData.length > 0 ? (
            <Slider {...settings}>
                {processedHourlyData.map((hour, index) => (
                <div 
                    key={index} 
                    className="hour-slider"
                    onClick={() => onHourSelect(hour)} 
                    >
                        <p> {hour.hourString} </p>
                        <p>{hour.temp_c}°C</p>
                </div>
                ))}
            </Slider>
            ) : (
                <p> No hourly data available </p>
            )}
        </div>
    );
};

export default HourlySlider;