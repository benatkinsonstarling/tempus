import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
  textColor: string;
}

const SunriseSunsetChart: React.FC<SunriseSunsetProps> = ({ sunrise, sunset, textColor }) => {
  return (
    <div className={`w-full h-full flex flex-col justify-center ${textColor}`}>
      <div className="flex justify-between flex-col items-center">
        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-yellow-100 rounded-full">
            <Sunrise className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className={`text-sm font-medium ${textColor}`}>Sunrise</p>
            <p className={`text-lg font-bold ${textColor}`}>{sunrise}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-100 rounded-full">
            <Sunset className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className={`text-sm font-medium ${textColor}`}>Sunset</p>
            <p className={`text-lg font-bold ${textColor}`}>{sunset}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunriseSunsetChart;
