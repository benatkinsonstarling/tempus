const weatherConditionMap: { [key: number]: string } = {
  // Thunderstorm
  200: "Thunderstorm with Light Rain",
  201: "Thunderstorm with Rain",
  202: "Thunderstorm with Heavy Rain",
  210: "Light Thunderstorm",
  211: "Thunderstorm",
  212: "Heavy Thunderstorm",
  221: "Ragged Thunderstorm",
  230: "Thunderstorm with Light Drizzle",
  231: "Thunderstorm with Drizzle",
  232: "Thunderstorm with Heavy Drizzle",
  
  // Drizzle
  300: "Light Drizzle",
  301: "Drizzle",
  302: "Heavy Drizzle",
  310: "Light Drizzle Rain",
  311: "Drizzle Rain",
  312: "Heavy Drizzle Rain",
  313: "Shower Rain and Drizzle",
  314: "Heavy Shower Rain and Drizzle",
  321: "Shower Drizzle",
  
  // Rain
  500: "Light Rain",
  501: "Moderate Rain",
  502: "Heavy Rain",
  503: "Very Heavy Rain",
  504: "Extreme Rain",
  511: "Freezing Rain",
  520: "Light Shower Rain",
  521: "Shower Rain",
  522: "Heavy Shower Rain",
  531: "Ragged Shower Rain",
  
  // Snow
  600: "Light Snow",
  601: "Snow",
  602: "Heavy Snow",
  611: "Sleet",
  612: "Light Shower Sleet",
  613: "Shower Sleet",
  615: "Light Rain and Snow",
  616: "Rain and Snow",
  620: "Light Shower Snow",
  621: "Shower Snow",
  622: "Heavy Shower Snow",
  
  // Atmosphere
  701: "Mist",
  711: "Smoke",
  721: "Haze",
  731: "Sand/Dust Whirls",
  741: "Fog",
  751: "Sand",
  761: "Dust",
  762: "Volcanic Ash",
  771: "Squalls",
  781: "Tornado",
  
  // Clear & Clouds
  800: "Clear Sky",
  801: "Few Clouds",
  802: "Scattered Clouds",
  803: "Broken Clouds",
  804: "Overcast Clouds",
};

export function getShortWeatherCondition(id: number): string {
  return weatherConditionMap[id] || "Unknown";
}
