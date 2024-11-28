const getForecast = async (apiKey, location, days) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  return await response.json();
};

export default getForecast;