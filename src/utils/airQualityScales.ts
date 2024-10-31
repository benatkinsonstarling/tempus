import { ThumbsUp, Activity, AlertTriangle, AlertCircle, Skull } from "lucide-react"

// Based on OpenWeatherMap AQI scale
export const airQualityScale = [
  {
    range: [1, 1],
    label: 'Good',
    description: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    icon: ThumbsUp,
    pollutantRanges: {
      SO2: [0, 20],      // μg/m3
      NO2: [0, 40],      // μg/m3
      PM10: [0, 20],     // μg/m3
      PM2_5: [0, 10],    // μg/m3
      O3: [0, 60],       // μg/m3
      CO: [0, 4400],     // μg/m3
    }
  },
  {
    range: [2, 2],
    label: 'Fair',
    description: 'Air quality is acceptable; however, some pollutants may be moderate.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    icon: Activity,
    pollutantRanges: {
      SO2: [20, 80],
      NO2: [40, 70],
      PM10: [20, 50],
      PM2_5: [10, 25],
      O3: [60, 100],
      CO: [4400, 9400],
    }
  },
  {
    range: [3, 3],
    label: 'Moderate',
    description: 'Members of sensitive groups may experience health effects.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    icon: AlertTriangle,
    pollutantRanges: {
      SO2: [80, 250],
      NO2: [70, 150],
      PM10: [50, 100],
      PM2_5: [25, 50],
      O3: [100, 140],
      CO: [9400, 12400],
    }
  },
  {
    range: [4, 4],
    label: 'Poor',
    description: 'Everyone may begin to experience health effects.',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    icon: AlertCircle,
    pollutantRanges: {
      SO2: [250, 350],
      NO2: [150, 200],
      PM10: [100, 200],
      PM2_5: [50, 75],
      O3: [140, 180],
      CO: [12400, 15400],
    }
  },
  {
    range: [5, 5],
    label: 'Very Poor',
    description: 'Health warnings of emergency conditions. Entire population is likely to be affected.',
    color: 'text-purple-900',
    bgColor: 'bg-purple-900',
    icon: Skull,
    pollutantRanges: {
      SO2: [350, Infinity],
      NO2: [200, Infinity],
      PM10: [200, Infinity],
      PM2_5: [75, Infinity],
      O3: [180, Infinity],
      CO: [15400, Infinity],
    }
  }
];

export const getAirQualityInfo = (aqi: number) => {
  return airQualityScale.find(
    scale => aqi >= scale.range[0] && aqi <= scale.range[1]
  ) || airQualityScale[0]; // Default to "Good" if no match found
};

// New helper function to get detailed pollutant assessment
export const getPollutantLevel = (pollutant: keyof typeof airQualityScale[0]['pollutantRanges'], value: number) => {
  for (const level of airQualityScale) {
    const range = level.pollutantRanges[pollutant];
    if (value >= range[0] && value <= range[1]) {
      return level;
    }
  }
  return airQualityScale[airQualityScale.length - 1]; // Return "Very Poor" if above all ranges
};
