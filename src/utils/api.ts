import { WeatherData } from '../types/types';

const API_KEY = '444c0d396526ea9e11c2c4f3b0e17397';
const BASE_URL = 'https://api.openweathermap.org/data/3.0';

// Mock data that matches OpenWeather's format exactly
const mockWeatherData: WeatherData = {
  lat: 51.5074,
  lon: -0.1278,
  timezone: "Europe/London",
  timezone_offset: 0,
  current: {
    dt: Math.floor(Date.now() / 1000),
    sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
    sunset: Math.floor(Date.now() / 1000) + 21600, // 6 hours from now
    temp: 18.5,
    feels_like: 17.8,
    pressure: 1012,
    humidity: 65,
    dew_point: 12.1,
    uvi: 4.5,
    clouds: 40,
    visibility: 10000,
    wind_speed: 4.2,
    wind_deg: 250,
    weather: [{
      id: 802,
      main: "Clouds",
      description: "scattered clouds",
      icon: "03d"
    }]
  },
  hourly: Array.from({ length: 24 }, (_, i) => ({
    dt: Math.floor(Date.now() / 1000) + (i * 3600),
    temp: 18.5 + Math.sin(i * 0.5) * 5, // Temperature varies sinusoidally
    feels_like: 17.8 + Math.sin(i * 0.5) * 4,
    pressure: 1012,
    humidity: 65 + Math.sin(i * 0.3) * 10,
    dew_point: 12.1,
    uvi: Math.max(0, 4.5 * Math.sin(i * Math.PI / 12)), // UV peaks at midday
    clouds: 40 + Math.sin(i * 0.8) * 30,
    visibility: 10000,
    wind_speed: 4.2 + Math.sin(i * 0.2) * 2,
    wind_deg: 250,
    wind_gust: 6.1 + Math.sin(i * 0.2) * 3,
    weather: [{
      id: i % 2 === 0 ? 802 : 801, // Alternates between two conditions
      main: "Clouds",
      description: i % 2 === 0 ? "scattered clouds" : "few clouds",
      icon: i % 2 === 0 ? "03d" : "02d"
    }],
    pop: Math.sin(i * 0.5) * 0.4 // Varies precipitation probability
  })),
  daily: Array.from({ length: 7 }, (_, i) => ({
    dt: Math.floor(Date.now() / 1000) + (i * 86400),
    sunrise: Math.floor(Date.now() / 1000) - 21600 + (i * 86400),
    sunset: Math.floor(Date.now() / 1000) + 21600 + (i * 86400),
    moonrise: Math.floor(Date.now() / 1000) - 10800 + (i * 86400),
    moonset: Math.floor(Date.now() / 1000) + 32400 + (i * 86400),
    moon_phase: 0.5,
    temp: {
      day: 18.5 + Math.sin(i * 0.5) * 5,
      min: 13.5 + Math.sin(i * 0.5) * 3,
      max: 23.5 + Math.sin(i * 0.5) * 4,
      night: 15.5 + Math.sin(i * 0.5) * 3,
      eve: 20.5 + Math.sin(i * 0.5) * 4,
      morn: 14.5 + Math.sin(i * 0.5) * 3
    },
    feels_like: {
      day: 17.8 + Math.sin(i * 0.5) * 4,
      night: 14.8 + Math.sin(i * 0.5) * 3,
      eve: 19.8 + Math.sin(i * 0.5) * 4,
      morn: 13.8 + Math.sin(i * 0.5) * 3
    },
    pressure: 1012,
    humidity: 65 + Math.sin(i * 0.3) * 10,
    dew_point: 12.1,
    wind_speed: 4.2 + Math.sin(i * 0.2) * 2,
    wind_deg: 250,
    weather: [{
      id: [800, 801, 802, 500, 501, 200][i % 6], // Cycles through different weather conditions
      main: ["Clear", "Clouds", "Clouds", "Rain", "Rain", "Thunderstorm"][i % 6],
      description: ["clear sky", "few clouds", "scattered clouds", "light rain", "moderate rain", "thunderstorm"][i % 6],
      icon: ["01d", "02d", "03d", "10d", "10d", "11d"][i % 6]
    }],
    clouds: 40 + Math.sin(i * 0.8) * 30,
    pop: Math.sin(i * 0.5) * 0.4,
    rain: Math.max(0, Math.sin(i * 0.5) * 10),
    uvi: 4.5 + Math.sin(i * 0.5) * 2
  })),
  air_quality: {
    main: {
      aqi: 2 // 1 to 5 scale in OpenWeather
    },
    components: {
      co: 233.67,
      no: 0.87,
      no2: 9.41,
      o3: 49.79,
      so2: 11.01,
      pm2_5: 8.74,
      pm10: 12.83,
      nh3: 1.03
    }
  },
  localTime: new Date().toISOString()
};

export const fetchWeatherData = async (lat: number, lon: number, localTime: string): Promise<WeatherData | null> => {
  try {
    // Fetch current weather, hourly forecast, and daily forecast using One Call API
    const response = await fetch(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      console.warn('Weather API failed, using mock data');
      return mockWeatherData;
    }
    
    // Fetch air quality data
    const aqResponse = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!aqResponse.ok) {
      throw new Error('Air quality data fetch failed');
    }

    const weatherData = await response.json();
    const aqData = await aqResponse.json();

    // Combine the data
    const combinedData = {
      ...weatherData,
      air_quality: aqData.list[0],
      localTime
    };

    return combinedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    console.warn('Using mock data instead');
    return mockWeatherData;
  }
};

export const getPlaceDetails = async (placeId: string): Promise<{ lat: number; lon: number; localTime: string }> => {
  const placeResponse = await fetch(
    'https://places.googleapis.com/v1/places/' + placeId + '?fields=location',
    {
      headers: {
        'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
      },
    }
  );
  const placeData = await placeResponse.json();
  const lat = placeData.location.latitude;
  const lon = placeData.location.longitude;

  // Get the current timestamp
  const timestamp = Math.floor(Date.now() / 1000);

  // Call the Time Zone API
  const timeZoneResponse = await fetch(
    `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestamp}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
  );
  const timeZoneData = await timeZoneResponse.json();

  // Calculate the local time
  const localTime = new Date((timestamp + timeZoneData.dstOffset + timeZoneData.rawOffset) * 1000);

  return { 
    lat, 
    lon,
    localTime: localTime.toISOString(),
  };
};
