import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import MinuteRainChart from './MinuteRainChart'
import { CloudRainIcon } from "lucide-react"

interface PrecipitationAlertProps {
  minutelyData: Array<{
    dt: number;
    precipitation: number;
  }>;
  textColor: string;
  isDarkBackground: boolean;
  timezoneOffset: number;
}

const PrecipitationAlert: React.FC<PrecipitationAlertProps> = ({ 
  minutelyData, 
  textColor, 
  isDarkBackground,
  timezoneOffset
}) => {
  // Find when rain starts (first minute with precipitation)
  const rainStartsIn = minutelyData.findIndex(minute => minute.precipitation > 0);
  const rainStartsInMinutes = rainStartsIn === -1 ? null : rainStartsIn;

  const alertBackground = isDarkBackground ? 'bg-gray-800/50' : 'bg-white/50';
  const subtitleColor = isDarkBackground ? 'text-gray-300' : 'text-gray-600';

  return (
    <Alert className={`mb-8 border-none ${alertBackground} backdrop-blur-sm`}>
      <CloudRainIcon className={`h-4 w-4 ${textColor}`} />
      <AlertTitle className={textColor}>
        {rainStartsInMinutes === 0 
          ? "It's currently raining" 
          : `Rain starting in ${rainStartsInMinutes} minutes`}
      </AlertTitle>
      <AlertDescription>
        <p className={`text-xs font-light ${subtitleColor} mt-1`}>
          Minute by minute precipitation forecast
        </p>
        <div className="mt-2 h-32">
          <MinuteRainChart 
            data={minutelyData}
            textColor={textColor}
            isDarkBackground={isDarkBackground}
            timezoneOffset={timezoneOffset}
          />
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PrecipitationAlert;
