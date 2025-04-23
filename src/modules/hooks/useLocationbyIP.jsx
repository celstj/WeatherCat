import { useState, useEffect } from 'react';

const useLocationByIP = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const apiKey = import.meta.env.VITE_IP_INFO_API_KEY;
                const response = await fetch(`https://ipinfo.io/json?token=${apiKey}`); // Use your API key here
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error.message);
                }
                
                const { city, region, country, loc } = data; // Extract relevant location details
                const [latitude, longitude] = loc.split(',');

                // You now have the city, region, country, latitude, and longitude from IP geolocation
                setLocation({ city, region, country, latitude, longitude });
            } catch (err) {
                setError(err.message || 'Error fetching location data');
            }
        };

        fetchLocation();
    }, []); 

    return { location, error };
};

export default useLocationByIP;
