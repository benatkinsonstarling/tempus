// hooks/useSavedLocations.ts
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface SavedLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
}

interface SaveLocationRequest {
  name: string;
  latitude: number;
  longitude: number;
  isFavorite?: boolean;
}

export function useSavedLocations() {
  const { userId, getToken } = useAuth();
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all saved locations
  const fetchLocations = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch('http://localhost:8080/api/locations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch locations');
      
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new location
  const saveLocation = async (location: SaveLocationRequest) => {
      console.log('Sending request:', location); // Add this for debugging

    if (!userId) return;

    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch('http://localhost:8080/api/locations/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      });

      console.log('Response:', response); // Add this for debugging

      if (!response.ok) throw new Error('Failed to save location');

      const savedLocation = await response.json();
      setLocations(prev => [...prev, savedLocation]);
      return savedLocation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Load locations when user is available
  useEffect(() => {
    if (userId) {
      fetchLocations();
    }
  }, [userId]);

  return {
    locations,
    isLoading,
    error,
    saveLocation,
    refreshLocations: fetchLocations
  };
}