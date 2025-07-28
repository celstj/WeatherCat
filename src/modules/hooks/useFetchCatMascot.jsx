import { useState, useEffect } from 'react';

const useFetchCatMascot = (weatherCondition, mode = 'dark_mode') => {
  const [mascotUrl, setMascotUrl] = useState(null);

  useEffect(() => {
    if (!weatherCondition) return;

    const fetchMascotUrl = async () => {
      try {
        const keyRes = await fetch(`/api/getImageKey?weatherCondition=${weatherCondition}&mode=${mode}`);
        if (!keyRes.ok) {
          console.error('Failed to fetch mascot key:', keyRes.status, keyRes.statusText);
          return;
        }

        const { key } = await keyRes.json();
        if (!key) {
          console.warn('No mascot key returned for', weatherCondition, mode);
          return;
        }

        const redirectUrl = `/api/mascotRedirect?key=${encodeURIComponent(key)}`;
        setMascotUrl(redirectUrl);
        
      } catch (error) {
        console.error('Error fetching mascot image:', error);
      }
    };
    fetchMascotUrl();
}, [weatherCondition, mode]); 

  return mascotUrl;
};

export default useFetchCatMascot;
