import { useState, useEffect } from 'react';

export interface WeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    cloud_cover: number[];
    direct_radiation: number[];
    diffuse_radiation: number[];
    wind_speed_10m: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface SolarForecast {
  time: string[];
  production: number[];
  efficiency: number[];
}

// Weather code mapping to human-readable descriptions
export const weatherCodeToDescription: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

// Weather code to icon mapping
export const weatherCodeToIcon: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️❄️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️❄️',
  57: '🌧️❄️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️❄️',
  67: '🌧️❄️',
  71: '🌨️',
  73: '🌨️',
  75: '❄️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '🌧️',
  85: '🌨️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️'
};

// Safely access localStorage with error handling
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }
};

// Generate a fallback weather data object
const generateFallbackWeatherData = (): WeatherData => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Generate hourly timestamps for the next 24 hours
  const hourlyTimes: string[] = [];
  const hourlyTemps: number[] = [];
  const hourlyHumidity: number[] = [];
  const hourlyPrecipProb: number[] = [];
  const hourlyPrecip: number[] = [];
  const hourlyCloud: number[] = [];
  const hourlyRadiation: number[] = [];
  const hourlyDiffuseRadiation: number[] = [];
  const hourlyWind: number[] = [];
  const hourlyWeatherCode: number[] = [];
  const hourlyIsDay: number[] = [];
  
  // Generate daily timestamps for the next 7 days
  const dailyTimes: string[] = [];
  const dailyMaxTemps: number[] = [];
  const dailyMinTemps: number[] = [];
  const dailyPrecipSum: number[] = [];
  const dailyPrecipProb: number[] = [];
  const dailyWeatherCode: number[] = [];
  const dailySunrise: string[] = [];
  const dailySunset: string[] = [];
  
  // Generate hourly data
  for (let i = 0; i < 24; i++) {
    const hourDate = new Date(now);
    hourDate.setHours(currentHour + i);
    hourlyTimes.push(hourDate.toISOString());
    
    const hour = hourDate.getHours();
    const isDay = hour >= 6 && hour < 20 ? 1 : 0;
    
    // Generate some reasonable values
    hourlyTemps.push(15 + Math.sin((hour - 12) * Math.PI / 12) * 5); // Temperature varies from 10-20°C
    hourlyHumidity.push(60 + Math.random() * 20); // Humidity 60-80%
    hourlyPrecipProb.push(Math.random() * 30); // 0-30% precipitation probability
    hourlyPrecip.push(Math.random() * 0.5); // 0-0.5mm precipitation
    hourlyCloud.push(30 + Math.random() * 40); // 30-70% cloud cover
    
    // Solar radiation depends on time of day
    const radiation = isDay ? 
      Math.max(0, 600 * Math.sin((hour - 6) * Math.PI / 14)) : // Peak at noon
      0;
    hourlyRadiation.push(radiation);
    hourlyDiffuseRadiation.push(radiation * 0.3); // Diffuse is ~30% of direct
    
    hourlyWind.push(5 + Math.random() * 5); // 5-10 km/h wind
    hourlyWeatherCode.push(isDay ? 1 : 0); // Mainly clear
    hourlyIsDay.push(isDay);
  }
  
  // Generate daily data
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(now);
    dayDate.setDate(now.getDate() + i);
    dailyTimes.push(dayDate.toISOString().split('T')[0] + 'T00:00:00Z');
    
    dailyMaxTemps.push(18 + Math.random() * 5); // Max temp 18-23°C
    dailyMinTemps.push(10 + Math.random() * 5); // Min temp 10-15°C
    dailyPrecipSum.push(Math.random() * 2); // 0-2mm precipitation
    dailyPrecipProb.push(Math.random() * 40); // 0-40% precipitation probability
    dailyWeatherCode.push(Math.floor(Math.random() * 3)); // 0-2 (clear to partly cloudy)
    
    // Sunrise around 6 AM
    const sunriseDate = new Date(dayDate);
    sunriseDate.setHours(6, Math.floor(Math.random() * 30), 0);
    dailySunrise.push(sunriseDate.toISOString());
    
    // Sunset around 8 PM
    const sunsetDate = new Date(dayDate);
    sunsetDate.setHours(20, Math.floor(Math.random() * 30), 0);
    dailySunset.push(sunsetDate.toISOString());
  }
  
  return {
    current: {
      time: now.toISOString(),
      temperature_2m: 18,
      relative_humidity_2m: 65,
      apparent_temperature: 17,
      precipitation: 0,
      rain: 0,
      cloud_cover: 40,
      wind_speed_10m: 7,
      wind_direction_10m: 180,
      weather_code: 1,
      is_day: now.getHours() >= 6 && now.getHours() < 20 ? 1 : 0
    },
    hourly: {
      time: hourlyTimes,
      temperature_2m: hourlyTemps,
      relative_humidity_2m: hourlyHumidity,
      precipitation_probability: hourlyPrecipProb,
      precipitation: hourlyPrecip,
      cloud_cover: hourlyCloud,
      direct_radiation: hourlyRadiation,
      diffuse_radiation: hourlyDiffuseRadiation,
      wind_speed_10m: hourlyWind,
      weather_code: hourlyWeatherCode,
      is_day: hourlyIsDay
    },
    daily: {
      time: dailyTimes,
      temperature_2m_max: dailyMaxTemps,
      temperature_2m_min: dailyMinTemps,
      precipitation_sum: dailyPrecipSum,
      precipitation_probability_max: dailyPrecipProb,
      weather_code: dailyWeatherCode,
      sunrise: dailySunrise,
      sunset: dailySunset
    }
  };
};

