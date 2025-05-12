import { useState, useEffect } from 'react';

const useFetchCatMascot = (weatherCondition, mode = 'dark_mode') => {
  const [mascotUrl, setMascotUrl] = useState(null);

  useEffect(() => {
    if (!weatherCondition) return;

    const fetchMascotImage = async () => {
      const apiUrl = `/api/fetch-cat-mascot?weatherCondition=${weatherCondition}&mode=${mode}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          console.error('Failed to fetch mascot image', response.status, response.statusText, 
            `"${weatherCondition}: "${typeof weatherCondition}", "${mode}"`);
          return;
        }

        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob); 
        setMascotUrl(imageUrl);
        
      } catch (error) {
        console.error('Error fetching mascot image:', error);
      }
    };
    fetchMascotImage();
}, [weatherCondition, mode]); 

  return mascotUrl;
};

export default useFetchCatMascot;
