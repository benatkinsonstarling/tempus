import { WeatherData } from '../types/types';
import { getWeatherIcon } from '../utils/weatherUtils';
import { CloudFastWindIcon, FastWindIcon, HumidityIcon, RainIcon, Uv02Icon } from "hugeicons-react";
import { getShortWeatherCondition } from '@/utils/weatherConditionMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import PrecipitationChart from './PrecipitationChart';
import WindChart from './WindChart';
import SunriseSunsetChart from './SunriseSunsetChart';
import DailySunriseSunsetTable from './DailySunriseSunsetTable';
import AirQualityDisplay from './AirQualityDisplay';
import NoDataTile from './NoDataTile';
import PrecipitationAlert from './PrecipitationAlert';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  backgroundGradient: string;
  isLight: boolean;
  location: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, backgroundGradient, isLight, location }) => {
  const textColor = isLight ? 'text-gray-800' : 'text-white';
  const hourlyForecastBackground = isLight ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-10';

  const isNight = (timestamp: number) => {
    return timestamp >= weatherData.current.sunset || timestamp < weatherData.current.sunrise;
  };

  const formatTime = (timestamp: number) => {
    try {
      // Create date in UTC, then apply the timezone offset
      const date = new Date((timestamp + weatherData.timezone_offset) * 1000);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC' // Important: use UTC since we're manually applying the offset
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  const getHourlyForecast = () => {
    return weatherData.hourly.map(hour => {
      // Get the correct sunrise/sunset times based on the hour
      const currentDay = weatherData.daily.find(day => 
        hour.dt >= day.sunrise && hour.dt < day.sunrise + 86400 // 24 hours in seconds
      ) || weatherData.daily[0];

      const nextDay = weatherData.daily[weatherData.daily.indexOf(currentDay) + 1];

      return {
        time: hour.dt,
        temperature: hour.temp,
        condition: hour.weather[0].id,
        windSpeed: hour.wind_speed,
        precipitation: hour.pop * 100,
        chanceOfRain: hour.pop * 100,
        sunrise: currentDay.sunrise,
        sunset: currentDay.sunset,
        nextSunrise: nextDay ? nextDay.sunrise : currentDay.sunrise + 86400,
        nextSunset: nextDay ? nextDay.sunset : currentDay.sunset + 86400
      };
    }).slice(0, 24);
  };

  const getDailyForecast = () => {
    return weatherData.daily.map(day => ({
      date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: day.temp.max,
      minTemp: day.temp.min,
      condition: day.weather[0].id,
      chanceOfRain: day.pop * 100,
      windSpeed: day.wind_speed,
      sunrise: day.sunrise,
      sunset: day.sunset
    }));
  };

  const getHourlyPrecipitationData = () => {
    return weatherData.hourly.map(hour => ({
      label: formatTime(hour.dt),
      precipitation: hour.pop * 100 // Convert to percentage
    })).slice(0, 24);
  };

  const getDailyPrecipitationData = () => {
    return weatherData.daily.map(day => ({
      label: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      precipitation: day.pop * 100 // Convert to percentage
    }));
  };

  const getHourlyWindData = () => {
    return weatherData.hourly.map(hour => ({
      label: formatTime(hour.dt),
      windSpeed: hour.wind_speed
    })).slice(0, 24);
  };

  const getDailyWindData = () => {
    return weatherData.daily.map(day => ({
      label: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      windSpeed: day.wind_speed
    }));
  };

  const getDailySunriseSunsetData = () => {
    return weatherData.daily.map(day => ({
      date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }), // Format date as short weekday
      sunrise: formatTime(day.sunrise), // Convert Unix timestamp to formatted time
      sunset: formatTime(day.sunset) // Convert Unix timestamp to formatted time
    }));
  };

  const hourlyForecast = getHourlyForecast();
  console.log('hourlyForecast', hourlyForecast);
  const dailyForecast = getDailyForecast();
  const hourlyPrecipitationData = getHourlyPrecipitationData();
  const dailyPrecipitationData = getDailyPrecipitationData();
  const hourlyWindData = getHourlyWindData();
  const dailyWindData = getDailyWindData();
  const dailySunriseSunsetData = getDailySunriseSunsetData();

  const WeatherIcon = getWeatherIcon(
    weatherData.current.weather[0].id,
    isNight(weatherData.current.dt)
  );

  const airQualityIndex = weatherData.air_quality?.main.aqi;

  const hasHourlyPrecipitation = hourlyPrecipitationData.some(item => item.precipitation > 0);
  const hasDailyPrecipitation = dailyPrecipitationData.some(item => item.precipitation > 0);
  const hasHourlyWind = hourlyWindData.some(item => item.windSpeed > 0);
  const hasDailyWind = dailyWindData.some(item => item.windSpeed > 0);

  // Check if there's rain in the next hour
  const hasMinuteRain = weatherData.minutely?.some(minute => minute.precipitation > 0);

  return (
    <div className={`w-full ${textColor}`}>
      <div className="max-w-6xl mx-auto p-4">
        
        <div className="mb-8">
          <p className="text-lg text-center mb-4">
            It's <span className="font-bold">{formatTime(weatherData.current.dt)}</span> in <span className="font-bold">{location}</span>, the weather is...
          </p>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
              <WeatherIcon size={160} />
              <h1 className='text-9xl font-bold ml-4'>{Math.round(weatherData.current.temp)}°C</h1>
            </div>
            <div className="grid grid-cols-4 text-center w-6/12">
              <div className="flex flex-col items-center">
                <CloudFastWindIcon size={32} />
                <p className="mt-2">Wind</p>
                <p className="font-bold">{Math.round(weatherData.current.wind_speed)} m/s</p>
              </div>
              <div className="flex flex-col items-center">
                <HumidityIcon size={32} />
                <p className="mt-2">Humidity</p>
                <p className="font-bold">{weatherData.current.humidity}%</p>
              </div>
              <div className="flex flex-col items-center">
                <RainIcon size={32} />
                <p className="mt-2">Rain</p>
                <p className="font-bold">{weatherData.hourly[0].pop}</p>
              </div>
              <div className="flex flex-col items-center">
                <Uv02Icon size={32} />
                <p className="mt-2">UV</p>
                <p className="font-bold">{Math.round(weatherData.current.uvi)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {hasMinuteRain && weatherData.minutely && (
          <PrecipitationAlert 
            minutelyData={weatherData.minutely}
            textColor={textColor}
            isDarkBackground={!isLight}
            timezone={weatherData.timezone}
          />
        )}

        <Tabs defaultValue="hourly" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
            <TabsTrigger value="daily">Daily Forecast</TabsTrigger>
          </TabsList>
          <TabsContent value="hourly">
            <div className={`rounded-lg p-4 ${hourlyForecastBackground}`}>
              <HourlyForecast 
                forecast={hourlyForecast}
                textColor={textColor}
                sunset={weatherData.current.sunset}
                sunrise={weatherData.daily[0].sunrise}
                nextSunrise={weatherData.daily[1].sunrise}
                nextSunset={weatherData.daily[1].sunset}
                timezoneOffset={weatherData.timezone_offset}
              />
            </div>
            
            {/* Add Hourly Precipitation Chart */}
            <div className={`mt-8 rounded-lg p-4 ${hourlyForecastBackground} h-60`}>
              <h3 className={`text-lg font-semibold text-center mb-2 ${textColor}`}>Hourly Rainfall Forecast</h3>
              {hasHourlyPrecipitation ? (
                <PrecipitationChart 
                  data={hourlyPrecipitationData} 
                  textColor={textColor} 
                  isDarkBackground={!isLight} 
                  isHourly={true}
                />
              ) : (
                <NoDataTile message="No rainfall forecast" isLight={isLight} textColor={textColor} />
              )}
            </div>

            {/* Add Hourly Wind and Other Charts */}
            <div className={`mt-8 flex flex-wrap justify-between`}>
              <div className={`w-1/2 pr-2`}>
                <div className={`rounded-lg p-4 ${hourlyForecastBackground} h-full`}>
                  <h3 className={`text-lg font-semibold text-center mb-2 ${textColor}`}>
                    <CloudFastWindIcon size={20} className="inline-block mr-1" /> Hourly Wind Forecast
                  </h3>
                  {hasHourlyWind ? (
                    <WindChart data={hourlyWindData} textColor={textColor} isDarkBackground={!isLight} />
                  ) : (
                    <NoDataTile message="No wind forecast" textColor={textColor} isLight={isLight} />
                  )}
                </div>
              </div>
              <div className={`w-1/2 pl-2`}>
                <div className={`rounded-lg p-4 ${hourlyForecastBackground} mb-4`}>
                  <SunriseSunsetChart
                    sunrise={formatTime(weatherData.current.sunrise)}
                    sunset={formatTime(weatherData.current.sunset)}
                    textColor={textColor}
                  />
                </div>
                {airQualityIndex && (
                  <div className={`rounded-lg p-4 ${hourlyForecastBackground} h-1/2`}>
                    <AirQualityDisplay
                      aqi={airQualityIndex}
                      textColor={textColor}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className={`rounded-lg p-4 ${hourlyForecastBackground}`}>
              <DailyForecast 
                forecast={dailyForecast}
                textColor={textColor}
              />
            </div>

            {/* Add Daily Precipitation Chart */}
            <div className={`mt-8 rounded-lg p-4 ${hourlyForecastBackground} h-60`}>
              <h3 className={`text-lg font-semibold text-center mb-2 ${textColor}`}>Daily Rainfall Forecast</h3>
              {hasDailyPrecipitation ? (
                <PrecipitationChart 
                  data={dailyPrecipitationData} 
                  textColor={textColor} 
                  isDarkBackground={!isLight} 
                  showTooltipLabel={false} 
                  isHourly={false}
                />
              ) : (
                <NoDataTile message="No rainfall forecast" textColor={textColor} isLight={isLight} />
              )}
            </div>

            {/* Add Daily Wind and Sunrise/Sunset Data */}
            <div className={`mt-8 flex flex-wrap justify-between`}>
              <div className={`w-1/2 pr-2`}>
                <div className={`rounded-lg p-4 ${hourlyForecastBackground} h-full`}>
                  <h3 className={`text-lg font-semibold text-center mb-2 ${textColor}`}>
                    <CloudFastWindIcon size={20} className="inline-block mr-1" /> Daily Wind Forecast
                  </h3>
                  {hasDailyWind ? (
                    <WindChart 
                      data={dailyWindData} 
                      textColor={textColor} 
                      isDarkBackground={!isLight} 
                      showTooltipLabel={false} 
                    />
                  ) : (
                    <NoDataTile message="No wind forecast" textColor={textColor} />
                  )}
                </div>
              </div>
              <div className={`w-1/2 pl-2`}>
                <div className={`rounded-lg p-4 ${hourlyForecastBackground} mb-4`}>
                  <DailySunriseSunsetTable 
                    days={dailySunriseSunsetData} 
                    textColor={textColor} 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeatherDisplay;
