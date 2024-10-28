import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"

interface WindData {
  label: string;
  windSpeed: number;
}

interface WindChartProps {
  data: WindData[];
  textColor: string;
  isDarkBackground: boolean;
  showTooltipLabel?: boolean;
}

const WindChart: React.FC<WindChartProps> = ({ data, textColor, isDarkBackground, showTooltipLabel = true }) => {
  const chartConfig = {
    windSpeed: {
      label: "Wind Speed",
      color: isDarkBackground ? "url(#windGradientDark)" : "url(#windGradientLight)",
    },
  } satisfies ChartConfig
  
  const axisColor = isDarkBackground ? "rgb(209 213 219)" : "rgb(31 41 55)";

  // Beaufort Wind Scale thresholds in m/s
  const windScaleThresholds = [
    { speed: 0, description: "Calm" },
    { speed: 2, description: "Light Air" },
    { speed: 5, description: "Light Breeze" },
    { speed: 10, description: "Gentle Breeze" },
    { speed: 15, description: "Moderate Breeze" },
    { speed: 20, description: "Fresh Breeze" },
    { speed: 25, description: "Strong Breeze" },
    { speed: 30, description: "Near Gale" },
    { speed: 35, description: "Gale" },
    { speed: 40, description: "Strong Gale" },
  ];

  const getWindDescription = (speed: number): string => {
    const scale = windScaleThresholds.findLast(threshold => speed >= threshold.speed);
    return scale ? scale.description : "Calm";
  };

  return (
    <div className="h-full w-full mx-auto pb-4">
      <ChartContainer className="w-full h-full" config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="windGradientDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" /> {/* sky-500 */}
                <stop offset="50%" stopColor="#0284c7" /> {/* sky-800 */}
                <stop offset="100%" stopColor="#0c4a6e" /> {/* sky-900 */}
              </linearGradient>
              <linearGradient id="windGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" /> {/* sky-400 */}
                <stop offset="50%" stopColor="#0ea5e9" /> {/* sky-500 */}
                <stop offset="100%" stopColor="#0369a1" /> {/* sky-700 */}
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              stroke={axisColor}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tick={{ dy: 10 }}
            />
            <YAxis
              stroke={axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 40]} // Set fixed domain based on Beaufort scale
              ticks={windScaleThresholds.map(t => t.speed)} // Use wind scale thresholds
              tickFormatter={(value) => `${value}m/s`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: isDarkBackground ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
                border: 'none',
                borderRadius: '4px',
                padding: '8px'
              }}
              itemStyle={{ color: isDarkBackground ? '#fff' : '#1f2937' }}
              formatter={(value: number) => [
                `${value.toFixed(1)}m/s - ${getWindDescription(value)}`,
                'Wind Speed'
              ]}
              labelFormatter={(label) => showTooltipLabel ? `${label}` : ''}
            />
            <Bar
              dataKey="windSpeed"
              fill={isDarkBackground ? "url(#windGradientDark)" : "url(#windGradientLight)"}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default WindChart;
