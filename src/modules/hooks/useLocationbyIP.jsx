import { useState, useEffect } from 'react';

const useLocationByIP = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch('http://ip-api.com/json');
                const data = await response.json();
                
                // Check if the status is 'fail' and throw an error
                if (data.status === 'fail') {
                    throw new Error('Unable to fetch location');
                }

                // Store the location data if fetch is successful
                setLocation(data);
            } catch (err) {
                // Handle errors such as network issues, API issues, etc.
                setError(err.message || 'Error fetching location');
            }
        };

        fetchLocation();
    }, []); // This effect will run once on mount to fetch location by IP

    return { location, error }; // Return location and error to the caller
};

export default useLocationByIP;
