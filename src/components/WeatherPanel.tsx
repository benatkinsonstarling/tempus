import { useEffect, useState } from "react";
import { WeatherData } from "@/types/types";
import { getBackgroundColor, getWeatherIcon, isLightGradient } from "@/utils/weatherUtils";
import { fetchWeatherData } from "@/utils/api";
import { Star, X } from "lucide-react";
import { toast } from "sonner";

interface WeatherPanelProps {
  location: string;
  latitude: number;
  longitude: number;
  onClick: () => void;
  isFavorite?: boolean;
  id: string;
  onDelete: (id: string) => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
}

export default function WeatherPanel({ 
  location, 
  latitude, 
  longitude, 
  onClick, 
  isFavorite,
  id,
  onDelete,
  onToggleFavorite
}: WeatherPanelProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        const data = await fetchWeatherData(
          latitude, 
          longitude, 
          new Date().toISOString()
        );
        setWeatherData(data);
        
        // Set initial local time
        const time = new Date((Date.now() / 1000 + data.timezone_offset) * 1000);
        setLocalTime(time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        }));
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWeatherData();
  }, [latitude, longitude]);

  // Update time every minute
  useEffect(() => {
    if (!weatherData) return;

    const interval = setInterval(() => {
      const time = new Date((Date.now() / 1000 + weatherData.timezone_offset) * 1000);
      setLocalTime(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [weatherData]);

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

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the panel click
    if (isTogglingFavorite) return;

    try {
      setIsTogglingFavorite(true);
      await onToggleFavorite(id);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error("Failed to update favorite status");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (isLoading || !weatherData) {
    return <div className="w-full h-14 mb-2 rounded-lg bg-gray-200 animate-pulse" />;
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
    <div className="relative group/panel">
      <button
        onClick={handleDelete}
        className={`absolute -top-2 -right-2 z-10 opacity-0 group-hover/panel:opacity-100 
          transition-opacity duration-200 rounded-full bg-gray-800 p-1
          hover:bg-gray-700 ${isDeleting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={isDeleting}
      >
        <X className="h-3 w-3 text-white" />
      </button>

      <button 
        onClick={onClick}
        className={`w-full h-14 mb-2 rounded-lg ${gradient} transition-all duration-300 
          hover:scale-[1.02] cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)]
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]`}
      >
        <div className="h-full w-full px-3 py-2 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h3 className={`text-sm font-semibold ${textColor}`}>{location}</h3>
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`transition-opacity duration-200 ${isTogglingFavorite ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
              >
                <Star 
                  className={`h-3 w-3 ${textColor} ${isFavorite ? 'fill-current' : 'stroke-current'}`}
                />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold ${textColor}`}>
                {Math.round(current.temp)}°C
              </span>
              <span className={`text-xs ${textColor} opacity-75`}>
                {localTime}
              </span>
            </div>
          </div>
          
          <div className="flex items-center">
            <WeatherIcon size={30} color={isLight ? "#1f2937" : "#f1f5f9"} />
          </div>
        </div>
      </button>
    </div>
  );
} 