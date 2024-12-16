// import { useState, useEffect } from 'react';

// const WeatherApp = () => {
//   const [weatherCondition, setWeatherCondition] = useState('sunny'); // Example condition
//   const [weatherImage, setWeatherImage] = useState(null);
//   const [error, setError] = useState(null);

//   // Fetch weather image based on the condition
//   const fetchWeatherImage = async (condition) => {
//     try {
//       const response = await fetch(`/api/weather-image?condition=${condition}`);
//       const data = await response.json();

//       if (response.ok) {
//         setWeatherImage(data.url); // Assuming the response contains the image URL
//       } else {
//         setError(data.message); // Show message if no image is found
//       }
//     } catch (error) {
//       setError('Error fetching weather image');
//       console.error('Error fetching weather image:', error);
//     }
//   };

//   // Fetch the weather image whenever the condition changes
//   useEffect(() => {
//     if (weatherCondition) {
//       fetchWeatherImage(weatherCondition);
//     }
//   }, [weatherCondition]);

//   return (
//     <div>
//       <h1>Weather App</h1>
//       <p>Weather condition: {weatherCondition}</p>

//       {weatherImage ? (
//         <img src={weatherImage} alt={`Weather condition: ${weatherCondition}`} />
//       ) : (
//         <p>No image found for this condition</p>
//       )}

//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default WeatherApp;
