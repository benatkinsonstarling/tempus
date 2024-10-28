import {
  WiDaySunny, WiNightClear,
  WiDayCloudy, WiNightAltCloudy,
  WiCloud, WiCloudy,
  WiDayRain, WiNightAltRain,
  WiDayShowers, WiNightAltShowers,
  WiDayThunderstorm, WiNightAltThunderstorm,
  WiDaySnow, WiNightAltSnow,
  WiDayFog, WiNightFog,
  WiDayWindy, WiStrongWind,
  WiTornado, WiDust,
  WiDaySleet, WiNightAltSleet,
  WiRainMix, WiSleet,
  WiSnowWind, WiSnow,
  WiRain, WiRainWind,
  WiThunderstorm, WiStormShowers,
  WiDayHaze, WiSmoke,
  WiVolcano, WiWindy,
  WiHurricane
} from 'weather-icons-react';

export const getWeatherIcon = (weatherId: number, isNight: boolean) => {
  // Thunderstorm conditions (200-232)
  switch (weatherId) {
    // Group 2xx: Thunderstorm
    case 200: return isNight ? WiNightAltThunderstorm : WiDayThunderstorm; // thunderstorm with light rain
    case 201: return WiThunderstorm; // thunderstorm with rain
    case 202: return WiStormShowers; // thunderstorm with heavy rain
    case 210: return isNight ? WiNightAltThunderstorm : WiDayThunderstorm; // light thunderstorm
    case 211: return WiThunderstorm; // thunderstorm
    case 212: return WiStormShowers; // heavy thunderstorm
    case 221: return WiStormShowers; // ragged thunderstorm
    case 230: 
    case 231:
    case 232: return WiThunderstorm; // thunderstorm with drizzle variations

    // Group 3xx: Drizzle
    case 300:
    case 301:
    case 302: return isNight ? WiNightAltShowers : WiDayShowers; // drizzle variations
    case 310:
    case 311:
    case 312: return isNight ? WiNightAltRain : WiDayRain; // drizzle rain variations
    case 313:
    case 314:
    case 321: return WiRainMix; // shower drizzle variations

    // Group 5xx: Rain
    case 500: return isNight ? WiNightAltRain : WiDayRain; // light rain
    case 501: return WiRain; // moderate rain
    case 502:
    case 503:
    case 504: return WiRainWind; // heavy/intense rain variations
    case 511: return WiSleet; // freezing rain
    case 520: return isNight ? WiNightAltShowers : WiDayShowers; // light shower rain
    case 521: return WiRain; // shower rain
    case 522:
    case 531: return WiRainWind; // heavy shower rain

    // Group 6xx: Snow
    case 600: return isNight ? WiNightAltSnow : WiDaySnow; // light snow
    case 601: return isNight ? WiNightAltSnow : WiDaySnow; // snow
    case 602: return isNight ? WiNightAltSnow : WiDaySnow; // heavy snow
    case 611:
    case 612:
    case 613: return isNight ? WiNightAltSleet : WiDaySleet; // sleet variations
    case 615:
    case 616: return WiRainMix; // rain and snow variations
    case 620: return isNight ? WiNightAltSnow : WiDaySnow; // light shower snow
    case 621: return isNight ? WiNightAltSnow : WiDaySnow; // shower snow
    case 622: return isNight ? WiNightAltSnow : WiSnowWind; // heavy shower snow

    // Group 7xx: Atmosphere
    case 701: return isNight ? WiNightFog : WiDayFog; // mist
    case 711: return WiSmoke; // smoke
    case 721: return WiDayHaze; // haze
    case 731:
    case 761: return WiDust; // dust/sand
    case 741: return isNight ? WiNightFog : WiDayFog; // fog
    case 751: return WiDust; // sand
    case 762: return WiVolcano; // volcanic ash
    case 771: return WiStrongWind; // squalls
    case 781: return WiTornado; // tornado

    // Group 800: Clear
    case 800: return isNight ? WiNightClear : WiDaySunny; // clear sky

    // Group 80x: Clouds
    case 801: return isNight ? WiNightAltCloudy : WiDayCloudy; // few clouds
    case 802: return isNight ? WiNightAltCloudy : WiDayCloudy; // scattered clouds
    case 803:
    case 804: return isNight ? WiNightAltCloudy : WiDayCloudy; // broken/overcast clouds

    default: return isNight ? WiNightAltCloudy : WiDayCloudy;
  }
};

