import React from 'react';
import { getAirQualityInfo } from '@/utils/airQualityScales';

interface AirQualityProps {
  aqi: number;
  textColor: string;
}

const AirQualityDisplay: React.FC<AirQualityProps> = ({ aqi, textColor }) => {
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
    </div>
  );
};

export default AirQualityDisplay;
