import { Sun02Icon, CloudIcon, CloudBigRainIcon, CloudAngledZapIcon, 
  CloudSnowIcon, CloudMidSnowIcon, Moon02Icon, MoonCloudAngledRainIcon, 
  MoonCloudAngledZapIcon, MoonCloudSnowIcon, MoonCloudSlowWindIcon } from "hugeicons-react";

// OpenWeather condition codes: https://openweathermap.org/weather-conditions
export const getWeatherIcon = (weatherId: number, isNight: boolean) => {
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return isNight ? MoonCloudAngledZapIcon : CloudAngledZapIcon;
  }
  // Drizzle
  if (weatherId >= 300 && weatherId < 400) {
    return isNight ? MoonCloudAngledRainIcon : CloudBigRainIcon;
  }
  // Rain
  if (weatherId >= 500 && weatherId < 600) {
    return isNight ? MoonCloudAngledRainIcon : CloudBigRainIcon;
  }
  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return isNight ? MoonCloudSnowIcon : CloudSnowIcon;
  }
  // Atmosphere (mist, fog, etc)
  if (weatherId >= 700 && weatherId < 800) {
    return isNight ? MoonCloudSlowWindIcon : CloudMidSnowIcon;
  }
  // Clear
  if (weatherId === 800) {
    return isNight ? Moon02Icon : Sun02Icon;
  }
  // Clouds
  if (weatherId > 800) {
    return isNight ? MoonCloudSlowWindIcon : CloudIcon;
  }
  
  return isNight ? Moon02Icon : CloudIcon;
};

export const getBackgroundColor = (weatherId: number, temp: number, currentTime: number, sunset: number, sunrise: number): string => {
  const isNight = isNighttime(currentTime, sunset, sunrise);
  let gradient = '';
  
  if (isNight) {
    // Night gradients
    if (weatherId >= 200 && weatherId < 300) { // Thunderstorm
      gradient = 'bg-gradient-to-b from-gray-900 to-purple-900';
    } else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) { // Rain
      gradient = 'bg-gradient-to-b from-gray-900 to-blue-800';
    } else if (weatherId >= 600 && weatherId < 700) { // Snow
      gradient = 'bg-gradient-to-b from-gray-700 to-blue-700';
    } else if (weatherId >= 700 && weatherId < 800) { // Atmosphere
      gradient = 'bg-gradient-to-b from-gray-700 to-gray-600';
    } else if (weatherId === 800) { // Clear
      gradient = 'bg-gradient-to-b from-gray-900 to-blue-900';
    } else { // Clouds
      gradient = 'bg-gradient-to-b from-gray-800 to-blue-800';
    }
  } else {
    // Day gradients
    if (weatherId >= 200 && weatherId < 300) { // Thunderstorm
      gradient = 'bg-gradient-to-b from-gray-900 to-blue-900';
    } else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) { // Rain
      if (temp > 25) gradient = 'bg-gradient-to-b from-gray-600 to-blue-400';
      else if (temp > 15) gradient = 'bg-gradient-to-b from-gray-700 to-blue-500';
      else if (temp > 5) gradient = 'bg-gradient-to-b from-gray-800 to-blue-600';
      else gradient = 'bg-gradient-to-b from-gray-900 to-blue-700';
    } else if (weatherId >= 600 && weatherId < 700) { // Snow
      gradient = 'bg-gradient-to-b from-gray-100 to-blue-200';
    } else if (weatherId >= 700 && weatherId < 800) { // Atmosphere
      gradient = 'bg-gradient-to-b from-gray-400 to-gray-300';
    } else if (weatherId === 800) { // Clear
      if (temp > 30) gradient = 'bg-gradient-to-b from-yellow-400 to-red-500';
      else if (temp > 20) gradient = 'bg-gradient-to-b from-blue-300 to-yellow-200';
      else if (temp > 10) gradient = 'bg-gradient-to-b from-blue-400 to-blue-200';
      else gradient = 'bg-gradient-to-b from-blue-500 to-blue-300';
    } else { // Clouds
      if (temp > 25) gradient = 'bg-gradient-to-b from-gray-300 to-yellow-200';
      else if (temp > 15) gradient = 'bg-gradient-to-b from-gray-400 to-gray-200';
      else if (temp > 5) gradient = 'bg-gradient-to-b from-gray-500 to-blue-200';
      else gradient = 'bg-gradient-to-b from-gray-600 to-blue-300';
    }
  }

  return gradient;
};

export const isNighttime = (currentTime: number, sunset: number, sunrise: number): boolean => {
  console.log('currentTime', currentTime);
  console.log('sunset', sunset);
  console.log('sunrise', sunrise);
  return currentTime >= sunset || currentTime < sunrise;
};

export const isLightGradient = (gradient: string): boolean => {
  if (gradient) {
    const lightGradients = [
      'from-blue-300', 'from-blue-200', 'from-yellow-200', 
      'from-gray-200', 'from-gray-300', 'from-gray-100'
    ];
    return lightGradients.some(light => gradient.includes(light));
  }
  return false;
};

export const getDailyBackgroundColor = (weatherId: number, temp: number): string => {
  // Similar structure to getBackgroundColor but with reduced opacity
  const baseGradient = getBackgroundColor(weatherId, temp, Date.now() / 1000, 0, 0);
  return baseGradient.replace('bg-gradient-to-b', 'bg-gradient-to-b bg-opacity-50');
};
