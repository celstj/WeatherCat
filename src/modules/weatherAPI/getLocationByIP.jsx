const getLocationByIP = async () => {
  try {
    const response = await fetch('http://ip-api.com/json');
    const data = await response.json();

    if (data.status === 'fail') {
      throw new Error('Unable to fetch location');
    }

    // Use the city or region to get weather data
    const location = `${data.city}, ${data.regionName}`;
    console.log(`Location fetched by IP: ${location}`);
    
    return location;
  } catch (error) {
    console.error('Error fetching location by IP:', error);
    return null; // Fallback if IP geolocation fails
  }
};

export default getLocationByIP;