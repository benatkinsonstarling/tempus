import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';

interface DayInfo {
  date: string;
  sunrise: string;
  sunset: string;
}

interface DailySunriseSunsetTableProps {
  days: DayInfo[];
  textColor: string;
}

const DailySunriseSunsetTable: React.FC<DailySunriseSunsetTableProps> = ({ days, textColor }) => {
  return (
    <div className={`w-full h-full flex flex-col ${textColor}`}>
      <h3 className="text-base font-semibold text-center mb-2">Daily Sunrise & Sunset</h3>
      <div className="overflow-auto flex-grow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left opacity-70">
              <th className="pb-2 pl-2">Day</th>
              <th className="pb-2">
                <Sunrise className="h-4 w-4 inline mr-1" />
                Sunrise
              </th>
              <th className="pb-2">
                <Sunset className="h-4 w-4 inline mr-1" />
                Sunset
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => (
              <tr key={index} className="border-t border-current border-opacity-10">
                <td className="py-2 pl-2">
                  <div className="font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </td>
                <td className="py-2">
                  <div className="font-semibold">{day.sunrise}</div>
                </td>
                <td className="py-2">
                  <div className="font-semibold">{day.sunset}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailySunriseSunsetTable;
