// utils/timeHelpers.js or wherever
export const isSameHourBlock = (dateA, dateB) => {
    return (
        dateA.getHours() === dateB.getHours() &&
        dateA.getDate() === dateB.getDate() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getFullYear() === dateB.getFullYear()
    );
};

// export const isSunriseSoon = (sunriseTime, bufferMinutes = 30) => {
//     const now = new Date();
//     const sunrise = new Date(sunriseTime);
//     const timeDifference = sunrise - now;

//     return timeDifference > 0 && timeDifference <= bufferMinutes * 60 * 1000;
// };