import { useState, useEffect } from 'react';

const useFetchCatMascot = (weatherCondition, mode = 'dark_mode') => {
  const [mascotUrl, setMascotUrl] = useState(null);

  useEffect(() => {
    if (!weatherCondition) return;

    const fetchMascotUrl = async () => {
      try {
        const keyRes = await fetch(`/api/internal/getImageMeta?weatherCondition=${weatherCondition}&mode=${mode}`);
        if (!keyRes.ok) {
          console.error('Failed to fetch mascot key:', keyRes.status, keyRes.statusText);
          return;
        }

        const { key } = await keyRes.json();
        if (!key) {
          console.warn('No mascot key returned for', weatherCondition, mode);
          return;
        }

        const s3Res = await fetch(`/api/edge/getImageUrl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key }),
        });
        if (!s3Res.ok) {
          console.error('Failed to fetch signed S3 URL:', urlRes.status, urlRes.statusText);
          return;
        }
        const { url } = await s3Res.json();
        setMascotUrl(url);
      } catch (error) {
        console.error('Error fetching mascot image:', error);
      }
    };

    fetchMascotUrl();
}, [weatherCondition, mode]); 

  return mascotUrl;
};

export default useFetchCatMascot;