export const getBackgroundColor = (weatherId: number, temp: number, currentTime: number, sunset: number, sunrise: number): string => {
  const isNight = isNighttime(currentTime, sunset, sunrise);
  
  if (isNight) {
    // Night gradients - darker and more muted
    switch (true) {
      // Thunderstorms (200-232)
      case weatherId >= 200 && weatherId < 300:
        return weatherId >= 210 ? 
          'bg-gradient-to-b from-slate-950 to-purple-950' :  // heavy thunder
          'bg-gradient-to-b from-slate-900 to-purple-900';   // light thunder

      // Drizzle (300-321)
      case weatherId >= 300 && weatherId < 400:
        return 'bg-gradient-to-b from-slate-800 to-blue-900';

      // Rain (500-531)
      case weatherId >= 500 && weatherId < 600:
        if (weatherId === 511) return 'bg-gradient-to-b from-slate-900 to-cyan-900'; // freezing rain
        return weatherId >= 502 ?
          'bg-gradient-to-b from-slate-950 to-blue-950' :    // heavy rain
          'bg-gradient-to-b from-slate-800 to-blue-900';     // light/medium rain

      // Snow (600-622)
      case weatherId >= 600 && weatherId < 700:
        return 'bg-gradient-to-b from-slate-800 to-slate-600';

      // Atmosphere (700-781)
      case weatherId >= 700 && weatherId < 800:
        if (weatherId === 781) return 'bg-gradient-to-b from-slate-950 to-stone-900'; // tornado
        if (weatherId === 771) return 'bg-gradient-to-b from-slate-900 to-stone-800'; // squall
        return 'bg-gradient-to-b from-slate-800 to-slate-700'; // mist, fog, etc

      // Clear (800)
      case weatherId === 800:
        return 'bg-gradient-to-b from-slate-900 to-blue-950';

      // Clouds (801-804)
      case weatherId >= 801:
        return weatherId >= 803 ?
          'bg-gradient-to-b from-slate-900 to-slate-800' :   // overcast
          'bg-gradient-to-b from-slate-800 to-slate-700';    // partial clouds

      default:
        return 'bg-gradient-to-b from-slate-800 to-blue-900';
    }
  } else {
    // Day gradients - brighter and more vibrant
    switch (true) {
      // Thunderstorms (200-232)
      case weatherId >= 200 && weatherId < 300:
        return weatherId >= 210 ?
          'bg-gradient-to-b from-slate-800 to-purple-700' :  // heavy thunder
          'bg-gradient-to-b from-slate-700 to-purple-600';   // light thunder

      // Drizzle (300-321)
      case weatherId >= 300 && weatherId < 400:
        return 'bg-gradient-to-b from-slate-400 to-blue-400';

      // Rain (500-531)
      case weatherId >= 500 && weatherId < 600:
        if (weatherId === 511) return 'bg-gradient-to-b from-slate-500 to-cyan-400'; // freezing rain
        return weatherId >= 502 ?
          'bg-gradient-to-b from-slate-700 to-blue-600' :    // heavy rain
          'bg-gradient-to-b from-slate-500 to-blue-400';     // light/medium rain

      // Snow (600-622)
      case weatherId >= 600 && weatherId < 700:
        return temp < 0 ?
          'bg-gradient-to-b from-slate-200 to-blue-100' :    // very cold snow
          'bg-gradient-to-b from-blue-100 to-slate-200';     // warmer snow

      // Atmosphere (700-781)
      case weatherId >= 700 && weatherId < 800:
        if (weatherId === 781) return 'bg-gradient-to-b from-slate-800 to-stone-700'; // tornado
        if (weatherId === 771) return 'bg-gradient-to-b from-slate-600 to-stone-500'; // squall
        if (weatherId === 761 || weatherId === 731) return 'bg-gradient-to-b from-yellow-700 to-stone-500'; // dust/sand
        return 'bg-gradient-to-b from-slate-400 to-slate-300'; // mist, fog, etc

      // Clear (800)
      case weatherId === 800:
        if (temp >= 30) return 'bg-gradient-to-b from-orange-400 to-yellow-300';      // very hot
        if (temp >= 20) return 'bg-gradient-to-b from-blue-400 to-yellow-200';        // warm
        if (temp >= 10) return 'bg-gradient-to-b from-blue-400 to-sky-200';           // mild
        return 'bg-gradient-to-b from-blue-500 to-blue-300';                          // cool

      // Clouds (801-804)
      case weatherId >= 801:
        if (temp >= 25) return 'bg-gradient-to-b from-slate-400 to-yellow-200';       // hot cloudy
        if (temp >= 15) return 'bg-gradient-to-b from-slate-400 to-slate-200';        // warm cloudy
        if (temp >= 5) return 'bg-gradient-to-b from-slate-500 to-blue-200';          // mild cloudy
        return 'bg-gradient-to-b from-slate-600 to-blue-300';                         // cool cloudy

      default:
        return 'bg-gradient-to-b from-blue-400 to-blue-600';
    }
  }
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
