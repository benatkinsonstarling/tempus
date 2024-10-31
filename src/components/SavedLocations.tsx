import { useSavedLocations } from "@/hooks/useSavedLocations";
import WeatherPanel from "./WeatherPanel";

interface SavedLocationsProps {
  onLocationSelect: (lat: number, lon: number, locationName: string) => void;
}

export function SavedLocations({ onLocationSelect }: SavedLocationsProps) {
  const { locations, isLoading, error, deleteLocation } = useSavedLocations();
  
  if (isLoading) {
    return <div className="p-4">Loading saved locations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading locations: {error}</div>;
  }

  if (locations.length === 0) {
    return (
      <div className="p-4 text-muted-foreground">
        No saved locations yet. Search for a location and save it to see it here!
      </div>
    );
  }

  // Separate favorites and non-favorites
  const favoriteLocations = locations.filter(loc => loc.isFavorite);
  const nonFavoriteLocations = locations
    .filter(loc => !loc.isFavorite)
    .slice(0, 3); // Take only the 3 most recent

  // Combine favorites and recent non-favorites
  const locationsToDisplay = [...favoriteLocations, ...nonFavoriteLocations];

  return (
    <div className="flex flex-col gap-2 p-4">
      {locationsToDisplay.map((location) => (
        <WeatherPanel 
          key={location.id} 
          id={location.id}
          location={location.name} 
          latitude={location.latitude}
          longitude={location.longitude}
          onClick={() => onLocationSelect(location.latitude, location.longitude, location.name)}
          isFavorite={location.isFavorite}
          onDelete={deleteLocation}
        />
      ))}
    </div>
  );
} 