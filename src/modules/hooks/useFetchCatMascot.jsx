import { useState, useEffect } from 'react';

const useFetchCatMascot = (weatherCondition, mode = 'dark_mode') => {
  const [mascotImage, setMascotImage] = useState(null);

  useEffect(() => {
    const fetchMascotImage = async () => {
      if (!weatherCondition) return;

      try {
        const response = await fetch(`/api/fetch-cat-mascot?weatherCondition=${weatherCondition}&mode=${mode}`);

        if (!response.ok) {
          throw new Error('Error fetching mascot image');
        }else {
          console.log('Mascot fetched', response.blob);
        }

        const data = await response.blob();
        const imgUrl = URL.createObjectURL(data); // convert blob to URL for displaying the images
        setMascotImage(imgUrl); 
      } catch (error) {
        console.error("Error fetching mascot image:", error);
      }
    };

    if (weatherCondition) {
      fetchMascotImage();
    }
    
  }, [weatherCondition, mode]); //refetch when either weather condition or mode changes

  return mascotImage;
};

export default useFetchCatMascot;
