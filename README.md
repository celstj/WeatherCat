[Live Project](https://celstj.github.io/WeatherCat/) | [Code](https://github.com/celstj/WeatherCat)

# Weather Cat App 🌦️🐾 
Weather Cat is an interactive weather app that shows current and hourly weather conditions, with a playful cat mascot that changes according to the weather! You can search for locations, and watch the weather evolve over the hours while the mascot keeps you company. 🌈

---

## Features
- Location-based weather: Automatically fetches your location using your IP address, or you can manually search for a location.

- Hourly and daily forecasts: View weather for the upcoming hours or forecasted days with detailed weather data (temperature, wind, humidity, etc.).

- Mascot changes: A cute weather cat mascot that dynamically changes its appearance based on the weather conditions (using a weather condition code).

- Time & Date: Displays the current time & date, along with the time and date for selected hours and days.

---

## Technologies Used
- React
- Weather API: fetch weather data details.
- IP Location API: get user's location by IP for default weather data retrieval.
- S3 Bucket: uploaded img/gif for dynamic mascots.
- mongoDB: link between S3 bucket to website.

---

## Installation
1. **Clone the Repo:**
```bash 
git clone https://github.com/celstj/WeatherCat.git 
cd weather-cat-app
```

2. **Install Dependencies:**
```bash
npm install
```

3. ** Set up your `.env` file with your weather API key:**
```bash
VITE_WEATHER_API_KEY=your-weather-api-key
```

4. **Run the App:**
```bash
npm start
```

---

## How It Works
1. Location Handling:
The app first attempts to fetch your location by IP address. If it fails, you can search for a location manually.

useLocationByIP fetches the location using an IP location service.

2. Weather Data:
The app fetches weather data using the Weather API, showing current and forecasted conditions.

It handles hourly and daily data, and updates the UI with the weather info based on the selected hour or day.

3. Mascot Image:
The mascot changes depending on the weather code (like sunny, rainy, or cloudy), fetched using useFetchCatMascot.

This ensures the mascot reflects the weather conditions for the selected time and date.

---

## Challenges
- using React for the first time and navigating through the useStates, useEffect, useMemo etc.
- **API requests and server-side logic:**  
    configured server-side code to handle API requests, fetch images from S3 based on weather codes, and return the image.
    remembered that mongoDB has the imageURL for S3 images directly.
- **MongoDB, S3 and frontend integration:**
    had difficulties connecting to MongoDB and S3 to the frontend, ensuring images were fetched from S3 based on weather condition codes.
- keeping track of the dynamic changes according to weather and hour, and making sure that the details are changed in real time.
- hourly slider not bleeding into the next day as expected when the slots aren't filled.
- weatherData.current.condition.text bugging, "undefined property chain" ??? what, data was not called fast enough before useEffect() ? , possibly why data was not displayed even though it was being called.


## Known Issues / TODO

**Potential improvements Ideas:**
- replace all the `current api` to `forecast api` as forecast api also includes current weather data, and it'll make data retrieving more streamline
- mobile responsiveness : currently focusing on clarity and component modularity over full responsiveness, will revisit in future pass
- implement light and dark mode (maybe via background instead of mode toggle)
- optimise as desktop-first experiene or OBS overlay module.