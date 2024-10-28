'use client';

import { AppSidebar } from "@/components/AppSidebar"
import WeatherDisplay from "@/components/WeatherDisplay"
import SearchBar from "@/components/SearchBar"
import { useEffect, useState } from "react"
import { WeatherData, DestinationOption } from "@/types/types"
import { getBackgroundColor, isLightGradient } from "@/utils/weatherUtils"
import { fetchWeatherData, getPlaceDetails } from "@/utils/api"
import { CloudSunRainIcon } from "lucide-react"
import { ActionMeta, SingleValue } from "react-select"

export default function Page() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [backgroundGradient, setBackgroundGradient] = useState("")
  const [isLight, setIsLight] = useState(true)
  const [selectedDestination, setSelectedDestination] = useState<DestinationOption | null>(null)

  const loadDestinationOptions = async (inputValue: string, callback: (options: DestinationOption[]) => void) => {
    if (inputValue.length < 2) return callback([]);

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
            'X-Goog-FieldMask': 'places.displayName,places.id',
          },
          body: JSON.stringify({
            textQuery: inputValue,
            languageCode: "en",
          }),
        }
      );
      const data = await response.json();
      const options = data.places?.map((place: any) => ({
        value: place.id,
        label: place.displayName.text,
      })) || [];
      callback(options);
    } catch (error) {
      console.error('Error loading options:', error);
      callback([]);
    }
  };

  const handleDestinationChange = (
    newValue: SingleValue<DestinationOption>,
    actionMeta: ActionMeta<DestinationOption>
  ) => {
    setSelectedDestination(newValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDestination) return;

    try {
      const { lat, lon, localTime } = await getPlaceDetails(selectedDestination.value);
      const weatherData = await fetchWeatherData(lat, lon, localTime);
      
      if (weatherData) {
        setWeatherData(weatherData);
        const gradient = getBackgroundColor(
          weatherData.current.condition.text,
          weatherData.current.temp_c,
          localTime,
          weatherData.forecast.forecastday[0].astro.sunset,
          weatherData.forecast.forecastday[0].astro.sunrise
        );
        setBackgroundGradient(gradient);
        setIsLight(isLightGradient(gradient));
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleLogoClick = () => {
    if (weatherData) {
      setWeatherData(null);
      setSelectedDestination(null);
      setBackgroundGradient("");
      setIsLight(true);
    }
  };


  console.log('selectedDestination', selectedDestination);
  return (
    <div className={`flex min-h-screen transition-all duration-500 ${backgroundGradient || 'bg-gradient-to-b from-blue-400 to-blue-600'}`}>
      <AppSidebar backgroundGradient={backgroundGradient} />
      <main className="flex-1 flex flex-col items-center">
        <div className={`w-full max-w-5xl transition-all duration-500 ${
          weatherData 
            ? 'pt-8' 
            : 'flex flex-col items-center justify-center min-h-screen'
        }`}>
          <div className={`text-center w-full transition-all duration-500 ${
            weatherData ? 'mb-8' : 'mb-16'
          }`}>
            <h1 
              className={`flex items-center text-gray-200 justify-center text-2xl font-bold ${
                weatherData ? 'text-2xl cursor-pointer hover:opacity-80' : ''
              }`}
              onClick={handleLogoClick}
            >
              tempus  
              <CloudSunRainIcon className="ml-2" size={40} />
            </h1>
            {!weatherData && (
              <p className="text-md font-light text-gray-200 mb-8">
                weather, where you are
              </p>
            )}
            <div className="w-full max-w-4xl mx-auto px-4">
              <SearchBar
                selectedDestinationOption={selectedDestination}
                handleDestinationChange={handleDestinationChange}
                loadDestinationOptions={loadDestinationOptions}
                handleSubmit={handleSubmit}
                isLight={isLight}
              />
            </div>
          </div>

          {weatherData && (
            <div className="w-full transition-opacity duration-500">
              <WeatherDisplay 
                weatherData={weatherData}
                backgroundGradient={backgroundGradient}
                isLight={isLight}
                location={selectedDestination?.label}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
