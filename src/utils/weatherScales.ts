export const tempScale = [
  { threshold: -10, color: 'bg-indigo-700', label: 'Freezing' },
  { threshold: 0, color: 'bg-blue-600', label: 'Very Cold' },
  { threshold: 10, color: 'bg-blue-400', label: 'Cold' },
  { threshold: 20, color: 'bg-green-400', label: 'Mild' },
  { threshold: 25, color: 'bg-yellow-400', label: 'Warm' },
  { threshold: 30, color: 'bg-orange-400', label: 'Hot' },
  { threshold: 35, color: 'bg-red-500', label: 'Very Hot' },
];

export const windScale = [
  { min: 0, max: 5, color: 'bg-blue-200', label: 'Light breeze' },
  { min: 5, max: 15, color: 'bg-blue-300', label: 'Gentle breeze' },
  { min: 15, max: 25, color: 'bg-blue-400', label: 'Moderate breeze' },
  { min: 25, max: 35, color: 'bg-blue-500', label: 'Fresh breeze' },
  { min: 35, max: 50, color: 'bg-blue-600', label: 'Strong breeze' },
  { min: 50, max: Infinity, color: 'bg-blue-700', label: 'Gale force or stronger' },
];

export const rainChanceScale = [
  { threshold: 0, color: 'bg-sky-100', label: 'No Rain' },
  { threshold: 0.2, color: 'bg-sky-300', label: 'Slight Chance' },
  { threshold: 0.4, color: 'bg-sky-400', label: 'Chance' },
  { threshold: 0.6, color: 'bg-sky-500', label: 'Likely' },
  { threshold: 0.8, color: 'bg-sky-600', label: 'Very Likely' },
  { threshold: 0.95, color: 'bg-sky-700', label: 'Certain' },
];

export function getScaleInfo(value: number, scale: typeof tempScale) {
  const scaleInfo = scale.find((item, index) => 
    index === scale.length - 1 || value < scale[index + 1].threshold
  );
  const opacity = scaleInfo 
    ? Math.min(1, (value - scaleInfo.threshold) / (scale[scale.indexOf(scaleInfo) + 1]?.threshold - scaleInfo.threshold || 10))
    : 1;
  return { ...scaleInfo, opacity: opacity * 0.3 + 0.1 }; // Reduced opacity range from 0.1 to 0.4
}
