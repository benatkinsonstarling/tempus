import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"
import { formatInTimeZone } from 'date-fns-tz';

interface MinuteData {
  dt: number;
  precipitation: number;
}

interface MinuteRainChartProps {
  data: MinuteData[];
  textColor: string;
  isDarkBackground: boolean;
  timezoneOffset: number; // Change from timezone string to offset number
}

const MinuteRainChart: React.FC<MinuteRainChartProps> = ({ 
  data, 
  textColor, 
  isDarkBackground,
  timezoneOffset 
}) => {
  const chartConfig = {
    precipitation: {
      label: "Rain Intensity",
      color: isDarkBackground ? "url(#rainGradientDark)" : "url(#rainGradientLight)",
    },
  } satisfies ChartConfig
  
  const axisColor = isDarkBackground ? "rgb(209 213 219)" : "rgb(31 41 55)";

  // Format the time for display
  const formatMinute = (timestamp: number) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC'
    });
  };

  // Show every minute but only label every 5th minute
  const shouldShowLabel = (index: number) => index % 5 === 0;

  return (
    <div className="w-full h-full">
      <ChartContainer className="w-full h-full" config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
            barCategoryGap={0}
            barGap={0}
          >
            <defs>
              <linearGradient id="rainGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" /> {/* blue-400 */}
                <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
              </linearGradient>
              <linearGradient id="rainGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
                <stop offset="100%" stopColor="#2563eb" /> {/* blue-600 */}
              </linearGradient>
            </defs>
            <XAxis
              dataKey="dt"
              stroke={axisColor}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatMinute}
              interval={10} // Show label every 5th minute
              tick={{ dy: 10, fill: axisColor }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: isDarkBackground ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
                border: 'none',
                borderRadius: '4px',
                padding: '8px'
              }}
              itemStyle={{ color: isDarkBackground ? '#fff' : '#1f2937' }}
              formatter={(value: number) => [`${value.toFixed(1)}mm`, 'Rain']}
              labelFormatter={formatMinute}
            />
            <Bar
              dataKey="precipitation"
              fill={isDarkBackground ? "url(#rainGradientDark)" : "url(#rainGradientLight)"}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MinuteRainChart;