/**
 * Fetches weather data from Open-Meteo API
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @returns Weather data
 */
export const fetchWeatherData = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    // Check for cached weather data first
    const cachedWeather = safeLocalStorage.getItem('weatherData');
    const cachedTimestamp = safeLocalStorage.getItem('weatherDataTimestamp');
    
    // Use cached data if it's less than 1 hour old
    if (cachedWeather && cachedTimestamp) {
      try {
        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        
        if (now - timestamp < oneHour) {
          return JSON.parse(cachedWeather) as WeatherData;
        }
      } catch (parseError) {
        console.warn('Error parsing cached weather data:', parseError);
        // Continue to fetch new data if parsing fails
      }
    }
    
    // Fetch new data with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,cloud_cover,direct_radiation,diffuse_radiation,wind_speed_10m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,sunrise,sunset&timezone=auto`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the weather data
      safeLocalStorage.setItem('weatherData', JSON.stringify(data));
      safeLocalStorage.setItem('weatherDataTimestamp', Date.now().toString());
      
      return data as WeatherData;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    
    // Try to use cached data even if it's old
    const cachedWeather = safeLocalStorage.getItem('weatherData');
    if (cachedWeather) {
      try {
        return JSON.parse(cachedWeather) as WeatherData;
      } catch (parseError) {
        console.warn('Error parsing old cached weather data:', parseError);
      }
    }
    
    // If all else fails, return fallback data
    return generateFallbackWeatherData();
  }
};

/**
 * Calculates solar production forecast based on weather data and system capacity
 * @param weatherData Weather data from Open-Meteo
 * @param systemCapacityKW System capacity in kilowatts
 * @returns Solar forecast data
 */
export const calculateSolarForecast = (weatherData: WeatherData, systemCapacityKW: number): SolarForecast => {
  const { hourly } = weatherData;
  
  // Calculate expected solar production based on direct radiation, cloud cover, and system capacity
  const production = hourly.direct_radiation.map((radiation, index) => {
    const cloudCover = hourly.cloud_cover[index];
    const isDay = hourly.is_day[index];
    
    // If it's night, no production
    if (isDay === 0) return 0;
    
    // Calculate efficiency factor based on cloud cover (0-100%)
    const cloudFactor = 1 - (cloudCover / 100) * 0.7; // Cloud cover reduces efficiency by up to 70%
    
    // Calculate production based on radiation (W/m²), system capacity, and cloud factor
    // Typical solar panel efficiency is around 15-20%
    const panelEfficiency = 0.18; // 18% efficiency
    
    // Convert W/m² to kW/m² and multiply by system size and efficiency factors
    const hourlyProduction = (radiation / 1000) * systemCapacityKW * cloudFactor * panelEfficiency;
    
    return parseFloat(hourlyProduction.toFixed(2));
  });
  
  // Calculate efficiency percentage (actual vs theoretical maximum)
  const efficiency = hourly.direct_radiation.map((radiation, index) => {
    if (radiation === 0) return 0;
    
    const cloudCover = hourly.cloud_cover[index];
    const cloudFactor = 1 - (cloudCover / 100) * 0.7;
    
    // Efficiency percentage based on cloud cover
    return parseFloat((cloudFactor * 100).toFixed(1));
  });
  
  return {
    time: hourly.time,
    production,
    efficiency
  };
};

/**
 * Custom hook to fetch weather data and calculate solar forecast
 * @param latitude Latitude of the location
 * @param longitude Longitude of the location
 * @param systemCapacityKW System capacity in kilowatts
 * @returns Weather data, solar forecast, loading state, and error
 */
export const useWeatherData = (latitude: number, longitude: number, systemCapacityKW: number) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [solarForecast, setSolarForecast] = useState<SolarForecast | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!latitude || !longitude) {
        setError('Invalid location coordinates');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await fetchWeatherData(latitude, longitude);
        setWeatherData(data);
        
        // Calculate solar forecast based on weather data
        const forecast = calculateSolarForecast(data, systemCapacityKW);
        setSolarForecast(forecast);
        
        setError(null);
      } catch (err) {
        console.error('Weather data error:', err);
        setError('Failed to fetch weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 minutes
    const intervalId = setInterval(fetchData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [latitude, longitude, systemCapacityKW]);
  
  return { weatherData, solarForecast, isLoading, error };
}; 