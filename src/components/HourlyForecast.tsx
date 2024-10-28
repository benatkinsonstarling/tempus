import React, { useRef, useState, useEffect } from 'react';
import { getWeatherIcon, isNighttime } from '../utils/weatherUtils';
import { getScaleInfo, tempScale, windScale, rainChanceScale } from '../utils/weatherScales';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { curveNatural } from '@visx/curve';
import { ThermometerIcon, WindIcon, CloudRainIcon } from 'lucide-react';
import { getShortWeatherCondition } from '../utils/weatherConditionMap';
import { RainIcon } from 'hugeicons-react';

interface HourlyForecastProps {
  forecast: Array<{
    time: number; // Unix timestamp
    temperature: number;
    condition: number; // Weather condition ID
    windSpeed: number;
    precipitation: number;
  }>;
  textColor: string;
  sunset: number; // Current day's sunset
  sunrise: number; // Current day's sunrise
  nextSunrise: number; // Next day's sunrise
  nextSunset: number; // Next day's sunset
  timezoneOffset: number; // Add timezone offset
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ 
  forecast, 
  textColor, 
  sunset, 
  sunrise, 
  nextSunrise,
  nextSunset,
  timezoneOffset
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      setContainerWidth(scrollElement.clientWidth);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const getY = (d: typeof forecast[0]) => d.temperature;

  const hourWidth = 100; // Width per hour in pixels
  const width = forecast.length * hourWidth;
  const height = 150;

  const xScale = scaleLinear({
    range: [0, width],
    domain: [0, forecast.length - 1],
  });

  const yScale = scaleLinear({
    range: [height, 0],
    domain: [
      Math.min(...forecast.map(getY)) - 2,
      Math.max(...forecast.map(getY)) + 2,
    ],
  });

  const Badge: React.FC<{ value: number; scale: typeof tempScale; unit: string; icon: React.ReactNode }> = ({ value, scale, unit, icon }) => {
    const { color, opacity, label } = getScaleInfo(value, scale);
    return (
      <div 
        className={`${textColor} text-xs font-bold px-2 py-2 rounded-full my-0.5 relative overflow-hidden flex items-center`}
        title={label}
      >
        <div className={`absolute inset-0 ${color}`} style={{ opacity: opacity }}></div>
        {icon}
        <span className="relative z-10 ml-1">{Math.round(value)}{unit}</span>
      </div>
    );
  };

  return (
    <div className="relative min-h-[150px] overflow-hidden">
      <div 
        ref={scrollRef} 
        className="absolute top-0 left-0 right-0 bottom-0 overflow-x-auto"
        onScroll={handleScroll}
      >
        <div className="relative" style={{ width: `${width}px`, height: 'fit-content' }}>
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              width: `${width}px`, 
              height: '100%',
            }}
          >
            <Group opacity={0.15}>
              <LinePath
                data={forecast}
                x={(d, i) => xScale(i)}
                y={d => yScale(d.temperature)}
                stroke="yellow"
                strokeWidth={2}
                curve={curveNatural}
              />
            </Group>
          </svg>
          <div className="flex absolute top-0 left-0 z-10">
            {forecast.map((hour, index) => {
              const isAfterSunset = hour.time > sunset;
              const isNight = isNighttime(
                hour.time, 
                isAfterSunset ? nextSunset : sunset,
                isAfterSunset ? nextSunrise : sunrise
              );
              const WeatherIcon = getWeatherIcon(hour.condition, isNight);
              
              // Update time formatting to use timezone offset
              const date = new Date((hour.time + timezoneOffset) * 1000);
              const formattedTime = date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false,
                timeZone: 'UTC' // Important: use UTC since we're manually applying the offset
              });
              
              return (
                <div key={index} className={`flex flex-col items-center ${textColor}`} style={{ minWidth: `${hourWidth}px` }}>
                  <p className="font-bold text-sm pb-1">{formattedTime}</p>
                  <WeatherIcon size={40} className='pb-1'/>
                  <p className='text-lg font-bold'>{Math.round(hour.temperature)}°C</p>
                  <span className='flex items-center flex-row'>
                    <RainIcon className='mr-1' size={10}/>
                    <p className='text-xs'>{Math.round(hour.precipitation)}%</p>
                  </span>
                  <span className='flex items-center flex-row'>
                    <WindIcon className='mr-1' size={10}/>
                    <p className='text-xs'>{Math.round(hour.windSpeed)} km/h</p>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
