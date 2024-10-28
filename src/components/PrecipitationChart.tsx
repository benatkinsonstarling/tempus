import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"

interface PrecipitationData {
  label: string;
  precipitation: number; // This is probability of precipitation (0-100%)
}

interface PrecipitationChartProps {
  data: PrecipitationData[];
  textColor: string;
  isDarkBackground: boolean;
  showTooltipLabel?: boolean;
  isHourly?: boolean;
}

const PrecipitationChart: React.FC<PrecipitationChartProps> = ({ 
  data, 
  textColor, 
  isDarkBackground, 
  showTooltipLabel = true,
  isHourly = true
}) => {
  const chartConfig = {
    precipitation: {
      label: "Chance of Rain",
      color: isDarkBackground ? "url(#precipGradientDark)" : "url(#precipGradientLight)",
    },
  } satisfies ChartConfig
  
  const axisColor = isDarkBackground ? "rgb(209 213 219)" : "rgb(31 41 55)";

  // Filter data to show every 2 hours only if it's hourly data
  const filteredData = isHourly ? data.filter((_, index) => index % 2 === 0) : data;

  // Find the maximum precipitation value
  const maxPrecipitation = Math.max(...filteredData.map(d => d.precipitation));

  return (
    <div className="w-full h-full pb-4">
      <ChartContainer className="w-full h-full" config={chartConfig}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={filteredData} 
            margin={{ top: 10, right: 0, left: 0, bottom: 20 }}
            barCategoryGap={1}
          >
            <defs>
              <linearGradient id="precipGradientLight" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0284c7" /> {/* sky-600 */}
                <stop offset="100%" stopColor="#075985" /> {/* sky-800 */}
              </linearGradient>
              <linearGradient id="precipGradientDark" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#93c5fd" /> {/* blue-300 */}
                <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal={true} strokeDasharray="3 3" stroke={axisColor} opacity={0.1} />
            <XAxis
              dataKey="label"
              stroke={axisColor}
              tickLine={true}
              axisLine={{ stroke: axisColor, strokeDasharray: '5 5' }}
              interval={0}
              tick={{ dy: 10, fill: axisColor }}
            />
            <YAxis
              stroke={axisColor}
              tickLine={true}
              axisLine={{ stroke: axisColor, strokeDasharray: '5 5' }}
              tick={{ fill: axisColor }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: isDarkBackground ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
                border: 'none',
                borderRadius: '4px',
                padding: '8px'
              }}
              itemStyle={{ color: isDarkBackground ? '#fff' : '#1f2937' }}
              formatter={(value: number) => [`${value.toFixed(0)}%`, 'Chance of Rain']}
              labelFormatter={(label) => showTooltipLabel ? `${label}` : ''}
            />
            <Bar
              dataKey="precipitation"
              fill={chartConfig.precipitation.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default PrecipitationChart;
