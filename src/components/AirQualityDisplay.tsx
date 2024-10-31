import React from 'react';
import { getAirQualityInfo, getPollutantLevel } from '@/utils/airQualityScales';

interface AirQualityProps {
  aqi: number;
  components?: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  textColor: string;
}

const AirQualityDisplay: React.FC<AirQualityProps> = ({ aqi, components, textColor }) => {
  const aqInfo = getAirQualityInfo(aqi);
  const Icon = aqInfo.icon;

  return (
    <div className={`w-full rounded-lg ${textColor} h-fit`}>
      <h3 className="text-base font-semibold text-center mb-2">Air Quality</h3>
      <div className="flex items-center justify-center space-x-4">
        <div className={`p-2 rounded-full ${aqInfo.bgColor} bg-opacity-20`}>
          <Icon className={`h-6 w-6 ${aqInfo.color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{aqi}</p>
          <p className={`text-sm font-medium ${aqInfo.color}`}>{aqInfo.label}</p>
        </div>
      </div>
      <p className="text-xs text-center mt-2 opacity-80">{aqInfo.description}</p>
      
      {components && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span>CO:</span>
            <span>{components.co.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span>NO₂:</span>
            <span>{components.no2.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span>O₃:</span>
            <span>{components.o3.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span>SO₂:</span>
            <span>{components.so2.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span>PM2.5:</span>
            <span>{components.pm2_5.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span>PM10:</span>
            <span>{components.pm10.toFixed(1)} μg/m³</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirQualityDisplay;
