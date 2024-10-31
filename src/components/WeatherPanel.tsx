import { useEffect, useState } from "react";
import { WeatherData } from "@/types/types";
import { getBackgroundColor, getWeatherIcon, isLightGradient } from "@/utils/weatherUtils";
import { fetchWeatherData } from "@/utils/api";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface WeatherPanelProps {
  location: string;
  latitude: number;
  longitude: number;
  onClick: () => void;
  isFavorite?: boolean;
  id: string;
  onDelete: (id: string) => Promise<void>;
}

export default function WeatherPanel({ 
  location, 
  latitude, 
  longitude, 
  onClick, 
  isFavorite,
  id,
  onDelete 
}: WeatherPanelProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchWeatherData(
          latitude, 
          longitude, 
          new Date().toISOString()
        );
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeatherData();
  }, [latitude, longitude]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the panel click
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await onDelete(id);
      toast.success("Location deleted");
    } catch (error) {
      toast.error("Failed to delete location");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !weatherData) {
    return <div className="w-full h-12 mb-2 rounded-lg bg-gray-200 animate-pulse" />;
  }

  const { current } = weatherData;
  const WeatherIcon = getWeatherIcon(
    current.weather[0].id,
    current.dt > current.sunset || current.dt < current.sunrise
  );
  
  const gradient = getBackgroundColor(
    current.weather[0].id,
    current.temp,
    current.dt,
    current.sunset,
    current.sunrise
  );

  const isLight = isLightGradient(gradient);
  const textColor = isLight ? 'text-gray-800' : 'text-gray-100';

  return (
    <button 
      onClick={onClick}
      className={`w-full h-12 mb-2 rounded-lg ${gradient} transition-all duration-300 hover:scale-[1.02] cursor-pointer relative group`}
    >
      <div className="h-full w-full px-3 py-1 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <h3 className={`text-sm font-semibold ${textColor}`}>{location}</h3>
            {isFavorite && <Star className={`h-3 w-3 fill-current ${textColor}`} />}
          </div>
          <span className={`text-base font-bold ${textColor}`}>
            {Math.round(current.temp)}°C
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <WeatherIcon size={18} color={isLight ? "#1f2937" : "#f1f5f9"} />
          <button
            onClick={handleDelete}
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full 
              hover:bg-black/10 ${isDeleting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={isDeleting}
          >
            <Trash2 className={`h-4 w-4 ${textColor}`} />
          </button>
        </div>
      </div>
    </button>
  );
} 