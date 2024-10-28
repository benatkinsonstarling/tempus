import React, { useRef, useState, useEffect } from 'react';
import { getWeatherIcon } from '../utils/weatherUtils';
import { getScaleInfo, tempScale, rainChanceScale, windScale } from '../utils/weatherScales';
import { getShortWeatherCondition } from '../utils/weatherConditionMap';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { curveNatural } from '@visx/curve';
import { ThermometerIcon, CloudRainIcon, WindIcon } from 'lucide-react';
import { RainIcon } from 'hugeicons-react';
interface DailyForecastProps {
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: number; // Weather condition ID
    chanceOfRain: number;
    windSpeed: number;
    sunrise: number; // Add sunrise timestamp
    sunset: number;  // Add sunset timestamp
  }>;
  textColor: string;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ forecast, textColor }) => {
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

  const getMaxY = (d: typeof forecast[0]) => d.maxTemp;
  const getMinY = (d: typeof forecast[0]) => d.minTemp;

  const dayWidth = 100; // Width per day in pixels
  const width = forecast.length * dayWidth;
  const height = 150;

  const xScale = scaleLinear({
    range: [0, width],
    domain: [0, forecast.length - 1],
  });

  const yScale = scaleLinear({
    range: [height, 0],
    domain: [
      Math.min(...forecast.map(getMinY)) - 2,
      Math.max(...forecast.map(getMaxY)) + 2,
    ],
  });

  const Badge: React.FC<{ value: number; scale: typeof tempScale; unit: string; icon: React.ReactNode }> = ({ value, scale, unit, icon }) => {
    const { color, opacity, label } = getScaleInfo(value, scale);
    return (
      <div 
        className={`${textColor} text-xs font-bold px-2 py-1 rounded-full my-1 relative overflow-hidden flex items-center`}
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
        <div className="relative" style={{ width: `${width}px`, height: '100%' }}>
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ 
              width: `${width}px`, 
              height: '100%',
            }}
          >
            <Group opacity={0.1}>
              <LinePath
                data={forecast}
                x={(d, i) => xScale(i)}
                y={d => yScale(d.maxTemp)}
                stroke="yellow"
                strokeWidth={2}
                curve={curveNatural}
              />
              <LinePath
                data={forecast}
                x={(d, i) => xScale(i)}
                y={d => yScale(d.minTemp)}
                stroke="rgba(53, 162, 235, 0.8)"
                strokeWidth={2}
                curve={curveNatural}
              />
            </Group>
          </svg>
          <div className="flex absolute top-0 left-0 z-10 border-r-2 mx-8">
            {forecast.map((day, index) => {
              const WeatherIcon = getWeatherIcon(day.condition, false); // For daily forecast, always show daytime icon
              const formattedDate = day.date;
              return (
                <div 
                  key={index} 
                  className={`flex flex-col items-center ${textColor}`}
                  style={{ minWidth: `${dayWidth}px` }}
                >
                  <p className="font-bold text-sm">{formattedDate}</p>
                  <WeatherIcon size={40} className='pb-1'/>
                  <p className='font-bold text-lg pb-1'>{Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°</p>
                  <span className='flex items-center flex-row'>
                    <RainIcon className='mr-1' size={10}/>
                    <p className='text-xs'>{Math.round(day.chanceOfRain)}%</p>
                  </span>
                  <span className='flex items-center flex-row'>
                    <WindIcon className='mr-1' size={10}/>
                    <p className='text-xs'>{Math.round(day.windSpeed)} km/h</p>
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

export default DailyForecast;
