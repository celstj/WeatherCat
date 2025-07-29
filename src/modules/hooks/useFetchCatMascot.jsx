import { useState, useEffect } from 'react';

const useFetchCatMascot = (weatherCondition, mode = 'dark_mode') => {
  const [mascotUrl, setMascotUrl] = useState(null);

  useEffect(() => {
    if (!weatherCondition) return;
    

    const fetchMascotUrl = async () => {
      try {
        const keyRes = await fetch(`/api/getImageMeta?weatherCondition=${weatherCondition}&mode=${mode}`);
        if (!keyRes.ok) {
          console.error('[Mascot Fetch] Failed to fetch mascot key:', keyRes.status, keyRes.statusText);
          const text = await keyRes.text();
          console.error('[Mascot Fetch] Response text:', text);
          return;
        }

        const { key } = await keyRes.json();

        if (!key) {
          console.warn('No mascot key returned for', weatherCondition, mode);
          return;
        }

        const s3Res = await fetch(`/api/getImageUrl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key }),
        });
        
        if (!s3Res.ok) {
          const errorText = await s3Res.text();
          console.error('[Mascot Fetch] Failed to fetch signed S3 URL:', s3Res.status, s3Res.statusText);
          console.error('[Mascot Fetch] Response text:', errorText);
          return;
        }
        const { url } = await s3Res.json();
        console.log('[Mascot Fetch] Final mascot URL:', url);

        setMascotUrl(url);
      } catch (error) {
        console.error('[Mascot Fetch] Unexpected error:', error.message || error);
      }
    };

    fetchMascotUrl();
}, [weatherCondition, mode]); 

  return mascotUrl;
};

export default useFetchCatMascot;
