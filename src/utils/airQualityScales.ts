import { Wind, AlertCircle, AlertTriangle, Skull, Activity, ThumbsUp } from "lucide-react"

export const airQualityScale = [
  {
    range: [0, 50],
    label: 'Good',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    icon: ThumbsUp,
  },
  {
    range: [51, 100],
    label: 'Moderate',
    description: 'Air quality is acceptable. However, there may be a risk for some people.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    icon: Activity,
  },
  {
    range: [101, 150],
    label: 'Unhealthy for Sensitive Groups',
    description: 'Members of sensitive groups may experience health effects.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    icon: AlertTriangle,
  },
  {
    range: [151, 200],
    label: 'Unhealthy',
    description: 'Everyone may begin to experience health effects.',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    icon: AlertCircle,
  },
  {
    range: [201, 300],
    label: 'Very Unhealthy',
    description: 'Health warnings of emergency conditions.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    icon: Wind,
  },
  {
    range: [301, Infinity],
    label: 'Hazardous',
    description: 'Health alert: everyone may experience serious health effects.',
    color: 'text-red-900',
    bgColor: 'bg-red-900',
    icon: Skull,
  },
];

export const getAirQualityInfo = (aqi: number) => {
  return airQualityScale.find(
    scale => aqi >= scale.range[0] && aqi <= scale.range[1]
  ) || airQualityScale[airQualityScale.length - 1];
};
