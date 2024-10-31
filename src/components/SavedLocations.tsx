"use client"

import { useSavedLocations } from "@/hooks/useSavedLocations";
import { MapPinIcon } from "lucide-react";
import { Button } from "./ui/button";

interface SavedLocationsProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export function SavedLocations({ onLocationSelect }: SavedLocationsProps) {
  const { locations, isLoading, error } = useSavedLocations();

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

  return (
    <div className="flex flex-col gap-2 p-4">
      {locations.map((location) => (
        <Button
          key={location.id}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onLocationSelect(location.latitude, location.longitude)}
        >
          <MapPinIcon className="mr-2 h-4 w-4" />
          {location.name}
        </Button>
      ))}
    </div>
  );
} 