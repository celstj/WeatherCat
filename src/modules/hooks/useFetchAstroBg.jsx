import { useEffect, useState } from 'react';

const useFetchAstroBg = (currentTimeISO, sunTimes) =>{
  const [astroData, setAstroData] = useState('day');

  useEffect(() => {
    if (!currentTimeISO || !sunTimes?.sunrise || !sunTimes?.sunset) return;

    const now = new Date(currentTimeISO).getTime();
    const sunrise = new Date(sunTimes.sunrise).getTime();
    const sunset = new Date(sunTimes.sunset).getTime();

    console.log("Current Time:", now);

    const buffer = 30 * 60 * 1000; // 30 minutes

    if (now < sunrise - buffer || now > sunset + buffer) {
      setAstroData('night');
    } else if (now >= sunrise - buffer && now <= sunrise + buffer) {
      setAstroData('sunrise');
    } else if (now >= sunset - buffer && now <= sunset + buffer) {
      setAstroData('sunset');
    } else {
      setAstroData('day');
    }
  }, [currentTimeISO, sunTimes]);

  return astroData;
}

export default useFetchAstroBg;