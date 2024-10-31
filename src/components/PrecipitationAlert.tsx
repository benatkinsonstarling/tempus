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
  // Find significant rain periods (>0.2mm and lasting >5 minutes)
  const significantRainMinutes = minutelyData.filter(minute => minute.precipitation > 0.2).length;
  if (significantRainMinutes < 5) return null;

  // Find when rain starts (first minute with significant precipitation)
  const currentTime = Math.floor(Date.now() / 1000);
  const rainStartIndex = minutelyData.findIndex(minute => minute.precipitation > 0.2);
  
  // Calculate minutes until rain starts, considering timezone
  const rainStartsInMinutes = rainStartIndex === -1 
    ? null 
    : Math.round((minutelyData[rainStartIndex].dt - currentTime) / 60);

  const alertBackground = isDarkBackground ? 'bg-gray-800/50' : 'bg-white/50';
  const subtitleColor = isDarkBackground ? 'text-gray-300' : 'text-gray-600';

  // Helper function to format the time message
  const getRainMessage = () => {
    if (rainStartsInMinutes === null) {
      return "No significant rain expected in the next hour";
    }
    if (rainStartsInMinutes <= 0) {
      return "It's currently raining";
    }
    if (rainStartsInMinutes === 1) {
      return "Rain starting in 1 minute";
    }
    return `Rain starting in ${rainStartsInMinutes} minutes`;
  };

  return (
    <Alert className={`mb-8 border-none ${alertBackground} backdrop-blur-sm`}>
      <CloudRainIcon className={`h-4 w-4 ${textColor}`} />
      <AlertTitle className={textColor}>
        {getRainMessage()}
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
